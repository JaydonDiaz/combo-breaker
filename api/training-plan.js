import { tasks } from "@trigger.dev/sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const handle = await tasks.trigger("combo-breaker-send-training-plan", req.body);
    return res.status(200).json({ success: true, runId: handle.id });
  } catch (err) {
    console.error("Training plan trigger error:", err);
    return res.status(500).json({ success: false, error: String(err) });
  }
}
