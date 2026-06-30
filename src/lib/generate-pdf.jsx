import React from "react";
import { pdf } from "@react-pdf/renderer";
import { InvoiceDocument } from "./invoice-pdf.jsx";

export async function generateInvoicePDF(data) {
  const element = React.createElement(InvoiceDocument, { data });
  const stream = await pdf(element).toBuffer();
  const chunks = [];
  await new Promise((resolve, reject) => {
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", resolve);
    stream.on("error", reject);
  });
  return Buffer.concat(chunks);
}
