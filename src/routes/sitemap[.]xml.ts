import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { getSql } = await import("@/lib/db");
        const sql = await getSql();
        const settings = await sql<{ canonical_base: string }>`select canonical_base from site_settings where id = 1`;
        const origin = new URL(request.url).origin;
        const base = (settings[0]?.canonical_base || origin).replace(/\/$/, "");
        const services = await sql<{ slug: string }>`select slug from services where published = true`;
        const projects = await sql<{ slug: string }>`select slug from projects where published = true`;
        const posts = await sql<{ slug: string }>`select slug from posts where status = 'published'`;
        const paths = [
          "/",
          "/about",
          "/services",
          "/solutions",
          "/portfolio",
          "/training",
          "/insights",
          "/contact",
          "/privacy-policy",
          "/terms",
          ...services.map((row) => `/services/${row.slug}`),
          ...projects.map((row) => `/portfolio/${row.slug}`),
          ...posts.map((row) => `/insights/${row.slug}`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
          .map((path) => `  <url><loc>${base}${path}</loc></url>`)
          .join("\n")}\n</urlset>\n`;
        return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
