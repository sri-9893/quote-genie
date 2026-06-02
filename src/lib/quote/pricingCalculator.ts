import {
  features,
  packages,
  urgencyConfig,
  type PackageKey,
} from "./pricingData";
import type { EstimatorInput, EstimateResult, PriceLineItem } from "./types";

/**
 * Pure pricing logic. Given the user's selections, it returns a full
 * breakdown: base price, page charges, paid extras, included services,
 * urgency surcharge, subtotal, total and an estimated timeline.
 */
export function calculateEstimate(input: EstimatorInput): EstimateResult {
  const pkg = packages[input.packageKey];

  // Pages: charge only for pages above the package's included minimum.
  const minPages = pkg.includedPages[0];
  const billablePages = Math.max(0, (input.pages || minPages) - minPages);
  const pagesCharge = billablePages * pkg.perPage;

  // Features: anything not included in the package becomes a paid extra.
  const extraItems: PriceLineItem[] = [];
  const includedServices: string[] = [...pkg.includes];

  for (const featureKey of input.features) {
    const feature = features.find((f) => f.key === featureKey);
    if (!feature) continue;
    if (feature.includedIn.includes(input.packageKey)) {
      if (!includedServices.includes(feature.label)) {
        includedServices.push(feature.label);
      }
    } else {
      extraItems.push({ label: feature.label, amount: feature.price });
    }
  }

  const extrasTotal = extraItems.reduce((sum, item) => sum + item.amount, 0);
  const preUrgency = pkg.basePrice + pagesCharge + extrasTotal;

  const urgency = urgencyConfig[input.urgency];
  const urgencyCharge = Math.round(preUrgency * (urgency.multiplier - 1));
  const subtotal = preUrgency;
  const total = preUrgency + urgencyCharge;

  // Timeline: base days + a little per billable page, adjusted by urgency.
  const rawTimeline = pkg.baseTimelineDays + Math.ceil(billablePages * 1.5);
  const timelineDays = Math.max(3, Math.round(rawTimeline * urgency.timelineFactor));

  return {
    packageKey: input.packageKey,
    packageName: pkg.name,
    basePrice: pkg.basePrice,
    pagesCharge,
    extraItems,
    includedServices,
    urgencyCharge,
    subtotal,
    total,
    timelineDays,
  };
}

// Suggest a package based on website type + budget (used to pre-select).
export function suggestPackage(budget: number): PackageKey {
  if (budget >= packages.high.basePrice) return "high";
  if (budget >= packages.mid.basePrice) return "mid";
  return "low";
}