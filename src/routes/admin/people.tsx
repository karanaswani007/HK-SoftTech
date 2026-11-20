import { createFileRoute } from "@tanstack/react-router";
import { PublicTeamPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/people")({
  component: PublicTeamPanel,
});
