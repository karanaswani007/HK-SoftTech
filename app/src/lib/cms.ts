import { cache } from "react";
import { z } from "zod";

import { faqs } from "@/data/faqs";
import { serviceCategories, servicePages } from "@/data/services";
import { siteConfig } from "@/data/site";
import { prisma } from "@/lib/db";

export const cmsSettingsSchema = z.object({
  tagline: z.string().trim().min(1).max(300),
  email: z.email(),
  phone: z.string().trim().min(3).max(80),
  location: z.string().trim().min(1).max(200),
  linkedin: z.string().trim().refine((value) => !value || /^https?:\/\//i.test(value)),
  instagram: z.string().trim().refine((value) => !value || /^https?:\/\//i.test(value)),
  heroBadge: z.string().trim().min(1).max(160),
  heroTitlePrefix: z.string().trim().min(1).max(120),
  heroTitleHighlight: z.string().trim().min(1).max(120),
  heroTitleSuffix: z.string().trim().max(120),
  heroDescription: z.string().trim().min(1).max(2000),
  heroPrimaryCta: z.string().trim().min(1).max(100),
  heroSecondaryCta: z.string().trim().min(1).max(100),
  companyHeading: z.string().trim().min(1).max(200),
  companyDescription: z.string().trim().min(1).max(2000),
  servicesEyebrow: z.string().trim().min(1).max(100),
  servicesTitle: z.string().trim().min(1).max(200),
  servicesDescription: z.string().trim().min(1).max(2000),
  faqEyebrow: z.string().trim().min(1).max(100),
  faqTitle: z.string().trim().min(1).max(200),
  faqDescription: z.string().trim().min(1).max(2000),
  ctaEyebrow: z.string().trim().min(1).max(100),
  ctaTitle: z.string().trim().min(1).max(200),
  ctaPrimaryLabel: z.string().trim().min(1).max(100),
  ctaSecondaryLabel: z.string().trim().min(1).max(100),
});

const cmsServiceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(160),
  short: z.string().trim().min(1).max(500),
  description: z.string().trim().min(1).max(2000),
  category: z.string().trim().min(1).max(100),
  keyServices: z.array(z.string().trim().min(1).max(160)).max(30),
  pagePoints: z.array(z.string().trim().min(1).max(160)).max(40),
  pageCta: z.string().trim().min(1).max(120),
});

export const adminContentSchema = z
  .object({
    settings: cmsSettingsSchema,
    services: z.array(cmsServiceSchema).min(1).max(30),
    faqs: z
      .array(
        z.object({
          question: z.string().trim().min(1).max(300),
          answer: z.string().trim().min(1).max(3000),
        }),
      )
      .max(100),
  })
  .superRefine(({ services }, context) => {
    if (new Set(services.map((service) => service.slug)).size !== services.length) {
      context.addIssue({
        code: "custom",
        message: "Service slugs must be unique.",
        path: ["services"],
      });
    }
  });

export type CmsSettings = z.infer<typeof cmsSettingsSchema>;
export type CmsService = z.infer<typeof cmsServiceSchema>;
export type CmsFaq = z.infer<typeof adminContentSchema>["faqs"][number];
export type AdminContent = z.infer<typeof adminContentSchema>;

export const defaultCmsSettings: CmsSettings = {
  tagline: siteConfig.tagline,
  email: siteConfig.email,
  phone: siteConfig.phone,
  location: siteConfig.location,
  linkedin: siteConfig.social.linkedin,
  instagram: siteConfig.social.instagram,
  heroBadge: "Technology partner for growth",
  heroTitlePrefix: "Build Smarter.",
  heroTitleHighlight: "Grow Faster.",
  heroTitleSuffix: "Go Digital.",
  heroDescription:
    "HK SoftTech helps businesses, startups, students and professionals build modern digital experiences through web development, AI solutions, custom software, training and technology consulting.",
  heroPrimaryCta: "Start a Project",
  heroSecondaryCta: "Explore Services",
  companyHeading: "Technology built for practical growth.",
  companyDescription:
    "HK SoftTech brings together web development, AI systems, custom software, digital presence support, training and consulting for businesses, startups, students and professionals who need reliable digital progress.",
  servicesEyebrow: "Core services",
  servicesTitle: "Technology solutions built for real business needs",
  servicesDescription:
    "From websites and AI systems to software, training, and consulting, HK SoftTech helps teams move from idea to execution with practical digital support.",
  faqEyebrow: "FAQ",
  faqTitle: "Common questions from clients and learners",
  faqDescription:
    "Clear answers for businesses, professionals, startups and students exploring HK SoftTech services.",
  ctaEyebrow: "Ready to start?",
  ctaTitle: "Let's build your next digital milestone.",
  ctaPrimaryLabel: "Contact HK SoftTech",
  ctaSecondaryLabel: "Explore Services",
};

