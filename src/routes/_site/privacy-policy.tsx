import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/chrome";

export const Route = createFileRoute("/_site/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | HK SoftTech" },
      { name: "description", content: "How HK SoftTech handles enquiry and training details submitted on this website." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const shell = useRouteContext({ from: "__root__" });
  return (
    <>
      <PageIntro eyebrow="Privacy" title="Privacy Policy" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 pb-20 text-sm leading-7 sm:px-6">
        {String(shell.settings.privacy_body)
          .split(/\n\n+/)
          .map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
      </div>
    </>
  );
}
