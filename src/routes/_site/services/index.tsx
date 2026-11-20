import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/chrome";
import { getServices } from "@/lib/hk/public-fns";

export const Route = createFileRoute("/_site/services/")({
  loader: () => getServices(),
  head: () => ({
    meta: [
      { title: "Services | HK SoftTech" },
      { name: "description", content: "Software, AI, digital presence, training and technology consulting from HK SoftTech." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { categories, services } = Route.useLoaderData();
  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Five ways to work with the studio."
        body="Every service is scoped before it starts. Choose a division, then a specific engagement."
      />
      <div className="mx-auto max-w-6xl space-y-14 px-4 pb-20 sm:px-6">
        {categories.map((category) => (
          <section key={String(category.slug)} id={String(category.slug)}>
            <h2 className="text-2xl font-semibold">{String(category.name)}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{String(category.summary)}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {services
                .filter((service) => service.category_slug === category.slug)
                .map((service) => (
                  <Link
                    key={String(service.slug)}
                    to="/services/$slug"
                    params={{ slug: String(service.slug) }}
                    className="lift rounded-2xl border border-line bg-card p-5"
                  >
                    <h3 className="font-semibold">{String(service.name)}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{String(service.summary)}</p>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
