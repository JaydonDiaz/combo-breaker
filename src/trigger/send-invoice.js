import { schemaTask, logger, AbortTaskRunError } from "@trigger.dev/sdk";
import { z } from "zod";
import { createHash } from "crypto";
import { Composio } from "@composio/core";
import { generateInvoicePDF } from "../lib/generate-pdf.jsx";
import { computeTotals, formatCurrency, formatDate } from "../lib/types.js";

const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity:    z.number().positive(),
  unitPrice:   z.number().nonnegative(),
});

const invoiceSchema = z.object({
  clientName:    z.string().min(1),
  clientEmail:   z.string().email(),
  clientAddress: z.string().default(""),
  invoiceNumber: z.string().min(1),
  invoiceDate:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dueDate:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  items:         z.array(lineItemSchema).min(1),
  taxRate:       z.number().nonnegative().default(0),
  notes:         z.string().default(""),
  subtotal:      z.number(),
  taxAmount:     z.number(),
  total:         z.number(),
});

function buildEmailHTML(data) {
  const itemRows = data.items.map(i => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #FECDD3;">${i.description}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #FECDD3;text-align:center;">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #FECDD3;text-align:right;">${formatCurrency(i.unitPrice)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #FECDD3;text-align:right;font-weight:600;">${formatCurrency(i.quantity * i.unitPrice)}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
    <tr><td style="background:#C41E3A;padding:28px 32px;">
      <p style="margin:0;font-size:22px;font-weight:700;color:#fff;letter-spacing:1px;">COMBO BREAKER</p>
      <p style="margin:4px 0 0;font-size:12px;color:#FECDD3;">Fight Ready. Always.</p>
    </td></tr>
    <tr><td style="padding:28px 32px 16px;">
      <p style="margin:0;font-size:15px;color:#111827;">Hi ${data.clientName},</p>
      <p style="margin:12px 0 0;font-size:14px;color:#6B7280;line-height:1.6;">Please find your invoice attached. A summary is included below for your records.</p>
    </td></tr>
    <tr><td style="padding:0 32px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F8;border-radius:6px;padding:16px;">
        <tr><td style="font-size:12px;color:#6B7280;padding:3px 0;">Invoice Number</td><td style="font-size:12px;font-weight:600;color:#C41E3A;text-align:right;">${data.invoiceNumber}</td></tr>
        <tr><td style="font-size:12px;color:#6B7280;padding:3px 0;">Invoice Date</td><td style="font-size:12px;color:#111827;text-align:right;">${formatDate(data.invoiceDate)}</td></tr>
        <tr><td style="font-size:12px;color:#6B7280;padding:3px 0;">Due Date</td><td style="font-size:12px;color:#111827;text-align:right;">${formatDate(data.dueDate)}</td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:0 32px 8px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <thead><tr style="background:#C41E3A;">
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#fff;">Description</th>
          <th style="padding:8px 12px;text-align:center;font-size:11px;color:#fff;">Qty</th>
          <th style="padding:8px 12px;text-align:right;font-size:11px;color:#fff;">Unit Price</th>
          <th style="padding:8px 12px;text-align:right;font-size:11px;color:#fff;">Total</th>
        </tr></thead>
        <tbody>${itemRows}</tbody>
      </table>
    </td></tr>
    <tr><td style="padding:8px 32px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${data.taxRate > 0 ? `
        <tr><td></td><td style="text-align:right;padding:4px 12px;font-size:13px;color:#6B7280;">Subtotal</td><td style="text-align:right;padding:4px 12px;font-size:13px;color:#111827;width:100px;">${formatCurrency(data.subtotal)}</td></tr>
        <tr><td></td><td style="text-align:right;padding:4px 12px;font-size:13px;color:#6B7280;">Tax (${data.taxRate}%)</td><td style="text-align:right;padding:4px 12px;font-size:13px;color:#111827;">${formatCurrency(data.taxAmount)}</td></tr>` : ""}
        <tr><td></td>
          <td style="text-align:right;padding:8px 12px;font-size:15px;font-weight:700;color:#C41E3A;border-top:2px solid #C41E3A;">Total Due</td>
          <td style="text-align:right;padding:8px 12px;font-size:15px;font-weight:700;color:#C41E3A;border-top:2px solid #C41E3A;">${formatCurrency(data.total)}</td>
        </tr>
      </table>
    </td></tr>
    ${data.notes ? `<tr><td style="padding:0 32px 24px;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#C41E3A;letter-spacing:1px;text-transform:uppercase;">Notes &amp; Terms</p>
      <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">${data.notes}</p>
    </td></tr>` : ""}
    <tr><td style="background:#FFF8F8;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#6B7280;">Questions? Reply to this email or call <strong>(888) 726-6263</strong></p>
      <p style="margin:6px 0 0;font-size:11px;color:#C41E3A;font-weight:600;">COMBO BREAKER — Fight Ready. Always.</p>
    </td></tr>
  </table>
</body></html>`;
}

export const sendInvoiceTask = schemaTask({
  id: "combo-breaker-send-invoice",
  schema: invoiceSchema,
  machine: "small-1x",
  maxDuration: 120,

  run: async (payload) => {
    const userId = process.env.COMPOSIO_USER_ID || "cityscape";

    logger.info("Verifying invoice totals", { invoiceNumber: payload.invoiceNumber });
    const { subtotal, taxAmount, total } = computeTotals(payload.items, payload.taxRate);
    const verified = { ...payload, subtotal, taxAmount, total };

    logger.info("Generating PDF");
    let pdfBuffer;
    try {
      pdfBuffer = await generateInvoicePDF(verified);
    } catch (err) {
      logger.error("PDF generation failed", { err });
      throw new AbortTaskRunError(`PDF generation failed: ${String(err)}`);
    }
    logger.info("PDF generated", { bytes: pdfBuffer.length });

    const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
    const client = composio.getClient();
    const pdfFilename = `ComboBreaker-Invoice-${payload.invoiceNumber}.pdf`;
    const md5 = createHash("md5").update(pdfBuffer).digest("hex");

    let s3key;
    try {
      const { key, new_presigned_url: uploadUrl } = await client.files.createPresignedURL({
        filename: pdfFilename, mimetype: "application/pdf", md5,
        tool_slug: "GMAIL_SEND_EMAIL", toolkit_slug: "gmail",
      });
      await fetch(uploadUrl, {
        method: "PUT",
        body: new Uint8Array(pdfBuffer),
        headers: { "Content-Type": "application/pdf", "Content-Length": String(pdfBuffer.length) },
      });
      s3key = key;
      logger.info("PDF uploaded", { s3key });
    } catch (err) {
      logger.error("PDF upload failed", { err });
      throw new AbortTaskRunError(`PDF upload failed: ${String(err)}`);
    }

    let emailResult;
    try {
      emailResult = await composio.tools.execute("GMAIL_SEND_EMAIL", {
        userId,
        dangerouslySkipVersionCheck: true,
        arguments: {
          recipient_email: payload.clientEmail,
          subject: `Invoice ${payload.invoiceNumber} – Combo Breaker`,
          message_body: buildEmailHTML(verified),
          is_html: true,
          attachment: { name: pdfFilename, mimetype: "application/pdf", s3key },
        },
      });
    } catch (err) {
      logger.error("Composio Gmail send failed", { err });
      throw new Error(`Failed to send email via Composio: ${String(err)}`);
    }

    logger.info("Invoice sent", { invoiceNumber: payload.invoiceNumber, sentTo: payload.clientEmail });
    return { success: true, invoiceNumber: payload.invoiceNumber, sentTo: payload.clientEmail, total: formatCurrency(total) };
  },
});
