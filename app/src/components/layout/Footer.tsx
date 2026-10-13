import Link from "next/link";
import { BriefcaseBusiness, Camera } from "lucide-react";

import { footerLinks } from "@/data/navigation";
import { LogoMark } from "@/components/ui/LogoMark";
import type { CmsService, CmsSettings } from "@/lib/cms";

export function Footer({ settings, services }: { settings: CmsSettings; services: CmsService[] }) {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr]">
          <div style={{ background: "transparent", border: "none", boxShadow: "none" }}>
            <LogoMark variant="horizontal" className="w-[210px] max-w-full sm:w-[210px]" />
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-100">{settings.tagline}</p>
          </div>

          <div>
            <h3 className="text-base font-bold uppercase tracking-[0.18em] text-white/70">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-100">
              {footerLinks.company.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold uppercase tracking-[0.18em] text-white/70">Services</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-100">
              {services.slice(0, 4).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={service.slug === "design-services" ? "/design" : `/${service.slug}`}
                    className="transition hover:text-white"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold uppercase tracking-[0.18em] text-white/70">Social</h3>
            <div className="mt-4 flex gap-3">
              {settings.linkedin ? (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-100 transition hover:bg-white/10"
                  aria-label="LinkedIn"
                >
                  <BriefcaseBusiness size={18} />
                </a>
              ) : null}
              {settings.instagram ? (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-100 transition hover:bg-white/10"
                  aria-label="Instagram"
                >
                  <Camera size={18} />
                </a>
              ) : null}
            </div>
            <ul className="mt-6 space-y-3 text-sm text-slate-100">
              {footerLinks.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-300">
          © 2026 HK SoftTech. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
