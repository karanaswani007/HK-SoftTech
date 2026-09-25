import Link from "next/link";
import { ArrowRight, BrainCircuit, BriefcaseBusiness, Code2, Cpu, Palette, ShieldCheck, Sparkles } from "lucide-react";

import { serviceCategories } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";

const icons = {
  "web-development": Code2,
  "ai-solutions": BrainCircuit,
  "software-development": Cpu,
  "digital-presence": BriefcaseBusiness,
  "career-services": Sparkles,
  training: ShieldCheck,
  "corporate-training": ShieldCheck,
  consulting: BriefcaseBusiness,
  maintenance: ShieldCheck,
  design: Palette,
};

export function ServicesOverview() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Core services"
          title="Technology solutions built for real business needs"
          description="From websites and AI systems to software, training, and consulting, HK SoftTech helps teams move from idea to execution with practical digital support."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {serviceCategories.map((service) => {
            const Icon = icons[service.slug as keyof typeof icons] ?? Code2;

            return (
              <article key={service.slug} className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(11,77,255,0.12)]">
                <div className="flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand-blue shadow-inner">
                    <Icon size={26} />
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{service.category}</span>
                </div>

                <h3 className="mt-6 text-2xl font-bold text-brand-navy">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{service.short}</p>

                <ul className="mt-5 space-y-2 text-sm text-slate-700">
                  {service.keyServices.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={service.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition group-hover:text-brand-blue-dark"
                >
                  View details
                  <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
