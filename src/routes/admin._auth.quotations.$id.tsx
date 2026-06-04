import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  Trash2,
  Phone,
  Mail,
  Globe,
  Calendar,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { useQuotations } from "@/lib/quote/hooks";
import {
  updateStatus,
  deleteQuotation,
} from "@/lib/quote/quotationStorage";
import {
  formatCurrency,
  packages,
  statusOptions,
  type QuotationStatus,
} from "@/lib/quote/pricingData";
import { downloadQuotationPdf } from "@/lib/quote/pdfGenerator";
import { StatusBadge } from "@/components/quote/StatusBadge";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/admin/_auth/quotations/$id")({
  head: () => ({ meta: [{ title: "Quotation Detail — Tech Minds IT Solutions Admin" }] }),
  component: QuotationDetail,
});

function QuotationDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const quotations = useQuotations();
  const quotation = quotations.find((q) => q.id === id);

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!quotation) {
    return (
      <div className="page-enter p-5 sm:p-8">
        <Link
          to="/admin/quotations"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to quotations
        </Link>
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="font-medium text-foreground">Quotation not found</p>
          <p className="text-sm text-muted-foreground">
            It may have been deleted.
          </p>
        </div>
      </div>
    );
  }

  const { estimate } = quotation;
  const pkg = packages[quotation.packageKey];

  const handleStatus = (status: QuotationStatus) => {
    updateStatus(quotation.id, status);
    toast.success(`Status updated to "${status}"`);
  };

  const handleDelete = () => {
    deleteQuotation(quotation.id);
    toast.success("Quotation deleted");
    navigate({ to: "/admin/quotations" });
  };

  return (
    <div className="page-enter p-5 sm:p-8">
      <Link
        to="/admin/quotations"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to quotations
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border bg-card p-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{quotation.name}</h1>
            <StatusBadge status={quotation.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Ref: {quotation.id} · created{" "}
            {formatDistanceToNow(new Date(quotation.createdAt), { addSuffix: true })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              downloadQuotationPdf({
                input: quotation,
                estimate,
                quotationId: quotation.id,
              })
            }
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <Download className="h-4 w-4" /> PDF
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Contact + project */}
          <Panel title="Client & project">
            <div className="grid gap-4 sm:grid-cols-2">
              <Detail icon={Phone} label="Mobile" value={quotation.mobile} />
              <Detail icon={Mail} label="Email" value={quotation.email} />
              <Detail
                icon={Globe}
                label="Website type"
                value={`${quotation.websiteType} · ${quotation.pages} pages`}
              />
              <Detail
                icon={Calendar}
                label="Timeline"
                value={`${estimate.timelineDays} days`}
              />
              <Detail
                icon={Wallet}
                label="Expected budget"
                value={formatCurrency(quotation.expectedBudget)}
              />
              <Detail
                icon={CheckCircle2}
                label="Package"
                value={pkg.name}
              />
            </div>
          </Panel>

          {/* Cost breakdown */}
          <Panel title="Cost breakdown">
            <div className="space-y-2 text-sm">
              <Row
                label={`${estimate.packageName} base`}
                value={formatCurrency(estimate.basePrice)}
              />
              {estimate.pagesCharge > 0 && (
                <Row label="Additional pages" value={formatCurrency(estimate.pagesCharge)} />
              )}
              {estimate.extraItems.map((i) => (
                <Row key={i.label} label={`Extra: ${i.label}`} value={formatCurrency(i.amount)} />
              ))}
              {estimate.urgencyCharge > 0 && (
                <Row label="Fast delivery surcharge" value={formatCurrency(estimate.urgencyCharge)} />
              )}
              <Row label={`GST (${estimate.gstRate ?? 18}%)`} value={formatCurrency(estimate.gstAmount ?? 0)} />
              <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-base font-bold text-foreground">
                <span>Total</span>
                <span>{formatCurrency(estimate.total)}</span>
              </div>
            </div>
          </Panel>

          {/* Included services */}
          <Panel title="Included services">
            <ul className="grid gap-2 sm:grid-cols-2">
              {estimate.includedServices.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {s}
                </li>
              ))}
            </ul>
          </Panel>

          {quotation.bargainMessage && (
            <Panel title="Client note / bargain request">
              <p className="rounded-lg bg-secondary p-4 text-sm text-muted-foreground">
                {quotation.bargainMessage}
              </p>
            </Panel>
          )}
        </div>

        {/* Status manager */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Panel title="Update status">
            <div className="space-y-2">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatus(s)}
                  className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    quotation.status === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {s}
                  {quotation.status === s && <CheckCircle2 className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setConfirmDelete(false)}
          />
          <div className="relative w-full max-w-sm animate-scale-in rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-bold text-foreground">Delete quotation?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This will permanently remove the quotation for{" "}
              <span className="font-medium text-foreground">{quotation.name}</span>. This
              action cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-opacity hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 font-semibold text-card-foreground">{title}</h2>
      {children}
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1 font-semibold capitalize text-foreground">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}