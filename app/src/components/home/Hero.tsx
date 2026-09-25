"use client";

import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Code2, Database, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/LogoMark";

const floatingPills = [
  { icon: Code2, label: "Web Development" },
  { icon: BrainCircuit, label: "AI Solutions" },
  { icon: Database, label: "Software" },
  { icon: Sparkles, label: "Training" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(22,139,255,0.12),_transparent_42%),linear-gradient(180deg,#ffffff_0%,#f5f8fc_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col justify-center"
        >
          <div className="mb-6 flex items-center gap-3 self-start rounded-full border border-brand-blue/35 bg-brand-light px-5 py-1 text-sm font-medium text-brand-blue">
            <LogoMark compact variant="vertical" className="shrink-0"/>
            <span>Technology partner for growth</span>
          </div>

          <h1 className="max-w-xl text-4xl font-black leading-[0.96] tracking-[-0.05em] text-brand-navy sm:text-5xl lg:text-7xl">
            Build Smarter. <span className="text-brand-blue">Grow Faster.</span> Go Digital.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            HK SoftTech helps businesses, startups, students and professionals build modern digital experiences through web development, AI solutions, custom software, training and technology consulting.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/contact" className="px-6">
              Start a Project
            </Button>
            <Button href="/services" variant="secondary" className="px-6">
              Explore Services
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            {floatingPills.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-3 text-sm font-semibold text-slate-700 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand-blue">
                  <Icon size={18} />
                </span>
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10"
        >
          <div className="rounded-[2rem] border border-brand-blue/15 bg-white p-5 shadow-[0_30px_80px_rgba(11,77,255,0.12)]">
            <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#071A3D_0%,#0B4DFF_45%,#00B8E6_100%)] p-6 text-white">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="text-4xl font-black tracking-[-0.06em]">HK</div>
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/100">
                  Digital Ready
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-2xl font-bold">HK SoftTech</div>
                    <div className="mt-1 text-sm text-white/70">INNOVATE. DEVELOP. EMPOWER.</div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-cyan-300/20 text-cyan-100">
                    <Sparkles size={20} />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-white/80">
                  <div className="rounded-xl border border-white/10 bg-slate-950/15 p-3">
                    <div className="font-semibold text-white">Web</div>
                    <div className="mt-1">Development</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-950/15 p-3">
                    <div className="font-semibold text-white">AI</div>
                    <div className="mt-1">Solutions</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-950/15 p-3">
                    <div className="font-semibold text-white">Custom</div>
                    <div className="mt-1">Software</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-950/15 p-3">
                    <div className="font-semibold text-white">Career</div>
                    <div className="mt-1">Growth</div>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/60">Action</div>
                  <div className="mt-1 text-lg font-semibold">Let&apos;s build what&apos;s next.</div>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                  <ArrowRight size={18} />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
