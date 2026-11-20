import { createFileRoute } from "@tanstack/react-router";
import { TrainingPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/training")({
  component: TrainingPanel,
});
