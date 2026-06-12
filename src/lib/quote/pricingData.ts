// Central pricing configuration. Edit values here to tune the estimator.
// Designed to be easily replaced by a remote config (Supabase/Firebase) later.

export type PackageKey = "low" | "mid" | "high";
export type UrgencyKey = "normal" | "fast";

export interface PackageInfo {
  key: PackageKey;
  name: string;
  tagline: string;
  basePrice: number; // base price in INR
  perPage: number; // additional cost per page
  includedPages: [number, number]; // recommended page range
  baseTimelineDays: number;
  popular?: boolean;
  includes: string[];
}

export interface FeatureInfo {
  key: string;
  label: string;
  price: number;
  // package keys where this feature is already included for free
  includedIn: PackageKey[];
}

export interface WebsiteType {
  key: string;
  label: string;
  // recommended package for this website type
  suggested: PackageKey;
}

export const CURRENCY = "₹";

// Mutable symbol kept in sync with the admin pricing config (see pricingStore).
// formatCurrency reads this so a currency change applies everywhere instantly.
let activeCurrency = CURRENCY;

export function setActiveCurrency(symbol: string) {
  activeCurrency = symbol || CURRENCY;
}

export function getActiveCurrency(): string {
  return activeCurrency;
}

export const websiteTypes: WebsiteType[] = [
  { key: "business", label: "Business", suggested: "mid" },
  { key: "jewellery", label: "Jewellery", suggested: "high" },
  { key: "restaurant", label: "Restaurant", suggested: "mid" },
  { key: "school", label: "School", suggested: "mid" },
  { key: "hospital", label: "Hospital", suggested: "high" },
  { key: "ecommerce", label: "E-commerce", suggested: "high" },
  { key: "portfolio", label: "Portfolio", suggested: "low" },
];

export const packages: Record<PackageKey, PackageInfo> = {
  low: {
    key: "low",
    name: "Basic",
    tagline: "Basic static website to get online fast",
    basePrice: 12000,
    perPage: 800,
    includedPages: [3, 5],
    baseTimelineDays: 7,
    includes: [
      "Basic static website",
      "3 to 5 pages",
      "Contact form",
      "WhatsApp button",
      "Basic SEO",
      "Mobile responsive design",
    ],
  },
  mid: {
    key: "mid",
    name: "Advance",
    tagline: "Dynamic website with admin & enquiry management",
    basePrice: 25000,
    perPage: 1500,
    includedPages: [5, 10],
    baseTimelineDays: 14,
    popular: true,
    includes: [
      "Dynamic website",
      "5 to 10 pages",
      "Admin panel",
      "On-page SEO",
      "Hosting support",
      "Enquiry management",
      "Contact form + WhatsApp",
    ],
  },
  high: {
    key: "high",
    name: "High Premium",
    tagline: "E-commerce / advanced platform with full dashboard",
    basePrice: 60000,
    perPage: 2500,
    includedPages: [8, 20],
    baseTimelineDays: 25,
    includes: [
      "E-commerce or advanced website",
      "Login / signup",
      "Product management",
      "Payment gateway",
      "Admin dashboard",
      "Marketing support",
      "Advanced SEO",
    ],
  },
};

export const packageOrder: PackageKey[] = ["low", "mid", "high"];

export const features: FeatureInfo[] = [
  { key: "contactForm", label: "Contact form", price: 1500, includedIn: ["low", "mid", "high"] },
  { key: "whatsapp", label: "WhatsApp button", price: 800, includedIn: ["low", "mid", "high"] },
  { key: "adminPanel", label: "Admin panel", price: 6000, includedIn: ["mid", "high"] },
  { key: "payment", label: "Payment gateway", price: 9000, includedIn: ["high"] },
  { key: "auth", label: "Login / signup", price: 5000, includedIn: ["high"] },
  { key: "products", label: "Product listing", price: 7000, includedIn: ["high"] },
  { key: "seo", label: "SEO", price: 4000, includedIn: ["mid", "high"] },
  { key: "hosting", label: "Hosting", price: 3000, includedIn: ["mid", "high"] },
  { key: "marketing", label: "Digital marketing", price: 8000, includedIn: ["high"] },
];

// Urgency multiplier applied to the subtotal
export const urgencyConfig: Record<UrgencyKey, { label: string; multiplier: number; timelineFactor: number }> = {
  normal: { label: "Normal", multiplier: 1, timelineFactor: 1 },
  fast: { label: "Fast delivery", multiplier: 1.25, timelineFactor: 0.6 },
};

export const statusOptions = [
  "New",
  "Contacted",
  "Negotiating",
  "Accepted",
  "Rejected",
] as const;

export type QuotationStatus = (typeof statusOptions)[number];

export function formatCurrency(value: number): string {
  return activeCurrency + Math.round(value).toLocaleString("en-IN");
}