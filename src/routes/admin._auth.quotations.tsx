import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, FileText, Filter } from "lucide-react";
import { useQuotations } from "@/lib/quote/hooks";
import { QuotationCard } from "@/components/quote/QuotationCard";
import { statusOptions, type QuotationStatus } from "@/lib/quote/pricingData";

export const Route = createFileRoute("/admin/_auth/quotations")({
  head: () => ({ meta: [{ title: "Quotations — NexaForge Admin" }] }),
  component: Quotations,
});

type StatusFilter = QuotationStatus | "All";

function Quotations() {
  const quotations = useQuotations();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return quotations.filter((item) => {
      const matchesStatus = status === "All" || item.status === status;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.mobile.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [quotations, query, status]);

  const filters: StatusFilter[] = ["All", ...statusOptions];

  return (
    <div className="page-enter p-5 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Quotations</h1>
        <p className="text-sm text-muted-foreground">
          {quotations.length} total request{quotations.length === 1 ? "" : "s"}.
        </p>
      </div>

      {/* Search + filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, mobile or reference..."
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setStatus(f)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                status === f
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-medium text-foreground">No quotations found</p>
          <p className="text-sm text-muted-foreground">
            {quotations.length === 0
              ? "New quotation requests will appear here."
              : "Try adjusting your search or filters."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((q) => (
            <QuotationCard key={q.id} quotation={q} />
          ))}
        </div>
      )}
    </div>
  );
}