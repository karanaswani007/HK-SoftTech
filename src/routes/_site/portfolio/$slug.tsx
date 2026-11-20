import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProject } from "@/lib/hk/public-fns";

export const Route = createFileRoute("/_site/portfolio/$slug")({
  loader: ({ params }) => getProject({ data: { slug: params.slug } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: String(loaderData?.meta_title || loaderData?.title || "Project") },
      { name: "description", content: String(loaderData?.meta_description || loaderData?.summary || "") },
    ],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const project = Route.useLoaderData();
  if (!project) throw notFound();
  const stack = String(project.stack ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <nav className="text-sm text-muted">
        <Link to="/portfolio">Portfolio</Link>
        <span> / {String(project.title)}</span>
      </nav>
      <p className="mt-6 text-xs font-semibold tracking-widest text-accent uppercase">{String(project.category)}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{String(project.title)}</h1>
      <p className="mt-4 text-base leading-7 text-muted">{String(project.summary)}</p>
      {project.image_url ? (
        <img src={String(project.image_url)} alt={String(project.title)} loading="lazy" decoding="async" className="mt-8 w-full rounded-2xl border border-line" />
      ) : (
        <p className="mt-8 rounded-2xl border border-line bg-card p-5 text-sm text-muted">No project image has been published.</p>
      )}
      <div className="mt-8 space-y-4 text-sm leading-7">
        {String(project.body)
          .split(/\n\n+/)
          .map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
      </div>
      {stack.length ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {stack.map((item) => (
            <li key={item} className="rounded-full border border-line px-3 py-1 text-xs">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-6 flex gap-4 text-sm font-semibold text-accent">
        {project.project_url ? (
          <a href={String(project.project_url)} target="_blank" rel="noreferrer">
            Visit project
          </a>
        ) : null}
        {project.github_url ? (
          <a href={String(project.github_url)} target="_blank" rel="noreferrer">
            GitHub
          </a>
        ) : null}
      </div>
    </article>
  );
}
