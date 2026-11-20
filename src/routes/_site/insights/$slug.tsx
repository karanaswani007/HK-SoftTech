import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPost } from "@/lib/hk/public-fns";

export const Route = createFileRoute("/_site/insights/$slug")({
  loader: ({ params }) => getPost({ data: { slug: params.slug } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: String(loaderData?.meta_title || loaderData?.title || "Insight") },
      { name: "description", content: String(loaderData?.meta_description || loaderData?.excerpt || "") },
    ],
  }),
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData();
  if (!post) throw notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link to="/insights" className="text-sm text-muted">
        Insights
      </Link>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">{String(post.title)}</h1>
      <p className="mt-4 text-base leading-7 text-muted">{String(post.excerpt)}</p>
      {post.cover_url ? <img src={String(post.cover_url)} alt="" loading="lazy" decoding="async" className="mt-8 w-full rounded-2xl" /> : null}
      <div className="mt-8 space-y-4 text-sm leading-7">
        {String(post.body)
          .split(/\n\n+/)
          .map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
      </div>
    </article>
  );
}
