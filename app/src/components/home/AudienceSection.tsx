import { audienceProfiles } from "@/data/audiences";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AudienceSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Who we help"
          title="Digital support for the people and teams shaping tomorrow"
          description="Whether you are building a career, launching a business, or upgrading a team’s digital workflow, HK SoftTech works across the full journey."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {audienceProfiles.map((audience) => (
            <div key={audience.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_38px_rgba(15,23,42,0.04)]">
              <h3 className="text-2xl font-bold text-brand-navy">{audience.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{audience.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {audience.services.map((service) => (
                  <span key={service} className="rounded-full border border-brand-blue/20 bg-brand-light px-2.5 py-1 text-xs font-medium text-brand-blue">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
