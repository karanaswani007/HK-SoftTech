import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { HomePage } from "@/components/site/home-page";
import { getHome } from "@/lib/hk/public-fns";

export const Route = createFileRoute("/_site/")({
  loader: () => getHome(),
  head: ({ loaderData }) => ({
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "HK SoftTech",
              slogan: "INNOVATE. DEVELOP. EMPOWER.",
              telephone: "+91 7378603865",
              founder: {
                "@type": "Person",
                name: "Karan R. Aswani",
                jobTitle: "Founder & CEO",
              },
            }),
          },
        ]
      : [],
  }),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const shell = useRouteContext({ from: "__root__" });
  const settings = shell.settings;
  return (
    <HomePage
      categories={data.categories as never}
      services={data.services as never}
      projects={data.projects as never}
      faqs={data.faqs as never}
      testimonials={data.testimonials as never}
      hero={{
        label: String(settings.hero_label),
        title: String(settings.hero_title),
        body: String(settings.hero_body),
      }}
      cta={{ title: String(settings.cta_title), body: String(settings.cta_body) }}
    />
  );
}
