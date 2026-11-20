import { createFileRoute } from "@tanstack/react-router";
import { DeliveryPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/projects")({
  component: DeliveryPanel,
});
