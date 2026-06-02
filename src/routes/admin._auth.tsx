import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader } from "@/components/quote/Loader";
import { useAdminAuth } from "@/lib/quote/hooks";

export const Route = createFileRoute("/admin/_auth")({
  component: AdminAuthLayout,
});

// Client-side protected route. localStorage isn't available during SSR,
// so we wait until mounted before deciding whether to redirect.
function AdminAuthLayout() {
  const authed = useAdminAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (ready && !authed) navigate({ to: "/admin/login" });
  }, [ready, authed, navigate]);

  if (!ready || !authed) return <Loader label="Checking access..." />;

  return (
    <div className="flex min-h-screen flex-col bg-secondary/30 md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}