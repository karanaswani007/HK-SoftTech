import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { PageIntro } from "@/components/site/chrome";

export const Route = createFileRoute("/_site/contact")({
  validateSearch: (search: Record<string, unknown>): { category?: string } => {
    const category = typeof search.category === "string" ? search.category : "";
    return category ? { category } : {};
  },
  head: () => ({
    meta: [
      { title: "Contact | HK SoftTech" },
      { name: "description", content: "Start a project with HK SoftTech. Enquiries are saved and answered on the contact method you choose." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { category = "" } = Route.useSearch();
  const shell = useRouteContext({ from: "__root__" });
  const settings = shell.settings;
  return (
    <>
      <PageIntro eyebrow="Contact" title="Tell us what you want to create." body="The form creates a reference number the studio can follow. It is not a contract." />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_280px]">
        <EnquiryForm
          categories={shell.categories.map((item) => ({ slug: String(item.slug), name: String(item.name) }))}
          initialCategory={category}
          whatsapp={String(settings.whatsapp ?? "")}
        />
        <aside className="h-fit rounded-2xl border border-line bg-card p-5 text-sm">
          <p className="font-semibold">Talk to the studio</p>
          <a className="mt-3 block" href={`tel:${String(settings.phone).replace(/\s/g, "")}`}>
            {String(settings.phone)}
          </a>
          {settings.whatsapp ? (
            <a className="mt-2 block font-semibold text-accent" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          ) : null}
          {settings.email ? <p className="mt-2">{String(settings.email)}</p> : <p className="mt-3 text-muted">A public email address has not been published yet.</p>}
          {settings.hours ? <p className="mt-3 text-muted">{String(settings.hours)}</p> : null}
        </aside>
      </div>
    </>
  );
}
