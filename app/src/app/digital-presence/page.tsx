import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Digital Presence",
  description: "Digital presence support including LinkedIn growth, portfolio creation, resume optimization and personal branding.",
};

export default function DigitalPresencePage() {
  return <ServicePageTemplate serviceSlug="digital-presence" />;
}
