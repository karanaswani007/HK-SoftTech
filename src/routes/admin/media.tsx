import { createFileRoute } from "@tanstack/react-router";
import { MediaPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/media")({
  component: MediaPanel,
});
