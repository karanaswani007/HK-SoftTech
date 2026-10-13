import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Maintenance Plans",
  description: "Explore maintenance plans for backups, updates, security, SEO support, performance care and priority website assistance.",
};

export default function MaintenancePage() {
  return <ServicePageTemplate serviceSlug="maintenance" />;
}