export const defaultServices: CmsService[] = serviceCategories.map((service) => {
  const detailSlug = service.slug === "design-services" ? "design" : service.slug;
  const page = servicePages[detailSlug as keyof typeof servicePages];

  return {
    slug: service.slug,
    title: service.title,
    short: service.short,
    description: page.intro,
    category: service.category,
    keyServices: service.keyServices,
    pagePoints: page.points,
    pageCta: page.cta,
  };
});

export const getCmsSettings = cache(async (): Promise<CmsSettings> => {
  if (!process.env.DATABASE_URL) {
    return defaultCmsSettings;
  }

  const content = await prisma.siteContent.findUnique({ where: { id: "default" } });
  if (!content) {
    return defaultCmsSettings;
  }

  return cmsSettingsSchema.parse({
    tagline: content.tagline,
    email: content.email,
    phone: content.phone,
    location: content.location,
    linkedin: content.linkedin,
    instagram: content.instagram,
    heroBadge: content.heroBadge,
    heroTitlePrefix: content.heroTitlePrefix,
    heroTitleHighlight: content.heroTitleHighlight,
    heroTitleSuffix: content.heroTitleSuffix,
    heroDescription: content.heroDescription,
    heroPrimaryCta: content.heroPrimaryCta,
    heroSecondaryCta: content.heroSecondaryCta,
    companyHeading: content.companyHeading,
    companyDescription: content.companyDescription,
    servicesEyebrow: content.servicesEyebrow,
    servicesTitle: content.servicesTitle,
    servicesDescription: content.servicesDescription,
    faqEyebrow: content.faqEyebrow,
    faqTitle: content.faqTitle,
    faqDescription: content.faqDescription,
    ctaEyebrow: content.ctaEyebrow,
    ctaTitle: content.ctaTitle,
    ctaPrimaryLabel: content.ctaPrimaryLabel,
    ctaSecondaryLabel: content.ctaSecondaryLabel,
  });
});

export const getCmsServices = cache(async (): Promise<CmsService[]> => {
  if (!process.env.DATABASE_URL) {
    return defaultServices;
  }

  const savedServices = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  const savedBySlug = new Map(savedServices.map((service) => [service.slug, service]));

  return defaultServices.map((fallback) => {
    const saved = savedBySlug.get(fallback.slug);
    if (!saved) {
      return fallback;
    }

    return {
      slug: saved.slug,
      title: saved.title,
      short: saved.shortDescription ?? fallback.short,
      description: saved.pageIntroduction ?? saved.description ?? fallback.description,
      category: saved.category ?? fallback.category,
      keyServices: saved.keyServices ? z.array(z.string()).parse(saved.keyServices) : fallback.keyServices,
      pagePoints: saved.pagePoints ? z.array(z.string()).parse(saved.pagePoints) : fallback.pagePoints,
      pageCta: saved.pageCta ?? fallback.pageCta,
    };
  });
});

export const getCmsFaqs = cache(async (): Promise<CmsFaq[]> => {
  if (!process.env.DATABASE_URL) {
    return faqs;
  }

  const savedFaqs = await prisma.fAQ.findMany({ orderBy: { sortOrder: "asc" } });
  if (savedFaqs.length > 0) {
    return savedFaqs.map(({ question, answer }) => ({ question, answer }));
  }

  const contentExists = await prisma.siteContent.findUnique({
    where: { id: "default" },
    select: { id: true },
  });
  return contentExists ? [] : faqs;
});

