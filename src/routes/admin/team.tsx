import { createFileRoute } from "@tanstack/react-router";
import { TeamPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/team")({
  component: TeamPanel,
});
