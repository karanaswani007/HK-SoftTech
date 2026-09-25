import type { Metadata } from "next";

import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Find answers to common questions about HK SoftTech services, training, AI solutions, software development and digital growth support.",
};

export default function FAQPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="A quick reference for clients, students, and teams exploring HK SoftTech offerings."
      />
      <div className="mt-10">
        <FAQAccordion />
      </div>
    </section>
  );
}
