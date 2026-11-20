import { createFileRoute } from "@tanstack/react-router";
import { TestimonialsPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin/testimonials")({
  component: TestimonialsPanel,
});
