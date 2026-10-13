import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Consulting",
  description: "Technology consulting, startup guidance, AI roadmap planning and digital strategy support from HK SoftTech.",
};

export default function ConsultingPage() {
  return <ServicePageTemplate serviceSlug="consulting" />;
}
