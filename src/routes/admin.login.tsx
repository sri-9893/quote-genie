import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Lock, Calculator, ArrowLeft } from "lucide-react";
import { login, ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/quote/adminAuth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Tech Minds IT Solutions" }] }),
  component: AdminLogin,
});

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("Welcome back, admin!");
      navigate({ to: "/admin/dashboard" });
    } else {
      toast.error("Invalid credentials.");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center gradient-hero px-4">
      <div className="w-full max-w-md animate-scale-in rounded-2xl border border-white/15 bg-card p-8 shadow-glow">
        <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-lg gradient-primary text-primary-foreground">
            <Calculator className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-bold text-foreground">Admin Login</h1>
            <p className="text-xs text-muted-foreground">Tech Minds IT Solutions dashboard</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
            <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@company.com" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Password</span>
            <input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </label>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5">
            <Lock className="h-4 w-4" /> Sign in
          </button>
        </form>

        <div className="mt-5 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Demo credentials</p>
          <p>Email: {ADMIN_EMAIL}</p>
          <p>Password: {ADMIN_PASSWORD}</p>
        </div>
      </div>
    </div>
  );
}