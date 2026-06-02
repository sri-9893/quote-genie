import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Code2,
  Palette,
  Search,
  Megaphone,
  ShoppingCart,
  Zap,
  Smartphone,
  ServerCog,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/_public/services")({
  head: () => ({
    meta: [
      { title: "Services — NexaForge Studio" },
      {
        name: "description",
        content:
          "Web development, branding, SEO, digital marketing, e-commerce and maintenance services for growing businesses.",
      },
    ],
  }),
  component: Services,
});

const services = [
  {
    icon: Code2,
    title: "Website Development",
    desc: "Lightning-fast, SEO-friendly websites and web apps built with modern tech.",
    points: ["Static & dynamic sites", "Responsive on all devices", "Custom admin panels"],
  },
  {
    icon: Palette,
    title: "Branding & Design",
    desc: "Memorable brand identity, logos and pixel-perfect UI/UX design.",
    points: ["Logo & brand kit", "UI/UX design", "Social media creatives"],
  },
  {
    icon: Search,
    title: "Search Engine Optimization",
    desc: "Climb the rankings and bring in organic traffic that converts.",
    points: ["On-page SEO", "Technical audits", "Keyword strategy"],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "Data-driven ad campaigns across Google, Meta and beyond.",
    points: ["Paid ads", "Social media", "Email campaigns"],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    desc: "Full online stores with product management and secure payments.",
    points: ["Product catalog", "Payment gateway", "Order dashboard"],
  },
  {
    icon: Smartphone,
    title: "WhatsApp & Enquiry",
    desc: "Capture leads instantly with WhatsApp chat and enquiry management.",
    points: ["WhatsApp button", "Contact forms", "Lead inbox"],
  },
  {
    icon: ServerCog,
    title: "Hosting & Support",
    desc: "Reliable hosting, backups and ongoing maintenance.",
    points: ["Managed hosting", "SSL & backups", "Priority support"],
  },
  {
    icon: Zap,
    title: "Performance",
    desc: "Speed optimization and analytics to keep you ahead.",
    points: ["Core Web Vitals", "Analytics setup", "Speed tuning"],
  },
];

function Services() {
  return (
    <div className="page-enter">
      <section className="gradient-hero text-white">
        <Section className="py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Our Services</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            A complete digital toolkit to design, build, launch and grow your business online.
          </p>
        </Section>
      </section>

      <Section className="py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.title}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <span className="grid h-12 w-12 place-items-center rounded-lg gradient-primary text-primary-foreground transition-transform group-hover:scale-110">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <ul className="mt-4 space-y-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl border border-border bg-secondary/40 p-10 text-center">
          <h2 className="text-2xl font-bold text-foreground">Not sure what you need?</h2>
          <p className="max-w-xl text-muted-foreground">
            Use our cost estimator to mix and match services and get an instant, itemised quote.
          </p>
          <Link
            to="/estimate"
            className="inline-flex items-center gap-2 rounded-lg gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
          >
            Open the estimator <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </div>
  );
}