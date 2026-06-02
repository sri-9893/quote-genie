import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Clock, Wallet, Layers } from "lucide-react";
import { Section } from "@/components/site/Section";
import {
  websiteTypes,
  packageOrder,
  packages,
  features,
  urgencyConfig,
  formatCurrency,
  type PackageKey,
  type UrgencyKey,
} from "@/lib/quote/pricingData";
import { calculateEstimate } from "@/lib/quote/pricingCalculator";
import { saveDraft } from "@/lib/quote/quotationStorage";
import type { EstimatorInput } from "@/lib/quote/types";

export const Route = createFileRoute("/_public/estimate")({
  validateSearch: (s: Record<string, unknown>) => ({
    pkg: (s.pkg as PackageKey) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Cost Estimator — NexaForge Studio" },
      { name: "description", content: "Estimate your website project cost instantly." },
    ],
  }),
  component: Estimate,
});

function Estimate() {
  const navigate = useNavigate();
  const { pkg } = Route.useSearch();

  const [form, setForm] = useState<EstimatorInput>({
    websiteType: "business",
    pages: 5,
    packageKey: pkg && packages[pkg] ? pkg : "mid",
    features: ["contactForm", "whatsapp"],
    urgency: "normal",
    expectedBudget: 25000,
    bargainMessage: "",
    name: "",
    mobile: "",
    email: "",
  });

  const set = <K extends keyof EstimatorInput>(key: K, value: EstimatorInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleFeature = (key: string) =>
    setForm((f) => ({
      ...f,
      features: f.features.includes(key)
        ? f.features.filter((k) => k !== key)
        : [...f.features, key],
    }));

  const estimate = useMemo(() => calculateEstimate(form), [form]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.mobile.trim() || !form.email.trim()) {
      toast.error("Please fill in your name, mobile and email.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    saveDraft({ input: form, estimate });
    navigate({ to: "/quotation-preview" });
  };

  return (
    <div className="page-enter bg-secondary/30">
      <Section className="py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Project Cost Estimator
          </h1>
          <p className="mt-3 text-muted-foreground">
            Tell us about your project and get an instant, itemised quote.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <div className="space-y-6">
            {/* Website type */}
            <Card title="1. Website type">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {websiteTypes.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => set("websiteType", t.key)}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                      form.websiteType === t.key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Pages */}
            <Card title="2. Number of pages">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={form.pages}
                  onChange={(e) => set("pages", Number(e.target.value))}
                  className="flex-1 accent-[var(--primary)]"
                />
                <span className="w-16 rounded-lg bg-secondary px-3 py-1.5 text-center font-semibold text-foreground">
                  {form.pages}
                </span>
              </div>
            </Card>

            {/* Package */}
            <Card title="3. Package type">
              <div className="grid gap-2 sm:grid-cols-3">
                {packageOrder.map((key) => (
                  <button
                    key={key}
                    onClick={() => set("packageKey", key)}
                    className={`rounded-lg border p-3 text-left transition-all ${
                      form.packageKey === key
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold text-foreground">{packages[key].name}</p>
                    <p className="text-xs text-muted-foreground">
                      from {formatCurrency(packages[key].basePrice)}
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Features */}
            <Card title="4. Required features">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {features.map((f) => {
                  const included = f.includedIn.includes(form.packageKey);
                  const checked = form.features.includes(f.key);
                  return (
                    <label
                      key={f.key}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-all ${
                        checked ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-foreground">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFeature(f.key)}
                          className="h-4 w-4 accent-[var(--primary)]"
                        />
                        {f.label}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {included ? "Included" : `+${formatCurrency(f.price)}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </Card>

            {/* Urgency */}
            <Card title="5. Delivery urgency">
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(urgencyConfig) as UrgencyKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => set("urgency", key)}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                      form.urgency === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {urgencyConfig[key].label}
                    {key === "fast" && <span className="ml-1 text-xs">(+25%)</span>}
                  </button>
                ))}
              </div>
            </Card>

            {/* Budget + bargain + contact */}
            <Card title="6. Your details & budget">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name *">
                  <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" />
                </Field>
                <Field label="Mobile *">
                  <input className={inputCls} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="+91 ..." />
                </Field>
                <Field label="Email *">
                  <input className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
                </Field>
                <Field label="Expected budget (₹)">
                  <input type="number" className={inputCls} value={form.expectedBudget} onChange={(e) => set("expectedBudget", Number(e.target.value))} />
                </Field>
              </div>
              <Field label="Bargain / discount message (optional)" className="mt-4">
                <textarea
                  className={inputCls + " min-h-[80px] resize-y"}
                  value={form.bargainMessage}
                  onChange={(e) => set("bargainMessage", e.target.value)}
                  placeholder="Tell us your budget constraints or ask for a discount..."
                />
              </Field>
            </Card>
          </div>

          {/* Live summary */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-lg font-bold text-card-foreground">Live estimate</h3>
              <p className="mt-1 text-sm text-muted-foreground">{estimate.packageName} package</p>

              <p className="mt-5 text-4xl font-bold text-gradient">
                {formatCurrency(estimate.total)}
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <SummaryRow icon={Clock} label="Timeline" value={`${estimate.timelineDays} days`} />
                <SummaryRow icon={Layers} label="Included services" value={`${estimate.includedServices.length} items`} />
                <SummaryRow icon={Wallet} label="Extra charges" value={formatCurrency(estimate.extraItems.reduce((s, i) => s + i.amount, 0) + estimate.urgencyCharge)} />
              </div>

              <div className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
                <Line label={`${estimate.packageName} base`} value={formatCurrency(estimate.basePrice)} />
                {estimate.pagesCharge > 0 && <Line label="Extra pages" value={formatCurrency(estimate.pagesCharge)} />}
                {estimate.extraItems.map((i) => (
                  <Line key={i.label} label={i.label} value={formatCurrency(i.amount)} />
                ))}
                {estimate.urgencyCharge > 0 && <Line label="Fast delivery" value={formatCurrency(estimate.urgencyCharge)} />}
              </div>

              <button
                onClick={handleSubmit}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Preview quotation <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-4 font-semibold text-card-foreground">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function SummaryRow({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-muted-foreground"><Icon className="h-4 w-4" /> {label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}