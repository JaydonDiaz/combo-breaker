import { schemaTask, logger, AbortTaskRunError } from "@trigger.dev/sdk";
import { z } from "zod";
import { createHash } from "crypto";
import { Composio } from "@composio/core";
import { generateTrainingPlanPDF } from "../lib/generate-training-plan.jsx";
import { computeEndDate, formatCurrency, formatDate, safeProgramSlug } from "../lib/training-plan-types.js";

const serviceSchema = z.object({
  description: z.string().min(1),
  price: z.number().nonnegative(),
});

const trainingPlanSchema = z.object({
  clientName:      z.string().min(1),
  clientEmail:     z.string().email(),
  programName:     z.string().min(1),
  startDate:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  durationWeeks:   z.number().positive().int(),
  sessionsPerWeek: z.number().min(1).max(7).int(),
  sessionMinutes:  z.number().positive(),
  disciplines:     z.array(z.string()).min(1),
  services:        z.array(serviceSchema).min(1),
  notes:           z.string().default(""),
  total:           z.number().nonnegative(),
});

function buildEmailHTML(data) {
  const endDate = computeEndDate(data.startDate, data.durationWeeks);
  const rows = data.services.map(s => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #FECDD3;font-size:13px;color:#111827;">${s.description}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #FECDD3;text-align:right;font-weight:600;font-size:13px;color:#111827;">${formatCurrency(s.price)}</td>
    </tr>`).join("");

  const notesRow = data.notes ? `
    <tr><td colspan="2" style="padding:20px 32px 0;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#C41E3A;letter-spacing:1px;text-transform:uppercase;">Program Notes</p>
      <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">${data.notes}</p>
    </td></tr>` : "";

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td>
      <table width="600" cellpadding="0" cellspacing="0" style="margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
        <tr><td style="background:#C41E3A;padding:28px 32px;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#fff;letter-spacing:1px;">COMBO BREAKER</p>
          <p style="margin:4px 0 0;font-size:12px;color:#FECDD3;">Fight Ready. Always.</p>
        </td></tr>
        <tr><td style="padding:28px 32px 16px;">
          <p style="margin:0;font-size:15px;color:#111827;">Hi ${data.clientName},</p>
          <p style="margin:12px 0 0;font-size:14px;color:#6B7280;line-height:1.6;">Your training program <strong style="color:#111827;">${data.programName}</strong> is ready. The full plan is attached as a PDF.</p>
        </td></tr>
        <tr><td style="padding:0 32px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F8;border-radius:6px;padding:16px;">
            <tr>
              <td style="font-size:12px;color:#6B7280;padding:3px 0;">Program</td>
              <td style="font-size:12px;font-weight:600;color:#C41E3A;text-align:right;">${data.programName}</td>
            </tr>
            <tr>
              <td style="font-size:12px;color:#6B7280;padding:3px 0;">Start Date</td>
              <td style="font-size:12px;color:#111827;text-align:right;">${formatDate(data.startDate)}</td>
            </tr>
            <tr>
              <td style="font-size:12px;color:#6B7280;padding:3px 0;">End Date</td>
              <td style="font-size:12px;color:#111827;text-align:right;">${formatDate(endDate)}</td>
            </tr>
            <tr>
              <td style="font-size:12px;color:#6B7280;padding:3px 0;">Schedule</td>
              <td style="font-size:12px;color:#111827;text-align:right;">${data.sessionsPerWeek}x/week · ${data.sessionMinutes} min/session</td>
            </tr>
            <tr>
              <td style="font-size:12px;color:#6B7280;padding:3px 0;">Duration</td>
              <td style="font-size:12px;color:#111827;text-align:right;">${data.durationWeeks} weeks</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 32px 8px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <thead>
              <tr style="background:#C41E3A;">
                <th style="padding:9px 12px;text-align:left;font-size:11px;color:#fff;font-weight:600;">What's Included</th>
                <th style="padding:9px 12px;text-align:right;font-size:11px;color:#fff;font-weight:600;">Investment</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </td></tr>
        <tr><td style="padding:8px 32px 4px;text-align:right;">
          <span style="font-size:15px;font-weight:700;color:#C41E3A;">Total: ${formatCurrency(data.total)}</span>
        </td></tr>
        ${notesRow}
        <tr><td style="padding:24px 32px;background:#FFF8F8;text-align:center;margin-top:20px;">
          <p style="margin:0;font-size:12px;color:#6B7280;">Questions? Reply to this email or call <strong>(888) 726-6263</strong></p>
          <p style="margin:6px 0 0;font-size:11px;color:#C41E3A;font-weight:600;letter-spacing:1px;">COMBO BREAKER — Fight Ready. Always.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export const sendTrainingPlanTask = schemaTask({
  id: "combo-breaker-send-training-plan",
  schema: trainingPlanSchema,
  machine: "small-2x",
  maxDuration: 120,

  run: async (payload) => {
    const userId = process.env.COMPOSIO_USER_ID || "cityscape";

    logger.info("Generating training plan PDF", { program: payload.programName, client: payload.clientName });
    let pdfBuffer;
    try {
      pdfBuffer = await generateTrainingPlanPDF(payload);
    } catch (err) {
      logger.error("PDF generation failed", { err: String(err) });
      throw new AbortTaskRunError(`PDF generation failed: ${String(err)}`);
    }
    logger.info("PDF generated", { bytes: pdfBuffer.length });

    const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
    const client = composio.getClient();
    const slug = safeProgramSlug(payload.programName);
    const pdfFilename = `ComboBreaker-TrainingPlan-${slug}.pdf`;
    const md5 = createHash("md5").update(pdfBuffer).digest("hex");

    logger.info("Uploading PDF to Composio presigned URL", { pdfFilename });
    let s3key;
    try {
      const { key, new_presigned_url: uploadUrl } = await client.files.createPresignedURL({
        filename: pdfFilename,
        mimetype: "application/pdf",
        md5,
        tool_slug: "GMAIL_SEND_EMAIL",
        toolkit_slug: "gmail",
      });
      await fetch(uploadUrl, {
        method: "PUT",
        body: new Uint8Array(pdfBuffer),
        headers: {
          "Content-Type": "application/pdf",
          "Content-Length": String(pdfBuffer.length),
        },
      });
      s3key = key;
      logger.info("PDF uploaded", { s3key });
    } catch (err) {
      logger.error("PDF upload failed", { err: String(err) });
      throw new AbortTaskRunError(`PDF upload failed: ${String(err)}`);
    }

    logger.info("Sending email via Composio GMAIL_SEND_EMAIL", { to: payload.clientEmail });
    try {
      await composio.tools.execute("GMAIL_SEND_EMAIL", {
        userId,
        dangerouslySkipVersionCheck: true,
        arguments: {
          recipient_email: payload.clientEmail,
          subject: `Your Training Program — ${payload.programName}`,
          message_body: buildEmailHTML(payload),
          is_html: true,
          attachment: { name: pdfFilename, mimetype: "application/pdf", s3key },
        },
      });
    } catch (err) {
      logger.error("Email send failed", { err: String(err) });
      throw new Error(`Email send failed: ${String(err)}`);
    }

    logger.info("Training plan sent successfully", { program: payload.programName, to: payload.clientEmail });
    return {
      success: true,
      programName: payload.programName,
      sentTo: payload.clientEmail,
      total: formatCurrency(payload.total),
    };
  },
});
