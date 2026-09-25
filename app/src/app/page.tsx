import { AudienceSection } from "@/components/home/AudienceSection";
import { CTASection } from "@/components/home/CTASection";
import { Hero } from "@/components/home/Hero";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { WhyHKSoftTech } from "@/components/home/WhyHKSoftTech";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] border border-slate-200 bg-brand-light p-8 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-blue">Company</div>
            <p className="mt-3 text-xl font-bold text-brand-navy">Technology built for practical growth.</p>
          </div>
          <div className="md:col-span-2 text-base leading-8 text-slate-600">
            HK SoftTech brings together web development, AI systems, custom software, digital presence support, training and consulting for businesses, startups, students and professionals who need reliable digital progress.
          </div>
        </div>
      </section>

      <ServicesOverview />
      <WhyHKSoftTech />
      <AudienceSection />

      <section className="bg-brand-light py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Capabilities"
              title="Solutions for digital growth and operational clarity"
              description="From web experiences to automation planning and training ecosystems, HK SoftTech helps clients turn opportunities into action."
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              "Web Development",
              "AI Automation",
              "Custom Software",
              "Brand & Digital Presence",
              "Career Development",
              "Corporate Training",
            ].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-lg font-semibold text-brand-navy shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions from clients and learners"
            description="Clear answers for businesses, professionals, startups and students exploring HK SoftTech services."
          />
          <div className="mt-10">
            <FAQAccordion />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
