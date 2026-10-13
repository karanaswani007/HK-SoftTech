import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Package } from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPortfolioProjects } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore products and projects built by HK SoftTech.",
};

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Our work"
        title="Products and projects built to make an impact"
        description="Explore selected digital products, client work, and experiments from HK SoftTech."
      />

      {projects.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(11,77,255,0.12)]">
              <div
                role={project.imageUrl ? "img" : undefined}
                aria-label={project.imageUrl ? `${project.title} preview` : undefined}
                className="relative flex h-56 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(22,139,255,0.2),_transparent_55%),linear-gradient(135deg,#071A3D_0%,#0B4DFF_55%,#00B8E6_100%)] bg-cover bg-center"
                style={project.imageUrl ? { backgroundImage: `linear-gradient(135deg, rgba(7,26,61,0.12), rgba(11,77,255,0.2)), url("${new URL(project.imageUrl).href}")` } : undefined}
              >
                {!project.imageUrl ? (
                  project.type === "PRODUCT"
                    ? <Package size={52} className="text-white/85" aria-hidden="true" />
                    : <BriefcaseBusiness size={52} className="text-white/85" aria-hidden="true" />
                ) : null}
                <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-slate-950/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                  {project.type === "PRODUCT" ? "Product" : "Project"}
                </span>
                {project.featured ? (
                  <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-blue">Featured</span>
                ) : null}
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">{project.category}</p>
                <h2 className="mt-3 text-2xl font-bold text-brand-navy">{project.title}</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{project.description}</p>
                {project.projectUrl || project.sourceUrl ? (
                  <div className="mt-6 flex flex-wrap gap-4">
                    {project.projectUrl ? (
                      <a href={project.projectUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark">
                        View {project.type === "PRODUCT" ? "product" : "project"} <ArrowUpRight size={16} />
                      </a>
                    ) : null}
                    {project.sourceUrl ? (
                      <a href={project.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-brand-blue">
                        Source code <ArrowUpRight size={16} />
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[1.75rem] border border-dashed border-slate-300 bg-brand-light px-6 py-14 text-center">
          <BriefcaseBusiness size={36} className="mx-auto text-brand-blue" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-bold text-brand-navy">Our portfolio is coming soon</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-slate-600">
            We&apos;re preparing projects and products to feature here. Please check back soon.
          </p>
          <Link href="/contact" className="mt-6 inline-flex rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-blue-dark">
            Discuss a project
          </Link>
        </div>
      )}
    </section>
  );
}
