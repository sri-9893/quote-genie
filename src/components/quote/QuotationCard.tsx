import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone, Mail, Globe } from "lucide-react";
import { formatCurrency, packages } from "@/lib/quote/pricingData";
import { formatDistanceToNow } from "date-fns";
import type { Quotation } from "@/lib/quote/types";
import { StatusBadge, PackageBadge } from "./StatusBadge";

export function QuotationCard({ quotation }: { quotation: Quotation }) {
  return (
    <Link
      to="/admin/quotations/$id"
      params={{ id: quotation.id }}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-card-foreground">{quotation.name}</h3>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(quotation.createdAt), { addSuffix: true })}
          </p>
        </div>
        <StatusBadge status={quotation.status} />
      </div>

      <div className="mt-4 grid gap-1.5 text-sm text-muted-foreground">
        <span className="flex items-center gap-2"><Globe className="h-4 w-4" /> {quotation.websiteType} · {quotation.pages} pages</span>
        <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> {quotation.mobile}</span>
        <span className="flex items-center gap-2 truncate"><Mail className="h-4 w-4 shrink-0" /> {quotation.email}</span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div>
          <PackageBadge packageKey={quotation.packageKey} name={packages[quotation.packageKey].name} />
          <p className="mt-1 text-lg font-bold text-foreground">
            {formatCurrency(quotation.estimate.total)}
          </p>
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          View <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}