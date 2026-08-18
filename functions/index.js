import { onRequest } from "firebase-functions/v2/https";
import { tasks } from "@trigger.dev/sdk";

function triggerHandler(taskId) {
  return onRequest({ secrets: ["TRIGGER_SECRET_KEY"] }, async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }
    try {
      const handle = await tasks.trigger(taskId, req.body);
      res.status(200).json({ success: true, runId: handle.id });
    } catch (err) {
      console.error(`${taskId} trigger error:`, err);
      res.status(500).json({ success: false, error: String(err) });
    }
  });
}

export const invoice = triggerHandler("combo-breaker-send-invoice");
export const trainingPlan = triggerHandler("combo-breaker-send-training-plan");
