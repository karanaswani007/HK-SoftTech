import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/chrome";
import { AUDIENCES } from "@/lib/hk/labels";

export const Route = createFileRoute("/_site/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions | HK SoftTech" },
      { name: "description", content: "How HK SoftTech works with students, freelancers, businesses, startups, colleges and companies." },
    ],
  }),
  component: SolutionsPage,
});

function SolutionsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Solutions"
        title="Different people, the same standard of clarity."
        body="The studio does not sell one package to everyone. These are the starting points we actually use."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 sm:px-6 md:grid-cols-2">
        {AUDIENCES.map((audience) => (
          <article key={audience.title} className="rounded-2xl border border-line bg-card p-6">
            <h2 className="text-xl font-semibold">{audience.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{audience.body}</p>
            <ul className="mt-4 space-y-2 text-sm font-semibold text-accent">
              {audience.links.map(([slug, label]) => (
                <li key={slug}>
                  <Link to="/services/$slug" params={{ slug }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </>
  );
}
