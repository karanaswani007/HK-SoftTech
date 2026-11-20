import { createFileRoute } from "@tanstack/react-router";
import { DashboardPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/")({
  component: DashboardPanel,
});
