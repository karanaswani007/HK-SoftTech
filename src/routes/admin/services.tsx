import { createFileRoute } from "@tanstack/react-router";
import { ServicesPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/services")({
  component: ServicesPanel,
});
