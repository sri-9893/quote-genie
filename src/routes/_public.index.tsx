import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Code2,
  Megaphone,
  Palette,
  Search,
  ShoppingCart,
  Zap,
  CheckCircle2,
  Star,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { Section, SectionHeading } from "@/components/site/Section";
import { packageOrder, packages, formatCurrency } from "@/lib/quote/pricingData";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "Tech Minds IT Solutions — Build, Brand & Grow Your Business Online" },
      {
        name: "description",
        content:
          "Tech Minds IT Solutions builds websites, branding, SEO and digital marketing for startups. Estimate your project cost in seconds.",
      },
    ],
  }),
  component: Home,
});

const services = [
  { icon: Code2, title: "Web Development", desc: "Fast, responsive websites & web apps." },
  { icon: Palette, title: "Branding & Design", desc: "Logos, identity & UI that stand out." },
  { icon: Search, title: "SEO", desc: "Rank higher and get found on Google." },
  { icon: Megaphone, title: "Digital Marketing", desc: "Ads & campaigns that convert." },
  { icon: ShoppingCart, title: "E-commerce", desc: "Online stores with payments built in." },
  { icon: Zap, title: "Maintenance", desc: "Hosting, support & continuous updates." },
];

const stats = [
  { value: "120+", label: "Projects delivered" },
  { value: "98%", label: "Client satisfaction" },
  { value: "7 days", label: "Avg. kickoff" },
  { value: "24/7", label: "Support" },
];

function Home() {
  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden text-white">
        <Section className="grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Star className="h-3.5 w-3.5" /> Trusted digital partner for startups
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Know your website cost{" "}
              <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
                before you start
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/80">
              Websites, branding, SEO and marketing — all in one place. Use our smart
              estimator to get an instant quotation and download it as a PDF.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/estimate"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary shadow-glow transition-transform hover:-translate-y-0.5"
              >
                Estimate my project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                View pricing
              </Link>
            </div>
          </div>

          <div className="animate-scale-in">
            <img
              src={heroImg}
              alt="Dashboard showing project pricing and analytics"
              width={1280}
              height={960}
              className="w-full rounded-2xl border border-white/15 shadow-glow"
            />
          </div>
        </Section>
      </section>

      {/* Stats */}
      <Section className="-mt-10 relative z-10">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-gradient sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Services */}
      <Section className="py-20">
        <SectionHeading
          eyebrow="What we do"
          title="Everything your brand needs to grow"
          subtitle="One team for design, development and growth. Pick what you need — we price it transparently."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <span className="grid h-12 w-12 place-items-center rounded-lg gradient-primary text-primary-foreground transition-transform group-hover:scale-110">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/services" className="inline-flex items-center gap-1 font-semibold text-primary hover:gap-2 transition-all">
            See all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Packages teaser */}
      <section className="bg-secondary/40 py-20">
        <Section>
          <SectionHeading
            eyebrow="Simple pricing"
            title="Packages for every budget"
            subtitle="From a quick static site to a full e-commerce platform."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {packageOrder.map((key) => {
              const pkg = packages[key];
              return (
                <div
                  key={key}
                  className={`relative rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-soft ${
                    pkg.popular ? "border-primary shadow-soft" : "border-border"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-6 rounded-full gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-card-foreground">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{pkg.tagline}</p>
                  <p className="mt-4 text-3xl font-bold text-foreground">
                    {formatCurrency(pkg.basePrice)}
                    <span className="text-sm font-normal text-muted-foreground"> starting</span>
                  </p>
                  <ul className="mt-5 space-y-2">
                    {pkg.includes.slice(0, 4).map((inc) => (
                      <li key={inc} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/estimate"
              className="inline-flex items-center gap-2 rounded-lg gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Build your custom quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Section>
      </section>

      {/* CTA */}
      <Section className="py-20">
        <div className="gradient-dark relative overflow-hidden rounded-3xl px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to launch your idea?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Get a transparent estimate in under a minute. No commitment, no hidden fees.
          </p>
          <Link
            to="/estimate"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary transition-transform hover:-translate-y-0.5"
          >
            Start estimating <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </div>
  );
}