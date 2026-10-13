import type { MetadataRoute } from "next";

import { siteConfig } from "@/data/site";
import { getCmsServices } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getCmsServices();
  const routes = [
    "/",
    "/about",
    "/services",
    "/contact",
    "/faq",
    "/portfolio",
    "/privacy-policy",
    "/terms",
    ...services.map((service) => service.slug === "design-services" ? "/design" : `/${service.slug}`),
  ];

  return [...new Set(routes)].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));
}
