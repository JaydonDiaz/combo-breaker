import React from "react";
import { pdf } from "@react-pdf/renderer";
import { TrainingPlanDocument } from "./training-plan-pdf.jsx";

export async function generateTrainingPlanPDF(data) {
  const element = React.createElement(TrainingPlanDocument, { data });
  const stream = await pdf(element).toBuffer(); // returns ReadableStream in v4 — not a Buffer
  const chunks = [];
  await new Promise((resolve, reject) => {
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", resolve);
    stream.on("error", reject);
  });
  return Buffer.concat(chunks);
}
