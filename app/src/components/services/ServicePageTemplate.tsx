import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ServicePageTemplate({
  title,
  intro,
  points,
  cta,
}: {
  title: string;
  intro: string;
  points: string[];
  cta: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_68px_rgba(15,23,42,0.04)] md:p-12">
        <SectionHeading title={title} description={intro} />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {points.map((point) => (
            <div key={point} className="rounded-2xl border border-slate-200 bg-brand-light p-4 text-sm font-medium text-slate-700">
              {point}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/contact" className="px-6">
            {cta}
          </Button>
          <Link href="/services" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-blue/20 hover:text-brand-blue">
            Explore all services
          </Link>
        </div>
      </div>
    </section>
  );
}
