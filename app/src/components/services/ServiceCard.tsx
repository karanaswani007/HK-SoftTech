import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { ServiceItem } from "@/data/services";

export function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(11,77,255,0.1)]">
      <div className="flex items-center justify-between">
        <span className="rounded-2xl bg-brand-light px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
          {service.category}
        </span>
      </div>
      <h3 className="mt-5 text-2xl font-bold text-brand-navy">{service.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{service.short}</p>
      <ul className="mt-5 space-y-2 text-sm text-slate-700">
        {service.keyServices.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
            {item}
          </li>
        ))}
      </ul>
      <Link href={service.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
        View Details
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}
