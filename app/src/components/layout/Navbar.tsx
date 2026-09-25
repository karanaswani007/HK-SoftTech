"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { navigationItems } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/LogoMark";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="flex items-center"
            aria-label="Home"
            style={{ background: "transparent", border: "none", boxShadow: "none" }}
          >
            <LogoMark variant="horizontal" className="w-[180px] sm:w-[170px]" />
          </Link>

          {/* navbar items */}
          <div className="hidden items-center gap-7 text-sm font-medium text-slate-700 lg:flex">
            {navigationItems.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label} className="group relative">
                    <button className="flex items-center gap-1 transition hover:text-brand-blue">
                      {item.label}
                      <span className="text-xs">▾</span>
                    </button>
                    <div className="invisible absolute left-0 top-full mt-4 min-w-56 rounded-2xl border border-slate-200 bg-white p-3 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-brand-light hover:text-brand-blue"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link key={item.href} href={item.href} className="transition hover:text-brand-blue">
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:block">
            <Button href="/contact" variant="primary" className="px-5 py-2.5 text-sm">
              Let&apos;s Build Together
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 lg:hidden"
            aria-label="Open navigation"
            onClick={() => setOpen((state) => !state)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        <div
          className={cn(
            "overflow-hidden border-t border-slate-200 bg-white transition-all duration-300 lg:hidden",
            open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="space-y-3 py-4">
            {navigationItems.map((item) => (
              <div key={item.label} className="space-y-2">
                {item.children ? (
                  <div className="space-y-2">
                    <div className="px-3 text-sm font-semibold text-slate-500">{item.label}</div>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="px-3 pt-2">
              <Button href="/contact" variant="primary" className="w-full justify-center">
                Let&apos;s Build Together
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
