import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Workshops & Training",
  description: "Explore workshops and training programs for students, professionals, and colleges delivered by HK SoftTech.",
};

export default function TrainingPage() {
  return <ServicePageTemplate serviceSlug="training" />;
}
