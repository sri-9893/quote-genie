import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, XCircle } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import {
  packageOrder,
  packages,
  features,
  formatCurrency,
} from "@/lib/quote/pricingData";

export const Route = createFileRoute("/_public/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing Packages — NexaForge Studio" },
      {
        name: "description",
        content:
          "Transparent pricing: Low Budget, Mid Range and High Premium website packages with a clear feature comparison.",
      },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <div className="page-enter">
      <section className="gradient-hero text-white">
        <Section className="py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Pricing Packages</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Pick a package or build a custom quote. Prices are starting points — the
            estimator gives you an exact figure.
          </p>
        </Section>
      </section>

      <Section className="py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {packageOrder.map((key) => {
            const pkg = packages[key];
            return (
              <div
                key={key}
                className={`relative flex flex-col rounded-2xl border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-soft ${
                  pkg.popular ? "border-primary shadow-soft" : "border-border"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-card-foreground">{pkg.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{pkg.tagline}</p>
                <p className="mt-5 text-4xl font-bold text-foreground">
                  {formatCurrency(pkg.basePrice)}
                </p>
                <p className="text-sm text-muted-foreground">
                  starting · {pkg.includedPages[0]}–{pkg.includedPages[1]} pages · ~{pkg.baseTimelineDays} days
                </p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {pkg.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {inc}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/estimate"
                  search={{ pkg: key }}
                  className={`mt-7 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold transition-transform hover:-translate-y-0.5 ${
                    pkg.popular
                      ? "gradient-primary text-primary-foreground shadow-soft"
                      : "border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  Choose {pkg.name} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Feature comparison */}
        <div className="mt-16 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-secondary/60 text-left">
                <th className="p-4 font-semibold text-foreground">Feature</th>
                {packageOrder.map((key) => (
                  <th key={key} className="p-4 text-center font-semibold text-foreground">
                    {packages[key].name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.key} className="border-t border-border">
                  <td className="p-4 text-muted-foreground">{f.label}</td>
                  {packageOrder.map((key) => (
                    <td key={key} className="p-4 text-center">
                      {f.includedIn.includes(key) ? (
                        <CheckCircle2 className="mx-auto h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground/40" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}