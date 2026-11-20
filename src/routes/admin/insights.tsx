import { createFileRoute } from "@tanstack/react-router";
import { InsightsPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/insights")({
  component: InsightsPanel,
});
