import type { Metadata } from "next";

import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCmsFaqs, getCmsSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Find answers to common questions about HK SoftTech services, training, AI solutions, software development and digital growth support.",
};

export default async function FAQPage() {
  const [settings, faqs] = await Promise.all([getCmsSettings(), getCmsFaqs()]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={settings.faqEyebrow}
        title={settings.faqTitle}
        description={settings.faqDescription}
      />
      <div className="mt-10">
        <FAQAccordion faqs={faqs} />
      </div>
    </section>
  );
}
