import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import { servicePages } from "@/data/services";

export const metadata: Metadata = {
  title: "AI Solutions",
  description: "AI chatbots, automation planning, GPT integration, AI content generation and internal productivity support from HK SoftTech.",
};

export default function AISolutionsPage() {
  return <ServicePageTemplate {...servicePages["ai-solutions"]} />;
}
