import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/portfolio")({
  component: PortfolioPanel,
});
