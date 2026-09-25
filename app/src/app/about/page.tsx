import type { Metadata } from "next";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about HK SoftTech, its mission, services and the founder-led approach to web, AI, software and growth-focused technology solutions.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="About HK SoftTech"
        title="Technology support for software, AI, web, training, and digital growth"
        description="HK SoftTech is focused on building practical digital solutions for businesses, startups, students, and professionals. The work spans software, AI, web experiences, automation, training and coaching for real-world growth."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-brand-light via-white to-sky-50 p-8">
          <div className="flex h-64 items-center justify-center rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(135deg,#071A3D_0%,#0B4DFF_45%,#00B8E6_100%)] text-center text-white shadow-[0_30px_60px_rgba(11,77,255,0.18)]">
            <div>
              <div className="text-3xl font-black tracking-[-0.06em]">Mr. Karan R. Aswani</div>
              <div className="mt-3 text-sm uppercase tracking-[0.25em] text-white/70">Founder & CEO</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-brand-navy">Mission</h3>
            <p className="mt-3 text-base leading-8 text-slate-600">
              To help individuals and businesses turn digital opportunities into practical, measurable progress through technology, training and consulting.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-brand-navy">Vision</h3>
            <p className="mt-3 text-base leading-8 text-slate-600">
              To become a trusted partner for digital transformation, innovation, and skill development across startup, business and education ecosystems.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-brand-navy">What We Do</h3>
            <p className="mt-3 text-base leading-8 text-slate-600">
              HK SoftTech combines software development, AI support, web solutions, digital presence optimization, training and consulting to help clients move forward with clarity and confidence.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-brand-navy">Who We Serve</h3>
            <p className="mt-3 text-base leading-8 text-slate-600">
              Students, freelancers, startups, small businesses, colleges and companies looking for reliable technology support and forward-looking digital capability.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-brand-navy">Our Approach</h3>
          <p className="mt-4 text-base leading-8 text-slate-600">
            We focus on listening closely, understanding the real need, building sustainable solutions and supporting growth through practical implementation and ongoing guidance.
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-brand-navy">Founder-led Direction</h3>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Mr. Karan R. Aswani leads the company with a focus on technology, skill-building, business value and long-term digital readiness.
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Button href="/contact">Talk to us</Button>
        <Button href="/services" variant="secondary">Explore services</Button>
      </div>
    </section>
  );
}
