import { createFileRoute } from "@tanstack/react-router";
import { EnquiriesPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/enquiries")({
  component: EnquiriesPanel,
});
