import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useServerFn } from "@tanstack/react-start";
import { PageIntro } from "@/components/site/chrome";
import { Button } from "@/components/ui/button";
import { getTraining, submitTraining } from "@/lib/hk/public-fns";
import { errText } from "@/lib/hk/row";

export const Route = createFileRoute("/_site/training")({
  loader: () => getTraining(),
  head: () => ({
    meta: [
      { title: "Training | HK SoftTech" },
      { name: "description", content: "Workshops and career sessions from HK SoftTech for students, colleges and companies." },
    ],
  }),
  component: TrainingPage,
});

function TrainingPage() {
  const programs = Route.useLoaderData();
  const shell = useRouteContext({ from: "__root__" });
  const submit = useServerFn(submitTraining);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const form = useForm({
    defaultValues: {
      program_slug: String(programs[0]?.slug ?? ""),
      name: "",
      email: "",
      phone: "",
      note: "",
      company_website: "",
    },
  });
  return (
    <>
      <PageIntro eyebrow="Training" title="Sessions built around a real exercise." body="Agendas are agreed before the day. Dates are set with the group, not invented here." />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-2">
        <div className="space-y-3">
          {programs.map((program) => (
            <article key={String(program.slug)} className="rounded-2xl border border-line bg-card p-5">
              <h2 className="font-semibold">{String(program.title)}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{String(program.summary)}</p>
              <p className="mt-3 text-xs text-muted">
                {String(program.audience)} · {String(program.schedule)}
              </p>
            </article>
          ))}
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          {done ? (
            <p className="text-sm leading-6">Your registration is saved. The studio will reply on the phone or email you gave. Nothing is confirmed until you hear back.</p>
          ) : (
            <form
              className="grid gap-3"
              onSubmit={form.handleSubmit(async (values) => {
                setError("");
                try {
                  const result = await submit({ data: values });
                  if (!result.suppressed) setDone(true);
                  else setDone(true);
                } catch (reason) {
                  setError(errText(reason));
                }
              })}
            >
              <h2 className="text-lg font-semibold">Ask about a session</h2>
              <select className="rounded-xl border border-line bg-paper px-3 py-3 text-sm" {...form.register("program_slug")}>
                {programs.map((program) => (
                  <option key={String(program.slug)} value={String(program.slug)}>
                    {String(program.title)}
                  </option>
                ))}
              </select>
              <input className="rounded-xl border border-line px-3 py-3 text-sm" placeholder="Full name" {...form.register("name")} />
              <input className="rounded-xl border border-line px-3 py-3 text-sm" placeholder="Email" type="email" {...form.register("email")} />
              <input className="rounded-xl border border-line px-3 py-3 text-sm" placeholder="Phone" {...form.register("phone")} />
              <textarea className="min-h-24 rounded-xl border border-line px-3 py-3 text-sm" placeholder="Who is the session for?" {...form.register("note")} />
              <label className="absolute -left-[9999px]" aria-hidden>
                Website
                <input tabIndex={-1} {...form.register("company_website")} />
              </label>
              {error ? <p className="text-sm text-accent">{error}</p> : null}
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Sending…" : "Send registration"}
              </Button>
              {shell.settings.whatsapp ? (
                <a className="text-sm font-semibold text-accent" href={`https://wa.me/${shell.settings.whatsapp}`}>
                  Or message on WhatsApp
                </a>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </>
  );
}
