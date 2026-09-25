import type { Metadata } from "next";

import { ServiceCard } from "@/components/services/ServiceCard";
import { serviceCategories } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore the full range of HK SoftTech services in web development, AI, software, digital presence, training, consulting, and support.",
};

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Services"
        title="A complete digital growth ecosystem"
        description="HK SoftTech supports businesses, students, freelancers, startups, and organizations with practical technology services designed around real requirements."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {serviceCategories.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </section>
  );
}
