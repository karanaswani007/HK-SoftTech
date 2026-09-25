import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import { servicePages } from "@/data/services";

export const metadata: Metadata = {
  title: "Web Development",
  description: "Business websites, portfolios, landing pages, redesign services and SEO-focused web development from HK SoftTech.",
};

export default function WebDevelopmentPage() {
  return <ServicePageTemplate {...servicePages["web-development"]} />;
}
