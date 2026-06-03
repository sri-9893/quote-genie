import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, RotateCcw, IndianRupee } from "lucide-react";
import {
  packageOrder,
  packages as defaultPackages,
  features as defaultFeatures,
} from "@/lib/quote/pricingData";
import { usePricingConfig } from "@/lib/quote/hooks";
import {
  saveConfig,
  resetConfig,
  defaultConfig,
  type PricingConfig,
} from "@/lib/quote/pricingStore";

export const Route = createFileRoute("/admin/_auth/pricing")({
  head: () => ({ meta: [{ title: "Pricing Settings — NexaForge Admin" }] }),
  component: PricingSettings,
});

function PricingSettings() {
  const stored = usePricingConfig();
  // Local editable draft — initialised from the live config.
  const [draft, setDraft] = useState<PricingConfig>(stored);

  // Keep the draft in sync if the underlying config changes elsewhere.
  useEffect(() => {
    setDraft(stored);
  }, [stored]);

  const setPackage = (
    key: (typeof packageOrder)[number],
    field: "basePrice" | "perPage" | "baseTimelineDays",
    value: number,
  ) =>
    setDraft((d) => ({
      ...d,
      packages: {
        ...d.packages,
        [key]: { ...d.packages[key], [field]: value },
      },
    }));

  const setFeature = (featureKey: string, value: number) =>
    setDraft((d) => ({
      ...d,
      features: { ...d.features, [featureKey]: value },
    }));

  const handleSave = () => {
    saveConfig(draft);
    toast.success("Pricing updated. New quotes use these prices.");
  };

  const handleReset = () => {
    resetConfig();
    setDraft(defaultConfig());
    toast.success("Pricing reset to defaults.");
  };

  return (
    <div className="page-enter p-5 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pricing Settings</h1>
          <p className="text-sm text-muted-foreground">
            Edit base prices, per-page cost and add-on charges. Changes apply to
            all new estimates instantly.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <Save className="h-4 w-4" /> Save changes
          </button>
        </div>
      </div>

      {/* Packages */}
      <Panel title="Packages">
        <div className="grid gap-4 lg:grid-cols-3">
          {packageOrder.map((key) => {
            const pkg = draft.packages[key];
            return (
              <div
                key={key}
                className="rounded-xl border border-border bg-background p-5"
              >
                <h3 className="font-bold text-foreground">
                  {defaultPackages[key].name}
                </h3>
                <p className="mb-4 text-xs text-muted-foreground">
                  {defaultPackages[key].tagline}
                </p>
                <NumberField
                  label="Base price (₹)"
                  value={pkg.basePrice}
                  onChange={(v) => setPackage(key, "basePrice", v)}
                />
                <NumberField
                  label="Per extra page (₹)"
                  value={pkg.perPage}
                  onChange={(v) => setPackage(key, "perPage", v)}
                />
                <NumberField
                  label="Base timeline (days)"
                  value={pkg.baseTimelineDays}
                  onChange={(v) => setPackage(key, "baseTimelineDays", v)}
                />
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Features */}
      <Panel title="Add-on feature prices">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {defaultFeatures.map((f) => (
            <NumberField
              key={f.key}
              label={`${f.label} (₹)`}
              value={draft.features[f.key] ?? f.price}
              onChange={(v) => setFeature(f.key, v)}
            />
          ))}
        </div>
      </Panel>

      {/* Urgency */}
      <Panel title="Fast delivery">
        <div className="max-w-xs">
          <NumberField
            label="Fast delivery surcharge (%)"
            value={Math.round((draft.fastMultiplier - 1) * 100)}
            onChange={(v) =>
              setDraft((d) => ({ ...d, fastMultiplier: 1 + v / 100 }))
            }
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Percentage added to the subtotal when the client selects fast
            delivery.
          </p>
        </div>
      </Panel>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 font-semibold text-card-foreground">{title}</h2>
      {children}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mb-3 block last:mb-0">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <div className="relative">
        <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="number"
          min={0}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </label>
  );
}