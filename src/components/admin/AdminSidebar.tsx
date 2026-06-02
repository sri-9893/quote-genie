import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Calculator,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { getAdminEmail, logout } from "@/lib/quote/adminAuth";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/quotations", label: "Quotations", icon: FileText },
] as const;

export function AdminSidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/admin/login" });
  };

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-5 text-sidebar-foreground">
        <span className="grid h-9 w-9 place-items-center rounded-lg gradient-primary text-primary-foreground">
          <Calculator className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold leading-tight">NexaForge</p>
          <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            activeProps={{ className: "!bg-sidebar-accent !text-sidebar-foreground" }}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          View Website
        </Link>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <p className="px-3 pb-2 text-xs text-sidebar-foreground/50">{getAdminEmail()}</p>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-destructive/20 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 text-sidebar-foreground md:hidden">
        <span className="font-bold">NexaForge Admin</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-sidebar md:block">{content}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-sidebar animate-fade-in">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-sidebar-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
}