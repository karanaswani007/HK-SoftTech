import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";

export default async function CmsServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServicePageTemplate serviceSlug={slug} />;
}
