import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/chrome";
import { ADJACENT } from "@/lib/hk/labels";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "About HK SoftTech" },
      {
        name: "description",
        content: "HK SoftTech is a technology studio led by Karan R. Aswani, working across software, AI, training and consulting.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const shell = useRouteContext({ from: "__root__" });
  const settings = shell.settings;
  return (
    <>
      <PageIntro eyebrow="About" title="A studio for practical digital work." body={String(settings.about_intro)} />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 sm:px-6 md:grid-cols-2">
        <article className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-lg font-semibold">Mission</h2>
          <p className="mt-2 text-sm leading-7 text-muted">{String(settings.mission)}</p>
        </article>
        <article className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-lg font-semibold">Vision</h2>
          <p className="mt-2 text-sm leading-7 text-muted">{String(settings.vision)}</p>
        </article>
        <article className="rounded-2xl border border-line bg-card p-6 md:col-span-2">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">Founder</p>
          <h2 className="mt-2 text-2xl font-semibold">{String(settings.founder_name)}</h2>
          <p className="text-sm text-muted">{String(settings.founder_role)}</p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{String(settings.founder_bio)}</p>
        </article>
      </div>
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold">How the work is approached</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Discover the goal, agree a scope, build against that scope, then hand it over with support only if you want it.
            The studio does not publish a headcount, founding year or awards on this page.
          </p>
          <h2 className="mt-12 text-2xl font-semibold">Adjacent capabilities</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {ADJACENT.map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-line p-5">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
