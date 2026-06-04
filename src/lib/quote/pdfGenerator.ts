import { jsPDF } from "jspdf";
import { formatCurrency } from "./pricingData";
import type { EstimatorInput, EstimateResult } from "./types";

const BRAND = "Tech Minds IT Solutions";
const PRIMARY: [number, number, number] = [56, 70, 220];
const DARK: [number, number, number] = [30, 33, 60];
const MUTED: [number, number, number] = [120, 124, 150];

interface PdfData {
  input: EstimatorInput;
  estimate: EstimateResult;
  quotationId?: string;
}

/**
 * Generates a professional quotation PDF and triggers a download.
 */
export function downloadQuotationPdf({ input, estimate, quotationId }: PdfData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 0;

  // Header band
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageWidth, 96, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(BRAND, margin, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Project Cost Estimate & Quotation", margin, 70);

  doc.setFontSize(10);
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  doc.text(`Date: ${dateStr}`, pageWidth - margin, 50, { align: "right" });
  if (quotationId) {
    doc.text(`Ref: ${quotationId}`, pageWidth - margin, 68, { align: "right" });
  }

  y = 130;

  // Client details
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Prepared For", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...MUTED);
  doc.text(`Name: ${input.name || "-"}`, margin, y);
  y += 16;
  doc.text(`Mobile: ${input.mobile || "-"}`, margin, y);
  y += 16;
  doc.text(`Email: ${input.email || "-"}`, margin, y);

  // Project summary (right column)
  let ry = 130;
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Project Summary", pageWidth / 2 + 20, ry);
  ry += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...MUTED);
  doc.text(`Website type: ${input.websiteType}`, pageWidth / 2 + 20, ry);
  ry += 16;
  doc.text(`Pages: ${input.pages}`, pageWidth / 2 + 20, ry);
  ry += 16;
  doc.text(`Package: ${estimate.packageName}`, pageWidth / 2 + 20, ry);
  ry += 16;
  doc.text(`Timeline: ${estimate.timelineDays} days`, pageWidth / 2 + 20, ry);

  y = Math.max(y, ry) + 34;

  // Cost breakdown table
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Cost Breakdown", margin, y);
  y += 14;

  const rows: Array<[string, string]> = [
    [`${estimate.packageName} package (base)`, formatCurrency(estimate.basePrice)],
  ];
  if (estimate.pagesCharge > 0) {
    rows.push(["Additional pages", formatCurrency(estimate.pagesCharge)]);
  }
  for (const item of estimate.extraItems) {
    rows.push([`Extra: ${item.label}`, formatCurrency(item.amount)]);
  }
  if (estimate.urgencyCharge > 0) {
    rows.push(["Fast delivery surcharge", formatCurrency(estimate.urgencyCharge)]);
  }

  const rowHeight = 24;
  doc.setDrawColor(225, 227, 240);
  for (const [label, amount] of rows) {
    y += rowHeight;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    doc.text(label, margin, y - 7);
    doc.text(amount, pageWidth - margin, y - 7, { align: "right" });
    doc.line(margin, y, pageWidth - margin, y);
  }

  // GST line
  const gstRate = estimate.gstRate ?? 18;
  const gstAmount = estimate.gstAmount ?? 0;
  y += rowHeight;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text(`GST (${gstRate}%)`, margin, y - 7);
  doc.text(formatCurrency(gstAmount), pageWidth - margin, y - 7, { align: "right" });
  doc.line(margin, y, pageWidth - margin, y);

  // Total
  y += 30;
  doc.setFillColor(...DARK);
  doc.roundedRect(margin, y - 22, pageWidth - margin * 2, 38, 6, 6, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Estimated Total", margin + 16, y + 2);
  doc.text(formatCurrency(estimate.total), pageWidth - margin - 16, y + 2, {
    align: "right",
  });

  // Included services
  y += 50;
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Included Services", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(...MUTED);
  for (const service of estimate.includedServices) {
    doc.text(`•  ${service}`, margin + 4, y);
    y += 15;
    if (y > 760) {
      doc.addPage();
      y = 60;
    }
  }

  if (input.bargainMessage) {
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    doc.text("Client note / bargain request:", margin, y);
    y += 15;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(input.bargainMessage, pageWidth - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 14;
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(
    "This is an auto-generated estimate. Final pricing may vary after consultation.",
    margin,
    810,
  );

  const fileName = `quotation-${quotationId || input.name || "estimate"}`
    .replace(/\s+/g, "-")
    .toLowerCase();
  doc.save(`${fileName}.pdf`);
}