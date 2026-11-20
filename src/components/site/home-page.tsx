import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Code2, Compass, GraduationCap, PenLine, Sparkles } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { AUDIENCES, PROCESS, WHY } from "@/lib/hk/labels";

const ICONS = {
  code: Code2,
  spark: Sparkles,
  pen: PenLine,
  grad: GraduationCap,
  compass: Compass,
} as const;

type Category = { slug: string; name: string; summary: string; icon: string };
type Service = { slug: string; category_slug: string; name: string; summary: string; featured: boolean };
type Project = { slug: string; title: string; summary: string; category: string; stack: string; image_url: string };
type Faq = { id: number; question: string; answer: string };
type Quote = { id: number; author_name: string; author_role: string; quote: string };

export function HomePage({
  categories,
  services,
  projects,
  faqs,
  testimonials,
  hero,
  cta,
}: {
  categories: Category[];
  services: Service[];
  projects: Project[];
  faqs: Faq[];
  testimonials: Quote[];
  hero: { label: string; title: string; body: string };
  cta: { title: string; body: string };
}) {
  const strips = ["Software Development", "Web Development", "AI & Automation", "Digital Solutions", "Technology Training"];
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-12 lg:pt-20">
        <div className="lg:col-span-7">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">{hero.label}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-6xl">{hero.title}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">{hero.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/services" className={buttonStyles({ variant: "primary" })}>
              Explore Services
            </Link>
            <Link to="/contact" className={buttonStyles({ variant: "secondary" })}>
              Start a Project
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="blueprint rounded-3xl border border-line bg-card p-5 sm:p-7">
            <p className="text-xs font-semibold tracking-widest text-accent uppercase">Five divisions</p>
            <ol className="mt-5 space-y-3">
              {categories.map((category, index) => (
                <li key={category.slug}>
                  <Link
                    to="/services"
                    hash={category.slug}
                    className="flex items-center gap-4 rounded-xl border border-line bg-paper px-4 py-3 hover:border-accent"
                  >
                    <span className="text-xs font-semibold text-accent tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-medium text-ink">{category.name}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs font-semibold tracking-widest text-muted uppercase">Innovate. Develop. Empower.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-line" aria-label="Capabilities">
        <ul className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-3 px-4 py-5 text-sm font-medium text-ink sm:px-6">
          {strips.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">Technology Solutions for Every Ambition.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {categories.map((category, index) => {
            const Icon = ICONS[category.icon as keyof typeof ICONS] ?? Code2;
            const featured = services.filter((service) => service.category_slug === category.slug && service.featured).slice(0, 4);
            const shown = featured.length ? featured : services.filter((service) => service.category_slug === category.slug).slice(0, 4);
            return (
              <article
                key={category.slug}
                className={`lift flex h-full flex-col rounded-2xl border border-line bg-card p-5 ${index < 3 ? "xl:col-span-2" : "xl:col-span-3"}`}
              >
                <Icon className="size-5 text-accent" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{category.summary}</p>
                <ul className="mt-4 space-y-2 text-sm text-ink">
                  {shown.map((service) => (
                    <li key={service.slug}>{service.name}</li>
                  ))}
                </ul>
                <Link to="/services" hash={category.slug} className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-accent">
                  Explore Services <ArrowUpRight className="size-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Technology Built Around Your Growth.</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map(([title, body]) => (
              <div key={title} className="border-l-2 border-accent pl-4">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ideas Turned Into Real Solutions.</h2>
          <Link to="/portfolio" className="hidden text-sm font-semibold text-accent sm:inline">
            View portfolio
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              to="/portfolio/$slug"
              params={{ slug: project.slug }}
              className="lift overflow-hidden rounded-2xl border border-line bg-card"
            >
              {project.image_url ? (
                <img src={project.image_url} alt={project.title} loading="lazy" decoding="async" className="aspect-video w-full object-cover" />
              ) : (
                <div className="flex aspect-video flex-col justify-between bg-navy p-5 text-on-navy">
                  <span className="text-xs font-semibold tracking-widest uppercase">{project.category}</span>
                  <span className="text-2xl font-semibold break-words">{project.title}</span>
                </div>
              )}
              <div className="p-5">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{project.summary}</p>
                {project.stack ? <p className="mt-3 text-xs text-muted">{project.stack}</p> : null}
                <p className="mt-4 text-sm font-semibold text-accent">View Project</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Who We Serve</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {AUDIENCES.map((audience, index) => (
              <article key={audience.title} className={`rounded-2xl border border-line bg-card p-5 ${index < 3 ? "xl:col-span-2" : "xl:col-span-3"}`}>
                <h3 className="text-lg font-semibold">{audience.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{audience.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Our Process</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-4">
          {PROCESS.map(([title, body], index) => (
            <li key={title}>
              <p className="text-xs font-semibold text-accent tabular-nums">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-line bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight">Testimonials</h2>
          {testimonials.length === 0 ? (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Client words are published only after they are approved in the studio. None are shown until then.
            </p>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {testimonials.map((item) => (
                <blockquote key={item.id} className="rounded-2xl border border-line p-5">
                  <p className="text-sm leading-7">“{item.quote}”</p>
                  <footer className="mt-4 text-sm font-semibold">
                    {item.author_name}
                    {item.author_role ? <span className="font-normal text-muted"> · {item.author_role}</span> : null}
                  </footer>
                </blockquote>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="text-3xl font-semibold tracking-tight">FAQ</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faqs.map((faq) => (
            <details key={faq.id} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium">
                {faq.question}
                <span className="text-muted group-open:hidden" aria-hidden>
                  +
                </span>
                <span className="hidden text-muted group-open:inline" aria-hidden>
                  –
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-navy px-6 py-12 text-on-navy sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{cta.title}</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-on-navy/80">{cta.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className={buttonStyles({ variant: "primary" })}>
              Start Your Project
            </Link>
            <Link to="/contact" className={buttonStyles({ variant: "inverse" })}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
