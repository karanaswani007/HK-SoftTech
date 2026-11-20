import { createFileRoute } from "@tanstack/react-router";
import { SeoPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/seo")({
  component: SeoPanel,
});
