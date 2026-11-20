import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Menu, X } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { studioLogout } from "@/lib/hk/studio-fns";

export type Access = {
  role: string;
  name: string;
  email: string;
  bootstrapped: boolean;
  newLeads: number | null;
};

const AccessContext = createContext<Access | null>(null);

export function AccessProvider({ value, children }: { value: Access; children: ReactNode }) {
  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

export function useAccess() {
  const value = useContext(AccessContext);
  if (!value) throw new Error("Studio access missing");
  return value;
}

const NAV = [
  { to: "/admin", label: "Overview", perm: "any" },
  { to: "/admin/services", label: "Services", perm: "content" },
  { to: "/admin/portfolio", label: "Portfolio", perm: "content" },
  { to: "/admin/enquiries", label: "Enquiries", perm: "leads" },
  { to: "/admin/projects", label: "Delivery", perm: "leads" },
  { to: "/admin/training", label: "Training", perm: "any" },
  { to: "/admin/testimonials", label: "Testimonials", perm: "content" },
  { to: "/admin/insights", label: "Insights", perm: "content" },
  { to: "/admin/content", label: "Website", perm: "content" },
  { to: "/admin/media", label: "Media", perm: "content" },
  { to: "/admin/seo", label: "SEO", perm: "settings" },
  { to: "/admin/team", label: "Team", perm: "team" },
  { to: "/admin/activity", label: "Activity", perm: "any" },
  { to: "/admin/settings", label: "Settings", perm: "settings" },
] as const;

function can(role: string, perm: (typeof NAV)[number]["perm"]) {
  if (role === "none") return false;
  if (perm === "any") return true;
  if (perm === "content") return ["super_admin", "admin", "editor"].includes(role);
  if (perm === "leads") return ["super_admin", "admin", "sales"].includes(role);
  if (perm === "settings" || perm === "team") return ["super_admin", "admin"].includes(role);
  return false;
}

const NAMES: Record<string, string> = {
  "/admin": "Overview",
  "/admin/services": "Services",
  "/admin/portfolio": "Portfolio",
  "/admin/enquiries": "Enquiries",
  "/admin/projects": "Delivery",
  "/admin/training": "Training",
  "/admin/testimonials": "Testimonials",
  "/admin/insights": "Insights",
  "/admin/content": "Website",
  "/admin/media": "Media",
  "/admin/seo": "SEO",
  "/admin/team": "Team",
  "/admin/activity": "Activity",
  "/admin/settings": "Settings",
};

export function AdminFrame({ children }: { children: ReactNode }) {
  const access = useAccess();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const logout = useServerFn(studioLogout);
  const [open, setOpen] = useState(false);
  const items = NAV.filter((item) => can(access.role, item.perm));

  return (
    <div className="min-h-screen bg-paper text-ink lg:flex">
      <aside
        className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy text-on-navy transition-transform lg:static lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <Link to="/admin" className="text-sm font-semibold tracking-wide" onClick={() => setOpen(false)}>
            HK Studio
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-6" aria-label="Studio">
          {items.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm ${active ? "bg-on-navy/10" : "hover:bg-on-navy/5"}`}
                onClick={() => setOpen(false)}
              >
                <span>{item.label}</span>
                {item.to === "/admin/enquiries" && access.newLeads ? (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-on-accent tabular-nums">{access.newLeads}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <Link to="/" className="px-4 py-4 text-xs text-on-navy/70">
          View website
        </Link>
      </aside>
      {open ? <button type="button" className="fixed inset-0 z-30 bg-navy/40 lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-3 border-b border-line bg-card px-4 py-3">
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden" aria-label="Open studio menu" onClick={() => setOpen(true)}>
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <div className="min-w-0">
            <p className="text-xs text-muted">Studio / {NAMES[pathname] ?? "Studio"}</p>
            <p className="truncate text-sm font-semibold">{access.name}</p>
          </div>
          <div className="ml-auto">
            <button
              type="button"
              className="rounded-full border border-line px-4 py-2 text-sm font-semibold"
              onClick={() => {
                logout()
                  .catch(() => undefined)
                  .finally(() => navigate({ to: "/login" }));
              }}
            >
              Sign out
            </button>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
