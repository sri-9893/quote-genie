import type { PackageKey, QuotationStatus, UrgencyKey } from "./pricingData";

// Raw selections the user makes in the estimator form.
export interface EstimatorInput {
  websiteType: string;
  pages: number;
  packageKey: PackageKey;
  features: string[]; // selected feature keys
  urgency: UrgencyKey;
  expectedBudget: number;
  bargainMessage: string;
  name: string;
  mobile: string;
  email: string;
}

export interface PriceLineItem {
  label: string;
  amount: number;
}

// Result of the pricing calculation.
export interface EstimateResult {
  packageKey: PackageKey;
  packageName: string;
  basePrice: number;
  pagesCharge: number;
  extraItems: PriceLineItem[]; // paid extras (features not included in package)
  includedServices: string[];
  urgencyCharge: number;
  subtotal: number; // pre-urgency, pre-GST
  gstRate: number; // e.g. 18 for 18%
  gstAmount: number;
  total: number; // subtotal + urgencyCharge + gstAmount
  timelineDays: number;
}

// A full saved quotation record (input + computed result + meta).
export interface Quotation extends EstimatorInput {
  id: string;
  createdAt: string;
  status: QuotationStatus;
  estimate: EstimateResult;
}