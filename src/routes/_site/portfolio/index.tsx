import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/chrome";
import { getProjects } from "@/lib/hk/public-fns";

export const Route = createFileRoute("/_site/portfolio/")({
  loader: () => getProjects(),
  head: () => ({
    meta: [
      { title: "Portfolio | HK SoftTech" },
      { name: "description", content: "Named HK SoftTech projects. Screenshots and results are published only when they are real." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const projects = Route.useLoaderData();
  return (
    <>
      <PageIntro
        eyebrow="Portfolio"
        title="Work the studio is willing to name."
        body="If a live link or image is missing, it has not been published. Nothing here is a fabricated case study."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 sm:px-6 md:grid-cols-2">
        {projects.map((project) => (
          <Link key={String(project.slug)} to="/portfolio/$slug" params={{ slug: String(project.slug) }} className="lift overflow-hidden rounded-2xl border border-line bg-card">
            {project.image_url ? (
              <img src={String(project.image_url)} alt={String(project.title)} loading="lazy" decoding="async" className="aspect-video w-full object-cover" />
            ) : (
              <div className="flex aspect-video items-end bg-navy p-5 text-2xl font-semibold text-on-navy">{String(project.title)}</div>
            )}
            <div className="p-5">
              <p className="text-xs font-semibold tracking-widest text-accent uppercase">{String(project.category)}</p>
              <h2 className="mt-2 text-lg font-semibold">{String(project.title)}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{String(project.summary)}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
