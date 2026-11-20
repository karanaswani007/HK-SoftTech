import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getService } from "@/lib/hk/public-fns";
import { linesOf } from "@/lib/hk/row";
import { buttonStyles } from "@/components/ui/button";

export const Route = createFileRoute("/_site/services/$slug")({
  loader: ({ params }) => getService({ data: { slug: params.slug } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: String(loaderData?.service.meta_title || loaderData?.service.name || "Service") },
      { name: "description", content: String(loaderData?.service.meta_description || loaderData?.service.summary || "") },
    ],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: loaderData.service.name,
              description: loaderData.service.summary,
              provider: { "@type": "Organization", name: "HK SoftTech" },
            }),
          },
        ]
      : [],
  }),
  component: ServicePage,
});

function ServicePage() {
  const data = Route.useLoaderData();
  if (!data) throw notFound();
  const service = data.service;
  const includes = linesOf(String(service.includes ?? ""));
  return (
    <article className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link to="/services">Services</Link>
        <span> / {String(service.category_name)}</span>
      </nav>
      <p className="mt-6 text-xs font-semibold tracking-widest text-accent uppercase">{String(service.category_name)}</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight">{String(service.name)}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{String(service.summary)}</p>
      <p className="mt-6 max-w-2xl text-sm leading-7">{String(service.body)}</p>
      {includes.length ? (
        <ul className="mt-8 max-w-xl space-y-2 text-sm">
          {includes.map((item) => (
            <li key={item} className="border-l-2 border-accent pl-3">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      <Link
        to="/contact"
        search={{ category: String(service.category_slug) }}
        className={`${buttonStyles({ variant: "primary" })} mt-8`}
      >
        Start a project
      </Link>
      {data.related.length ? (
        <section className="mt-14">
          <h2 className="text-xl font-semibold">Related services</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {data.related.map((item) => (
              <Link key={String(item.slug)} to="/services/$slug" params={{ slug: String(item.slug) }} className="rounded-2xl border border-line p-4">
                <h3 className="font-semibold">{String(item.name)}</h3>
                <p className="mt-1 text-sm text-muted">{String(item.summary)}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
