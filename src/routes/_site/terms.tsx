import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/chrome";

export const Route = createFileRoute("/_site/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | HK SoftTech" },
      { name: "description", content: "Terms for using the HK SoftTech website and sending a project enquiry." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const shell = useRouteContext({ from: "__root__" });
  return (
    <>
      <PageIntro eyebrow="Terms" title="Terms & Conditions" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 pb-20 text-sm leading-7 sm:px-6">
        {String(shell.settings.terms_body)
          .split(/\n\n+/)
          .map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
      </div>
    </>
  );
}
