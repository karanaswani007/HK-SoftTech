import { createFileRoute } from "@tanstack/react-router";
import { ContentPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/content")({
  component: ContentPanel,
});
