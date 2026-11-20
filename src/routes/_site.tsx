import { createFileRoute, Outlet, useRouteContext } from "@tanstack/react-router";
import { Footer, Header } from "@/components/site/chrome";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  const shell = useRouteContext({ from: "__root__" });
  return (
    <div className="flex min-h-screen flex-col">
      <Header shell={shell} />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer shell={shell} />
    </div>
  );
}
