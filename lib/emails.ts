// Confirmation email templates for donations and cup purchases. Kept as
// table-based inline-styled HTML (not the site's own CSS) since that's what
// renders reliably across email clients.
import type { TransactionRecord } from "./kv";
import { SITE_URL } from "./site";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function button(label: string, url: string): string {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:28px auto 0;">
<tr><td bgcolor="#b8874a" style="border-radius:10px;">
<a href="${url}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">${label}</a>
</td></tr>
</table>`;
}

function wrapEmail(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body style="margin:0;padding:0;background-color:#faf5ec;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#faf5ec">
<tr>
<td align="center" style="padding:40px 16px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#fffdf9;border-radius:16px;border:1px solid #e7cda0;">
<tr>
<td style="padding:40px 40px 8px 40px;text-align:center;">
<div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:700;color:#2f2a22;">Where Is Venom?</div>
<div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:14px;color:#93672f;margin-top:4px;">A True Story of Faith &amp; Recovery</div>
</td>
</tr>
<tr>
<td style="padding:16px 40px 40px 40px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#2f2a22;">
${bodyHtml}
</td>
</tr>
<tr>
<td style="padding:24px 40px;background-color:#f6ecdc;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#7d6f5c;border-radius:0 0 16px 16px;">
Where Is Venom? — Queen Xtelle<br>
Questions? Reply to this email or write to queenxtelle@gmail.com
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}

interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export function donationConfirmationEmail(record: TransactionRecord): RenderedEmail {
  const greetingName = record.name ? escapeHtml(record.name) : "friend";
  const amount = `${record.currency} ${record.amount.toLocaleString()}`;

  const html = wrapEmail(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:20px;margin:0 0 16px;color:#2f2a22;">Thank you, ${greetingName}.</h1>
<p style="margin:0 0 16px;">We received your donation of <strong>${amount}</strong> toward Venom&rsquo;s surgery, medical expenses, rehabilitation and ongoing care.</p>
<p style="margin:0 0 16px;">Every gift — large or small — is a thread in this family&rsquo;s story of faith and recovery. Thank you for walking this journey with us.</p>
<p style="margin:0;color:#7d6f5c;font-size:13px;">Reference: ${escapeHtml(record.reference)}</p>
${button("Visit Where Is Venom?", SITE_URL)}
`);

  const text = `Thank you, ${record.name || "friend"}.

We received your donation of ${amount} toward Venom's surgery, medical expenses, rehabilitation and ongoing care.

Every gift — large or small — is a thread in this family's story of faith and recovery. Thank you for walking this journey with us.

Reference: ${record.reference}

${SITE_URL}`;

  return { subject: `Thank you for your ${amount} donation`, html, text };
}

export function cupConfirmationEmail(record: TransactionRecord): RenderedEmail {
  const greetingName = record.name ? escapeHtml(record.name) : "friend";
  const amount = `${record.currency} ${record.amount.toLocaleString()}`;
  const qty = record.qty || 1;
  const cupsLabel = `${qty} cup${qty > 1 ? "s" : ""}`;
  const shippingLine =
    record.street && record.city && record.state && record.country
      ? `${escapeHtml(record.street)}, ${escapeHtml(record.city)}, ${escapeHtml(record.state)}, ${escapeHtml(record.country)}`
      : "";

  const html = wrapEmail(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:20px;margin:0 0 16px;color:#2f2a22;">Thank you, ${greetingName}.</h1>
<p style="margin:0 0 16px;">Your sponsorship of <strong>${cupsLabel}</strong> of XS Skin Glow Herbal Soap (${amount}) is confirmed.</p>
<p style="margin:0 0 16px;">Please note: these soaps are handmade and produced in batches. Dispatch will begin after the 3-day campaign closes — thank you for your patience and for supporting Venom through your purchase.</p>
${shippingLine ? `<p style="margin:0 0 16px;">Shipping to: ${shippingLine}</p>` : ""}
${record.notes ? `<p style="margin:0 0 16px;font-style:italic;color:#7d6f5c;">Your note: &ldquo;${escapeHtml(record.notes)}&rdquo;</p>` : ""}
<p style="margin:0;color:#7d6f5c;font-size:13px;">Reference: ${escapeHtml(record.reference)}</p>
${button("Visit Where Is Venom?", SITE_URL)}
`);

  const text = `Thank you, ${record.name || "friend"}.

Your sponsorship of ${cupsLabel} of XS Skin Glow Herbal Soap (${amount}) is confirmed.

Please note: these soaps are handmade and produced in batches. Dispatch will begin after the 3-day campaign closes — thank you for your patience and for supporting Venom through your purchase.
${shippingLine ? `\nShipping to: ${shippingLine}\n` : ""}${record.notes ? `\nYour note: "${record.notes}"\n` : ""}
Reference: ${record.reference}

${SITE_URL}`;

  return { subject: `Your ${cupsLabel} sponsorship is confirmed`, html, text };
}
