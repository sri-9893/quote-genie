import type { QuotationStatus } from "@/lib/quote/pricingData";

const styles: Record<QuotationStatus, string> = {
  New: "bg-accent/15 text-accent",
  Contacted: "bg-primary/15 text-primary",
  Negotiating: "bg-warning/20 text-warning-foreground",
  Accepted: "bg-success/15 text-success",
  Rejected: "bg-destructive/15 text-destructive",
};

export function StatusBadge({ status }: { status: QuotationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

const pkgStyles: Record<string, string> = {
  low: "bg-chart-3/15 text-chart-3",
  mid: "bg-primary/15 text-primary",
  high: "bg-accent/15 text-accent",
};

export function PackageBadge({ packageKey, name }: { packageKey: string; name: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${pkgStyles[packageKey] ?? "bg-secondary text-secondary-foreground"}`}
    >
      {name}
    </span>
  );
}