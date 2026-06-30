import { tasks } from "@trigger.dev/sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body;
    const handle = await tasks.trigger("combo-breaker-send-invoice", payload);
    return res.status(200).json({ success: true, runId: handle.id });
  } catch (err) {
    console.error("Invoice trigger error:", err);
    return res.status(500).json({ success: false, error: String(err) });
  }
}
