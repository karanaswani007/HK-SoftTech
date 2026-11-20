import { createFileRoute } from "@tanstack/react-router";
import { ActivityPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/activity")({
  component: ActivityPanel,
});
