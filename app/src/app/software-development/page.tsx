import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Software Development",
  description: "Custom CRM, ERP, billing, attendance and business software development from HK SoftTech.",
};

export default function SoftwareDevelopmentPage() {
  return <ServicePageTemplate serviceSlug="software-development" />;
}