export async function getCmsService(slug: string): Promise<CmsService | undefined> {
  const services = await getCmsServices();
  return services.find((service) => service.slug === slug);
}

export async function getAdminContent(): Promise<AdminContent> {
  const [settings, services, savedFaqs] = await Promise.all([getCmsSettings(), getCmsServices(), getCmsFaqs()]);
  return { settings, services, faqs: savedFaqs };
}

export async function saveAdminContent(content: AdminContent) {
  await prisma.$transaction(async (transaction) => {
    await transaction.siteContent.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        tagline: content.settings.tagline,
        email: content.settings.email,
        phone: content.settings.phone,
        location: content.settings.location,
        linkedin: content.settings.linkedin,
        instagram: content.settings.instagram,
        heroBadge: content.settings.heroBadge,
        heroTitlePrefix: content.settings.heroTitlePrefix,
        heroTitleHighlight: content.settings.heroTitleHighlight,
        heroTitleSuffix: content.settings.heroTitleSuffix,
        heroDescription: content.settings.heroDescription,
        heroPrimaryCta: content.settings.heroPrimaryCta,
        heroSecondaryCta: content.settings.heroSecondaryCta,
        companyHeading: content.settings.companyHeading,
        companyDescription: content.settings.companyDescription,
        servicesEyebrow: content.settings.servicesEyebrow,
        servicesTitle: content.settings.servicesTitle,
        servicesDescription: content.settings.servicesDescription,
        faqEyebrow: content.settings.faqEyebrow,
        faqTitle: content.settings.faqTitle,
        faqDescription: content.settings.faqDescription,
        ctaEyebrow: content.settings.ctaEyebrow,
        ctaTitle: content.settings.ctaTitle,
        ctaPrimaryLabel: content.settings.ctaPrimaryLabel,
        ctaSecondaryLabel: content.settings.ctaSecondaryLabel,
      },
      update: {
        tagline: content.settings.tagline,
        email: content.settings.email,
        phone: content.settings.phone,
        location: content.settings.location,
        linkedin: content.settings.linkedin,
        instagram: content.settings.instagram,
        heroBadge: content.settings.heroBadge,
        heroTitlePrefix: content.settings.heroTitlePrefix,
        heroTitleHighlight: content.settings.heroTitleHighlight,
        heroTitleSuffix: content.settings.heroTitleSuffix,
        heroDescription: content.settings.heroDescription,
        heroPrimaryCta: content.settings.heroPrimaryCta,
        heroSecondaryCta: content.settings.heroSecondaryCta,
        companyHeading: content.settings.companyHeading,
        companyDescription: content.settings.companyDescription,
        servicesEyebrow: content.settings.servicesEyebrow,
        servicesTitle: content.settings.servicesTitle,
        servicesDescription: content.settings.servicesDescription,
        faqEyebrow: content.settings.faqEyebrow,
        faqTitle: content.settings.faqTitle,
        faqDescription: content.settings.faqDescription,
        ctaEyebrow: content.settings.ctaEyebrow,
        ctaTitle: content.settings.ctaTitle,
        ctaPrimaryLabel: content.settings.ctaPrimaryLabel,
        ctaSecondaryLabel: content.settings.ctaSecondaryLabel,
      },
    });

    for (const [sortOrder, service] of content.services.entries()) {
      await transaction.service.upsert({
        where: { slug: service.slug },
        create: {
          slug: service.slug,
          title: service.title,
          shortDescription: service.short,
          description: service.description,
          category: service.category,
          keyServices: service.keyServices,
          pageIntroduction: service.description,
          pagePoints: service.pagePoints,
          pageCta: service.pageCta,
          sortOrder,
        },
        update: {
          title: service.title,
          shortDescription: service.short,
          description: service.description,
          category: service.category,
          keyServices: service.keyServices,
          pageIntroduction: service.description,
          pagePoints: service.pagePoints,
          pageCta: service.pageCta,
          sortOrder,
        },
      });
    }

    await transaction.fAQ.deleteMany();
    if (content.faqs.length > 0) {
      await transaction.fAQ.createMany({
        data: content.faqs.map((faqItem, sortOrder) => ({ ...faqItem, sortOrder })),
      });
    }
  });
}
