import Link from "next/link";
import { BriefcaseBusiness, Camera } from "lucide-react";

import { footerLinks } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { LogoMark } from "@/components/ui/LogoMark";

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr]">
          <div style={{ background: "transparent", border: "none", boxShadow: "none" }}>
            <LogoMark variant="horizontal" className="w-[210px] max-w-full sm:w-[210px]" />
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-100">{siteConfig.tagline}</p>
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
              <li>
                <Link href="/web-development" className="transition hover:text-white">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/ai-solutions" className="transition hover:text-white">
                  AI Solutions
                </Link>
              </li>
              <li>
                <Link href="/software-development" className="transition hover:text-white">
                  Software Development
                </Link>
              </li>
              <li>
                <Link href="/training" className="transition hover:text-white">
                  Training
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold uppercase tracking-[0.18em] text-white/70">Social</h3>
            <div className="mt-4 flex gap-3">
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-100 transition hover:bg-white/10"
                aria-label="LinkedIn"
              >
                <BriefcaseBusiness size={18} />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-100 transition hover:bg-white/10"
                aria-label="Instagram"
              >
                <Camera size={18} />
              </a>
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
