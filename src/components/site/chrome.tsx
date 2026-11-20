import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/brand/logo-h.png";
import { buttonStyles } from "@/components/ui/button";

type ServiceLink = { slug: string; name: string; category_slug?: string };
type Category = { slug: string; name: string; services: ServiceLink[] };
type Settings = Record<string, string | boolean>;

export type Shell = {
  settings: Settings;
  categories: Category[];
};

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/solutions", label: "Solutions" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/training", label: "Training" },
  { to: "/contact", label: "Contact" },
] as const;

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  return (
    <button
      type="button"
      className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink"
      aria-label={dark ? "Use light theme" : "Use dark theme"}
      onClick={() => {
        const next = !document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("hk-theme", next ? "dark" : "light");
        setDark(next);
      }}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

export function Header({ shell }: { shell: Shell }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  function openServices() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setServicesOpen(true);
  }
  function closeServices() {
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 140);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-xl">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-card focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-3 sm:h-20 sm:gap-4 sm:px-6">
        <Link to="/" aria-label="HK SoftTech home" className="flex shrink-0 items-center rounded-lg bg-card px-2 py-1">
          <img src={logo} alt="HK SoftTech" className="block h-9 w-32 object-contain object-left sm:h-11 sm:w-40" />
        </Link>
        <nav className="ml-auto hidden items-center gap-4 text-sm font-medium text-ink xl:gap-5 lg:flex" aria-label="Primary">
          <Link to="/" className="hover:text-accent" activeOptions={{ exact: true }} activeProps={{ className: "text-accent" }}>
            Home
          </Link>
          <Link to="/about" className="hover:text-accent" activeProps={{ className: "text-accent" }}>
            About
          </Link>
          <div className="relative" onMouseEnter={openServices} onMouseLeave={closeServices}>
            <button
              type="button"
              className="hover:text-accent"
              aria-expanded={servicesOpen}
              aria-controls="services-menu"
              onClick={() => setServicesOpen((value) => !value)}
            >
              Services
            </button>
            {servicesOpen ? (
              <div id="services-menu" className="fixed top-20 left-1/2 z-50 w-[min(72rem,calc(100vw-2rem))] -translate-x-1/2 pt-2">
                <div className="grid max-h-[min(70vh,34rem)] grid-cols-2 gap-x-6 gap-y-5 overflow-y-auto rounded-2xl border border-line bg-card p-5 shadow-sm xl:grid-cols-5">
                  {shell.categories.map((category) => (
                    <div key={category.slug} className="min-w-0">
                      <Link
                        to="/services"
                        hash={category.slug}
                        className="text-sm font-semibold leading-5 text-ink hover:text-accent"
                        onClick={() => setServicesOpen(false)}
                      >
                        {category.name}
                      </Link>
                      <ul className="mt-3 space-y-2">
                        {category.services.map((service) => (
                          <li key={service.slug}>
                            <Link
                              to="/services/$slug"
                              params={{ slug: service.slug }}
                              className="text-sm leading-5 break-words text-muted hover:text-ink"
                              onClick={() => setServicesOpen(false)}
                            >
                              {service.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          {LINKS.filter((link) => !["/", "/about"].includes(link.to)).map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-accent" activeProps={{ className: "text-accent" }}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <ThemeToggle />
          <div className="hidden xl:block">
            <Link to="/contact" className={buttonStyles({ variant: "primary" })}>
              Start a Project
            </Link>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line sm:h-11 sm:w-11 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 top-16 z-30 overflow-y-auto bg-paper px-4 py-6 sm:top-20 lg:hidden" role="dialog" aria-label="Mobile menu">
          <nav className="mx-auto flex max-w-lg flex-col gap-2" aria-label="Mobile">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-xl px-3 py-3 text-base font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <p className="px-3 pt-4 text-xs font-semibold tracking-widest text-muted uppercase">Services</p>
            {shell.categories.map((category) => (
              <Link
                key={category.slug}
                to="/services"
                hash={category.slug}
                className="rounded-xl px-3 py-3 text-sm leading-6 break-words"
                onClick={() => setOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link to="/contact" className={`${buttonStyles({ variant: "primary" })} mt-4`} onClick={() => setOpen(false)}>
              Start a Project
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function Footer({ shell }: { shell: Shell }) {
  const settings = shell.settings;
  const phone = String(settings.phone ?? "");
  const whatsapp = String(settings.whatsapp ?? "");
  return (
    <footer className="border-t border-line bg-navy text-on-navy">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="inline-block rounded-lg bg-card px-2 py-1">
            <img src={logo} alt="HK SoftTech" className="block h-10 w-[10.5rem] max-w-full object-contain object-left" />
          </div>
          <p className="mt-4 text-sm leading-6 text-on-navy/80">{String(settings.footer_blurb ?? "")}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase">Navigate</p>
          <ul className="mt-4 space-y-2 text-sm text-on-navy/80">
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-on-navy">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/services" className="hover:text-on-navy">
                Services
              </Link>
            </li>
            <li>
              <Link to="/insights" className="hover:text-on-navy">
                Insights
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase">Services</p>
          <ul className="mt-4 space-y-2 text-sm text-on-navy/80">
            {shell.categories.map((category) => (
              <li key={category.slug}>
                <Link to="/services" hash={category.slug} className="hover:text-on-navy">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-on-navy/80">
            {phone ? (
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
              </li>
            ) : null}
            {whatsapp ? (
              <li>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </li>
            ) : null}
            {settings.email ? <li>{String(settings.email)}</li> : null}
            {settings.address ? <li>{String(settings.address)}</li> : null}
            {settings.hours ? <li>{String(settings.hours)}</li> : null}
            {settings.linkedin_url ? (
              <li>
                <a href={String(settings.linkedin_url)}>LinkedIn</a>
              </li>
            ) : null}
            {settings.instagram_url ? (
              <li>
                <a href={String(settings.instagram_url)}>Instagram</a>
              </li>
            ) : null}
            {settings.github_url ? (
              <li>
                <a href={String(settings.github_url)}>GitHub</a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="border-t border-on-navy/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-on-navy/70 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} HK SoftTech. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/admin">Studio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PageIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <header className="mx-auto max-w-6xl px-4 pt-14 pb-8 text-center sm:px-6 sm:pt-20">
      <h1 className="mx-auto max-w-3xl tracking-tight">
        <span className="block text-3xl font-bold text-accent sm:text-4xl">{eyebrow}</span>
        <span className="mt-2 block text-lg font-semibold text-ink sm:text-2xl">{title}</span>
      </h1>
      {body ? <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">{body}</p> : null}
    </header>
  );
}
