import { createFileRoute } from "@tanstack/react-router";
import { SettingsPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPanel,
});
