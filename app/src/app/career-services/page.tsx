import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import { servicePages } from "@/data/services";

export const metadata: Metadata = {
  title: "Career Services",
  description: "Career support for students and professionals through resume review, portfolio guidance, mock interviews and placement preparation.",
};

export default function CareerServicesPage() {
  return <ServicePageTemplate {...servicePages["career-services"]} />;
}
