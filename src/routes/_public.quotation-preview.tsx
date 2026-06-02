import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, CheckCircle2, FileText, ArrowLeft, Send } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Loader } from "@/components/quote/Loader";
import { formatCurrency, websiteTypes } from "@/lib/quote/pricingData";
import {
  getDraft,
  clearDraft,
  saveQuotation,
  type QuotationDraft,
} from "@/lib/quote/quotationStorage";
import { downloadQuotationPdf } from "@/lib/quote/pdfGenerator";

export const Route = createFileRoute("/_public/quotation-preview")({
  head: () => ({
    meta: [{ title: "Quotation Preview — NexaForge Studio" }],
  }),
  component: QuotationPreview,
});

function QuotationPreview() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<QuotationDraft | null>(null);
  const [submitted, setSubmitted] = useState<string | null>(null);

  useEffect(() => {
    setDraft(getDraft());
    setReady(true);
  }, []);

  if (!ready) return <Loader label="Preparing your quotation..." />;

  if (submitted) {
    return (
      <Section className="py-24">
        <div className="mx-auto max-w-lg animate-scale-in rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-9 w-9" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-foreground">Request submitted!</h1>
          <p className="mt-2 text-muted-foreground">
            Your quotation request has been received. Our team will contact you soon.
          </p>
          <p className="mt-4 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground">
            Reference: {submitted}
          </p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-lg gradient-primary px-5 py-3 font-semibold text-primary-foreground">
            Back to home
          </Link>
        </div>
      </Section>
    );
  }

  if (!draft) {
    return (
      <Section className="py-24 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">No quotation yet</h1>
        <p className="mt-2 text-muted-foreground">Build your estimate to preview a quotation.</p>
        <Link to="/estimate" className="mt-6 inline-flex items-center gap-2 rounded-lg gradient-primary px-5 py-3 font-semibold text-primary-foreground">
          Go to estimator
        </Link>
      </Section>
    );
  }

  const { input, estimate } = draft;
  const typeLabel = websiteTypes.find((t) => t.key === input.websiteType)?.label ?? input.websiteType;

  const handleSubmit = () => {
    const saved = saveQuotation(input, estimate);
    clearDraft();
    setSubmitted(saved.id);
    toast.success("Quotation request submitted!");
  };

  return (
    <div className="page-enter bg-secondary/30">
      <Section className="py-12">
        <button onClick={() => navigate({ to: "/estimate" })} className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Edit estimate
        </button>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="gradient-dark px-8 py-8 text-white">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/70">Quotation for</p>
                <h1 className="text-2xl font-bold">{input.name || "Your project"}</h1>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/70">Estimated total</p>
                <p className="text-3xl font-bold">{formatCurrency(estimate.total)}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-8 sm:grid-cols-3">
            <Info label="Website type" value={typeLabel} />
            <Info label="Package" value={estimate.packageName} />
            <Info label="Pages" value={String(input.pages)} />
            <Info label="Timeline" value={`${estimate.timelineDays} days`} />
            <Info label="Urgency" value={input.urgency === "fast" ? "Fast delivery" : "Normal"} />
            <Info label="Contact" value={input.mobile} />
          </div>

          <div className="grid gap-8 border-t border-border p-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-3 font-semibold text-foreground">Included services</h2>
              <ul className="space-y-2">
                {estimate.includedServices.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-3 font-semibold text-foreground">Cost breakdown</h2>
              <div className="space-y-2 text-sm">
                <Row label={`${estimate.packageName} base`} value={formatCurrency(estimate.basePrice)} />
                {estimate.pagesCharge > 0 && <Row label="Additional pages" value={formatCurrency(estimate.pagesCharge)} />}
                {estimate.extraItems.map((i) => (
                  <Row key={i.label} label={`Extra: ${i.label}`} value={formatCurrency(i.amount)} />
                ))}
                {estimate.urgencyCharge > 0 && <Row label="Fast delivery surcharge" value={formatCurrency(estimate.urgencyCharge)} />}
                <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>{formatCurrency(estimate.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {input.bargainMessage && (
            <div className="border-t border-border p-8">
              <h2 className="mb-2 font-semibold text-foreground">Your note</h2>
              <p className="rounded-lg bg-secondary p-4 text-sm text-muted-foreground">{input.bargainMessage}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-border p-8 sm:flex-row">
            <button
              onClick={() => downloadQuotationPdf({ input, estimate })}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <Download className="h-4 w-4" /> Download PDF
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
            >
              <Send className="h-4 w-4" /> Submit quotation request
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
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