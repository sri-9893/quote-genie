import { Link } from "@tanstack/react-router";
import { Calculator, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="gradient-dark text-sidebar-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-lg gradient-primary text-primary-foreground">
              <Calculator className="h-5 w-5" />
            </span>
            <span className="text-lg">Tech Minds IT Solutions</span>
          </div>
          <p className="mt-4 text-sm text-sidebar-foreground/70">
            Websites, branding, SEO & digital growth for ambitious startups.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-sidebar-foreground/60">
            Company
          </h4>
          <ul className="space-y-2 text-sm text-sidebar-foreground/80">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-sidebar-foreground/60">
            Get Started
          </h4>
          <ul className="space-y-2 text-sm text-sidebar-foreground/80">
            <li><Link to="/estimate" className="hover:text-white">Cost Estimator</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/admin/login" className="hover:text-white">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-sidebar-foreground/60">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-sidebar-foreground/80">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>hello@Tech Minds IT Solutions.dev</span></li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>+91 98765 43210</span></li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>Bengaluru, India</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-sidebar-foreground/60">
        © {new Date().getFullYear()} Tech Minds IT Solutions. Demo project — data stored locally.
      </div>
    </footer>
  );
}