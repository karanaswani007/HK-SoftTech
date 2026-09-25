import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact HK SoftTech to discuss your website, AI, software, training, consulting or digital growth requirements.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Contact"
        title="Tell us about your project"
        description="Tell us what you are building, improving, or planning so we can guide the right next step."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-brand-light p-6 shadow-sm md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-blue shadow-sm"><Mail size={18} /></span>
            <div>
              <div className="text-sm uppercase tracking-[0.18em] text-slate-500">Email</div>
              <a href={`mailto:${siteConfig.email}`} className="mt-2 block text-lg font-semibold text-brand-navy">
                {siteConfig.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-blue shadow-sm"><Phone size={18} /></span>
            <div>
              <div className="text-sm uppercase tracking-[0.18em] text-slate-500">Phone</div>
              <div className="mt-2 text-lg font-semibold text-brand-navy">{siteConfig.phone}</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-blue shadow-sm"><MapPin size={18} /></span>
            <div>
              <div className="text-sm uppercase tracking-[0.18em] text-slate-500">Location</div>
              <div className="mt-2 text-lg font-semibold text-brand-navy">{siteConfig.location}</div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
