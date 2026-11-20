import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { Eye, Target } from "lucide-react";
import { PageIntro } from "@/components/site/chrome";
import { ADJACENT } from "@/lib/hk/labels";
import { getPublicFounder, getPublicTeam } from "@/lib/hk/public-fns";
import { isPublicHttpUrl, isPublicImageSource } from "@/lib/hk/public-profile";

export const Route = createFileRoute("/_site/about")({
  loader: async () => {
    const [founder, team] = await Promise.all([getPublicFounder(), getPublicTeam()]);
    return { founder, team };
  },
  head: () => ({
    meta: [
      { title: "About HK SoftTech" },
      {
        name: "description",
        content: "Meet the founder and team behind HK SoftTech’s software, AI, training and consulting work.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const shell = useRouteContext({ from: "__root__" });
  const { founder, team } = Route.useLoaderData();
  const settings = shell.settings;
  const photo = isPublicImageSource(founder.image_url) ? founder.image_url : "";
  const initials = founder.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const profileLinks = [
    ["Website", founder.website_url],
    ["LinkedIn", founder.linkedin_url],
    ["Instagram", founder.instagram_url],
    ["GitHub", founder.github_url],
    ["X", founder.x_url],
  ]
    .map(([label, value]) => ({
      label,
      href: isPublicHttpUrl(value) ? new URL(value).href : "",
    }))
    .filter((link) => link.href);

  return (
    <>
      <PageIntro eyebrow="About" title="A studio for practical digital work." body={String(settings.about_intro)} />
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-14 sm:px-6 md:grid-cols-2">
        <article className="about-value-card lift home-enter rounded-3xl border border-line p-6 sm:p-8">
          <span className="about-value-icon mx-auto grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent">
            <Target className="size-6" aria-hidden />
          </span>
          <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-accent">Mission</h2>
          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-7 text-ink/75">{String(settings.mission)}</p>
        </article>
        <article className="about-value-card lift home-enter home-enter-delay-1 rounded-3xl border border-line p-6 sm:p-8">
          <span className="about-value-icon mx-auto grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent">
            <Eye className="size-6" aria-hidden />
          </span>
          <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-accent">Vision</h2>
          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-7 text-ink/75">{String(settings.vision)}</p>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <article className="grid overflow-hidden rounded-3xl border border-line bg-card md:grid-cols-[minmax(15rem,0.8fr)_minmax(0,1.2fr)]">
          <div className="blueprint grid min-h-72 place-items-center bg-soft md:min-h-full">
            {photo ? (
              <img src={photo} alt={founder.name} className="h-full max-h-[34rem] min-h-72 w-full object-cover" />
            ) : (
              <div role="img" aria-label={`${founder.name} initials`} className="grid size-40 place-items-center rounded-full border border-line bg-card text-5xl font-bold tracking-tight text-accent shadow-sm">
                {initials}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center p-6 text-center sm:p-9">
            <p className="text-xs font-semibold tracking-widest text-accent uppercase">Founder</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-accent sm:text-3xl">{founder.name}</h2>
            <p className="mt-1 text-sm font-medium text-ink">{founder.role}</p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted">{founder.bio}</p>
            {profileLinks.length ? (
              <nav className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Founder profiles">
                {profileLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center gap-1 rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            ) : null}
          </div>
        </article>
      </section>

      <section className="border-y border-line bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-accent sm:text-3xl">Our people</h2>
            <p className="mt-2 text-lg font-semibold tracking-tight text-ink">A team built around the work.</p>
            <p className="mt-4 text-sm leading-7 text-muted">
              HK SoftTech brings together practical strengths across software and web development, AI and automation,
              digital presence, technology training, and consulting.
            </p>
          </div>
          {team.length ? (
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((person) => {
                const personPhoto = isPublicImageSource(person.image_url) ? person.image_url : "";
                const personInitials = person.name
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase() ?? "")
                  .join("");
                const personLinks = [
                  ["Website", person.website_url],
                  ["LinkedIn", person.linkedin_url],
                  ["Instagram", person.instagram_url],
                  ["GitHub", person.github_url],
                  ["X", person.x_url],
                ]
                  .map(([label, value]) => ({
                    label,
                    href: isPublicHttpUrl(value) ? new URL(value).href : "",
                  }))
                  .filter((link) => link.href);
                return (
                  <article key={person.id} className="lift overflow-hidden rounded-2xl border border-line bg-paper">
                    {personPhoto ? (
                      <img src={personPhoto} alt={person.name} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                    ) : (
                      <div className="blueprint grid aspect-[4/3] place-items-center bg-soft text-4xl font-bold text-accent" aria-hidden>
                        {personInitials}
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-accent">{person.name}</h3>
                      <p className="mt-1 text-sm font-medium text-ink">{person.role}</p>
                      {person.bio ? <p className="mt-3 text-sm leading-6 text-muted">{person.bio}</p> : null}
                      {personLinks.length ? (
                        <nav className="mt-4 flex flex-wrap gap-2" aria-label={`${person.name} profiles`}>
                          {personLinks.map((link) => (
                            <a
                              key={link.label}
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex min-h-9 items-center rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent hover:text-accent"
                            >
                              {link.label}
                            </a>
                          ))}
                        </nav>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18">
        <h2 className="text-center text-2xl font-bold tracking-tight text-accent sm:text-3xl">Our approach</h2>
        <p className="mt-2 text-center text-lg font-semibold tracking-tight text-ink">How the work is approached.</p>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-7 text-muted">
          Start by discovering the goal, agree a clear scope, build against that scope, then hand it over with support
          if you want it.
        </p>
        <h2 className="mt-12 text-center text-2xl font-bold text-accent sm:text-3xl">Capabilities</h2>
        <p className="mt-2 text-center text-lg font-semibold text-ink">Adjacent capabilities</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {ADJACENT.map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-line bg-card p-5">
              <h3 className="font-semibold text-accent">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
