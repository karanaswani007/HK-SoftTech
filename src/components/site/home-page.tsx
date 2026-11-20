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

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-2xl font-bold tracking-tight text-accent sm:text-3xl">{eyebrow}</h2>
      <p className="mt-2 text-base font-medium leading-relaxed text-ink sm:text-lg">{title}</p>
    </div>
  );
}

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
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-12 sm:gap-12 sm:px-6 sm:pt-16 sm:pb-16 lg:grid-cols-12 lg:pt-20 lg:pb-20">
        <div className="home-enter lg:col-span-7">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-semibold tracking-wide text-accent">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            {hero.label}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.08] font-semibold tracking-tight text-ink sm:text-6xl">{hero.title}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">{hero.body}</p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link to="/services" className={`${buttonStyles({ variant: "primary" })} home-action w-full sm:w-auto`}>
              Explore Services
            </Link>
            <Link to="/contact" className={`${buttonStyles({ variant: "secondary" })} home-action w-full sm:w-auto`}>
              Start a Project
            </Link>
          </div>
        </div>
        <div className="home-enter home-enter-delay-1 lg:col-span-5">
          <div className="blueprint rounded-3xl border border-line bg-card p-5 sm:p-7">
            <p className="text-xs font-semibold tracking-widest text-accent uppercase">Explore our services</p>
            <ol className="mt-5 space-y-3">
              {categories.map((category, index) => (
                <li key={category.slug}>
                  <Link
                    to="/services"
                    hash={category.slug}
                    className="group flex min-h-12 items-center gap-4 rounded-xl border border-line bg-paper px-4 py-3 transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-card hover:shadow-sm focus-visible:border-accent"
                  >
                    <span className="text-xs font-semibold text-accent tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-medium text-ink group-hover:text-accent">{category.name}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs font-medium tracking-wide text-muted">Innovate. Develop. Empower.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-card" aria-label="Capabilities">
        <ul className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-4 text-xs font-medium text-ink sm:gap-3 sm:px-6 sm:py-5 sm:text-sm">
          {strips.map((item) => (
            <li key={item} className="flex min-h-9 items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5">
              <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        <SectionHeading eyebrow="What we do" title="Technology solutions for every ambition." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {categories.map((category, index) => {
            const Icon = ICONS[category.icon as keyof typeof ICONS] ?? Code2;
            const featured = services.filter((service) => service.category_slug === category.slug && service.featured).slice(0, 4);
            const shown = featured.length ? featured : services.filter((service) => service.category_slug === category.slug).slice(0, 4);
            return (
              <article
                key={category.slug}
                className={`lift flex h-full flex-col rounded-2xl border border-line bg-card p-5 sm:p-6 ${index < 3 ? "xl:col-span-2" : "xl:col-span-3"}`}
              >
                <span className="grid size-10 place-items-center rounded-xl bg-soft">
                  <Icon className="size-5 text-accent" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{category.summary}</p>
                <ul className="mt-4 space-y-2 text-sm text-ink">
                  {shown.map((service) => (
                    <li key={service.slug} className="flex items-start gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent/70" aria-hidden />
                      <span>{service.name}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/services" hash={category.slug} className="group mt-auto inline-flex min-h-11 items-center gap-1 pt-5 text-sm font-semibold text-accent">
                  Explore Services <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <SectionHeading eyebrow="How we work" title="Technology built around your growth." />
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

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        <div>
          <SectionHeading eyebrow="Selected work" title="Ideas turned into real solutions." />
          <Link to="/portfolio" className="mx-auto mt-3 inline-flex min-h-11 w-fit items-center gap-1 text-sm font-semibold text-accent">
            View portfolio <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="mt-7 grid gap-4 md:mt-10 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              to="/portfolio/$slug"
              params={{ slug: project.slug }}
              className="lift group overflow-hidden rounded-2xl border border-line bg-card"
            >
              {project.image_url ? (
                <img src={project.image_url} alt={project.title} loading="lazy" decoding="async" className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" />
              ) : (
                <div className="flex aspect-video flex-col justify-between bg-navy p-5 text-on-navy">
                  <span className="text-xs font-semibold tracking-widest uppercase">{project.category}</span>
                  <span className="text-2xl font-semibold break-words">{project.title}</span>
                </div>
              )}
              <div className="p-5">
                <h3 className="font-semibold group-hover:text-accent">{project.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{project.summary}</p>
                {project.stack ? <p className="mt-3 text-xs text-muted">{project.stack}</p> : null}
                <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  View project <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <SectionHeading eyebrow="Who we serve" title="Support for every stage." />
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

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        <SectionHeading eyebrow="A clear path forward" title="From first conversation to delivery." />
        <ol className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map(([title, body], index) => (
            <li key={title} className="rounded-2xl border border-line bg-card p-5">
              <p className="grid size-9 place-items-center rounded-full bg-soft text-xs font-semibold text-accent tabular-nums">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-line bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <SectionHeading eyebrow="Client voices" title="Testimonials" />
          {testimonials.length === 0 ? (
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-6 text-muted">
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

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        <SectionHeading eyebrow="Questions" title="Frequently asked." />
        <div className="mt-6 divide-y divide-line border-y border-line sm:mt-8">
          {faqs.map((faq) => (
            <details key={faq.id} className="group py-4">
              <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-base font-medium transition-colors duration-200 hover:text-accent">
                {faq.question}
                <span className="shrink-0 text-muted group-open:hidden" aria-hidden>
                  +
                </span>
                <span className="hidden shrink-0 text-muted group-open:inline" aria-hidden>
                  –
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-navy px-6 py-10 text-center text-on-navy sm:px-12 sm:py-12">
          <h2>
            <span className="block text-2xl font-bold tracking-tight text-blue-300 sm:text-3xl">Let’s build something useful</span>
            <span className="mt-2 block text-lg font-medium tracking-tight text-on-navy sm:text-xl">{cta.title}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-on-navy/80">{cta.body}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/contact" className={`${buttonStyles({ variant: "primary" })} home-action w-full sm:w-auto`}>
              Start Your Project
            </Link>
            <Link to="/services" className={`${buttonStyles({ variant: "inverse" })} home-action w-full sm:w-auto`}>
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
