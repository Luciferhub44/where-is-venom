// Server-only helper for sending transactional email via Resend's REST API.
// NEVER import this file from a "use client" component — it uses the API key.
const RESEND_API_URL = "https://api.resend.com/emails";
const FROM = "Where Is Venom? <noreply@whereisvenom.com>";
const REPLY_TO = "queenxtelle@gmail.com";

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
}

// Never throws — a failed confirmation email should never fail the
// underlying donation/purchase, it's just logged.
export async function sendEmail({ to, subject, html, text }: SendEmailArgs): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping confirmation email");
    return;
  }
  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html, text, reply_to: REPLY_TO }),
    });
    if (!res.ok) {
      console.error("Resend send failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Resend send error:", err);
  }
}
