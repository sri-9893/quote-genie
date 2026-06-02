import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Sparkles, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { useQuotations } from "@/lib/quote/hooks";
import { formatCurrency, packages } from "@/lib/quote/pricingData";
import { StatusBadge } from "@/components/quote/StatusBadge";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/admin/_auth/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Tech Minds IT Solutions Admin" }] }),
  component: Dashboard,
});

function Dashboard() {
  const quotations = useQuotations();
  const total = quotations.length;
  const newCount = quotations.filter((q) => q.status === "New").length;
  const accepted = quotations.filter((q) => q.status === "Accepted").length;
  const rejected = quotations.filter((q) => q.status === "Rejected").length;
  const revenue = quotations
    .filter((q) => q.status === "Accepted")
    .reduce((s, q) => s + q.estimate.total, 0);

  const cards = [
    { label: "Total quotations", value: total, icon: FileText, cls: "text-primary bg-primary/10" },
    { label: "New", value: newCount, icon: Sparkles, cls: "text-accent bg-accent/10" },
    { label: "Accepted", value: accepted, icon: CheckCircle2, cls: "text-success bg-success/10" },
    { label: "Rejected", value: rejected, icon: XCircle, cls: "text-destructive bg-destructive/10" },
  ];

  return (
    <div className="page-enter p-5 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of all quotation requests.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className={`grid h-10 w-10 place-items-center rounded-lg ${c.cls}`}>
                <c.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">{c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">Accepted deal value</p>
        <p className="mt-1 text-2xl font-bold text-gradient">{formatCurrency(revenue)}</p>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold text-foreground">Recent quotations</h2>
          <Link to="/admin/quotations" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {quotations.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No quotations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Package</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">When</th>
                </tr>
              </thead>
              <tbody>
                {quotations.slice(0, 6).map((q) => (
                  <tr key={q.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="p-4">
                      <Link to="/admin/quotations/$id" params={{ id: q.id }} className="font-medium text-foreground hover:text-primary">
                        {q.name}
                      </Link>
                    </td>
                    <td className="p-4 capitalize text-muted-foreground">{q.websiteType}</td>
                    <td className="p-4 text-muted-foreground">{packages[q.packageKey].name}</td>
                    <td className="p-4 font-semibold text-foreground">{formatCurrency(q.estimate.total)}</td>
                    <td className="p-4"><StatusBadge status={q.status} /></td>
                    <td className="p-4 text-muted-foreground">{formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}