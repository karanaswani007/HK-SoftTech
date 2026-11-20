import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/chrome";
import { getPosts } from "@/lib/hk/public-fns";

export const Route = createFileRoute("/_site/insights/")({
  loader: () => getPosts(),
  head: () => ({
    meta: [
      { title: "Insights | HK SoftTech" },
      { name: "description", content: "Notes from HK SoftTech on how projects are scoped and delivered." },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const posts = Route.useLoaderData();
  return (
    <>
      <PageIntro eyebrow="Insights" title="Notes from the studio." body="Articles are published from the studio. Drafts stay private." />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 sm:px-6">
        {posts.length === 0 ? (
          <p className="text-sm text-muted">No articles are published yet.</p>
        ) : (
          posts.map((post) => (
            <Link key={String(post.slug)} to="/insights/$slug" params={{ slug: String(post.slug) }} className="rounded-2xl border border-line bg-card p-5">
              <p className="text-xs font-semibold tracking-widest text-accent uppercase">{String(post.category)}</p>
              <h2 className="mt-2 text-xl font-semibold">{String(post.title)}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{String(post.excerpt)}</p>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
