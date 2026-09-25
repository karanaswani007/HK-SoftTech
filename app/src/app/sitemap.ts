import type { MetadataRoute } from "next";

import { siteConfig } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/about",
    "/services",
    "/web-development",
    "/ai-solutions",
    "/software-development",
    "/digital-presence",
    "/career-services",
    "/training",
    "/corporate-training",
    "/consulting",
    "/maintenance",
    "/design",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));
}
