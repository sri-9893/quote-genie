import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Tech Minds IT Solutions Studio" },
      { name: "description", content: "Get in touch with Tech Minds IT Solutionsfor your next project." },
    ],
  }),
  component: Contact,
});

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    toast.success("Thanks! We'll get back to you shortly.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="page-enter">
      <section className="gradient-hero text-white">
        <Section className="py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Let's talk</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Have a project in mind? Send us a message and we'll respond within one business day.
          </p>
        </Section>
      </section>

      <Section className="grid gap-8 py-16 lg:grid-cols-2">
        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: "info@techmindsit.com" },
            { icon: Phone, label: "Phone", value: "+91 9710499993" },
            { icon: MessageCircle, label: "WhatsApp", value: "+91 9710499993" },
            { icon: MapPin, label: "Office", value: "Nellore, India" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
              <span className="grid h-11 w-11 place-items-center rounded-lg gradient-primary text-primary-foreground">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <p className="font-semibold text-foreground">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Name</span>
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
              <input className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Message</span>
              <textarea className={inputCls + " min-h-[120px] resize-y"} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </label>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5">
              Send message <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </Section>
    </div>
  );
}