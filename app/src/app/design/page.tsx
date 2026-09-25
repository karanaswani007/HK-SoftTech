import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import { servicePages } from "@/data/services";

export const metadata: Metadata = {
  title: "Design Services",
  description: "Design services from HK SoftTech including branding, UI/UX design, presentations and visual communication support.",
};

export default function DesignPage() {
  return <ServicePageTemplate {...servicePages.design} />;
}
