import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, relationship, email, message } = body ?? {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const submission = {
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      relationship: typeof relationship === "string" ? relationship.trim() : "Supporter",
      email: typeof email === "string" ? email.trim() : "",
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Store in Redis if available
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (url && token) {
      try {
        const { Redis } = await import("@upstash/redis");
        const redis = new Redis({ url, token });
        await redis.lpush("wiv:memorial_submissions", submission);
      } catch (err) {
        console.error("Failed to persist memorial submission to Redis:", err);
      }
    }

    // Notify Queen Xtelle via Resend if available
    if (process.env.RESEND_API_KEY) {
      try {
        const emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #2f2a22; background: #faf5ec; border: 1px solid #e7cda0; border-radius: 8px;">
            <h2 style="color: #93672f; margin-top: 0;">New Memory of Venom Received</h2>
            <p><strong>From:</strong> ${escapeHtml(submission.name)} (${escapeHtml(submission.relationship)})</p>
            ${submission.email ? `<p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>` : ""}
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <div style="margin: 20px 0; padding: 16px; background: #fffdf9; border-left: 4px solid #b8874a; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(submission.message)}</div>
            <p style="font-size: 13px; color: #7d6f5c;">This memory is awaiting family review before any public display.</p>
          </div>
        `;

        await sendEmail({
          to: "queenxtelle@gmail.com",
          subject: `New Memory of Venom from ${submission.name}`,
          html: emailHtml,
          text: `New Memory of Venom from ${submission.name} (${submission.relationship}):\n\n${submission.message}\n\nEmail: ${submission.email || "Not provided"}`,
        });
      } catch (err) {
        console.error("Failed to send notification email:", err);
      }
    }

    return NextResponse.json({ success: true, id: submission.id });
  } catch (err) {
    console.error("Memorial submit route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
