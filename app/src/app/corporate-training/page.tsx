import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Corporate Training",
  description: "Corporate training for digital adoption, productivity, AI integration and team skill development.",
};

export default function CorporateTrainingPage() {
  return <ServicePageTemplate serviceSlug="corporate-training" />;
}
