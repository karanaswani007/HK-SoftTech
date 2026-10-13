import { cache } from "react";
import { z } from "zod";

import { faqs } from "@/data/faqs";
import { serviceCategories, servicePages } from "@/data/services";
import { siteConfig } from "@/data/site";
import { prisma } from "@/lib/db";

const cmsSocialLinkSchema = z.object({
  label: z.string().trim().min(1).max(60),
  url: z.string().trim().url().refine((value) => /^https?:\/\//i.test(value)),
});

export const cmsSettingsSchema = z.object({
  tagline: z.string().trim().min(1).max(300),
  email: z.email(),
  phone: z.string().trim().min(3).max(80),
  location: z.string().trim().min(1).max(200),
  socials: z.array(cmsSocialLinkSchema).max(20),
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
  servicesPageEyebrow: z.string().trim().min(1).max(100),
  servicesPageTitle: z.string().trim().min(1).max(200),
  servicesPageDescription: z.string().trim().min(1).max(2000),
  portfolioPageEyebrow: z.string().trim().min(1).max(100),
  portfolioPageTitle: z.string().trim().min(1).max(200),
  portfolioPageDescription: z.string().trim().min(1).max(2000),
  contactPageEyebrow: z.string().trim().min(1).max(100),
  contactPageTitle: z.string().trim().min(1).max(200),
  contactPageDescription: z.string().trim().min(1).max(2000),
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

const optionalHttpUrlSchema = z.union([
  z.literal(""),
  z.url().refine((value) => /^https?:\/\//i.test(value)),
]);
const optionalImageSchema = z.union([
  optionalHttpUrlSchema,
  z.string().regex(/^\/api\/portfolio\/images\/[a-z0-9]+$/),
]);

const cmsProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(3000),
  category: z.string().trim().min(1).max(100),
  serviceSlug: z.string().trim().min(1).max(100),
  imageUrl: optionalImageSchema,
  projectUrl: optionalHttpUrlSchema,
  featured: z.boolean(),
  published: z.boolean(),
});

export const adminContentSchema = z
  .object({
    settings: cmsSettingsSchema,
    services: z.array(cmsServiceSchema).min(1).max(30),
    projects: z.array(cmsProjectSchema).max(100),
    faqs: z
      .array(
        z.object({
          question: z.string().trim().min(1).max(300),
          answer: z.string().trim().min(1).max(3000),
        }),
      )
      .max(100),
  })
  .superRefine(({ services, projects }, context) => {
    const builtInServiceSlugs = new Set(serviceCategories.map((service) => service.slug));
    const reservedPageSlugs = new Set([
      "about",
      "admin",
      "api",
      "contact",
      "design",
      "faq",
      "portfolio",
      "privacy-policy",
      "robots",
      "services",
      "sitemap",
      "terms",
    ]);

    if (new Set(services.map((service) => service.slug)).size !== services.length) {
      context.addIssue({
        code: "custom",
        message: "Service slugs must be unique.",
        path: ["services"],
      });
    }

    services.forEach((service, index) => {
      if (reservedPageSlugs.has(service.slug) && !builtInServiceSlugs.has(service.slug)) {
        context.addIssue({
          code: "custom",
          message: "This service slug is already used by a website page.",
          path: ["services", index, "slug"],
        });
      }
    });

    const projectIds = projects.flatMap((project) => project.id ? [project.id] : []);
    if (new Set(projectIds).size !== projectIds.length) {
      context.addIssue({
        code: "custom",
        message: "Portfolio item IDs must be unique.",
        path: ["projects"],
      });
    }

    projects.forEach((project, index) => {
      if (!services.some((service) => service.slug === project.serviceSlug)) {
        context.addIssue({
          code: "custom",
          message: "Select an existing service for each portfolio item.",
          path: ["projects", index, "serviceSlug"],
        });
      }
    });
  });

export type CmsSettings = z.infer<typeof cmsSettingsSchema>;
export type CmsService = z.infer<typeof cmsServiceSchema>;
export type CmsFaq = z.infer<typeof adminContentSchema>["faqs"][number];
export type CmsProject = z.infer<typeof cmsProjectSchema>;
export type AdminContent = z.infer<typeof adminContentSchema>;

export const defaultCmsSettings: CmsSettings = {
  tagline: siteConfig.tagline,
  email: siteConfig.email,
  phone: siteConfig.phone,
  location: siteConfig.location,
  socials: [
    { label: "LinkedIn", url: siteConfig.social.linkedin },
    { label: "Instagram", url: siteConfig.social.instagram },
  ],
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
  servicesPageEyebrow: "Services",
  servicesPageTitle: "A complete digital growth ecosystem",
  servicesPageDescription:
    "HK SoftTech supports businesses, students, freelancers, startups, and organizations with practical technology services designed around real requirements.",
  portfolioPageEyebrow: "Our work",
  portfolioPageTitle: "Products and projects built to make an impact",
  portfolioPageDescription:
    "Explore selected digital products, client work, and experiments from HK SoftTech.",
  contactPageEyebrow: "Contact",
  contactPageTitle: "Tell us about your project",
  contactPageDescription:
    "Tell us what you are building, improving, or planning so we can guide the right next step.",
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
    socials: cmsSocialLinksFromContent(content),
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
    servicesPageEyebrow: content.servicesPageEyebrow,
    servicesPageTitle: content.servicesPageTitle,
    servicesPageDescription: content.servicesPageDescription,
    portfolioPageEyebrow: content.portfolioPageEyebrow,
    portfolioPageTitle: content.portfolioPageTitle,
    portfolioPageDescription: content.portfolioPageDescription,
    contactPageEyebrow: content.contactPageEyebrow,
    contactPageTitle: content.contactPageTitle,
    contactPageDescription: content.contactPageDescription,
  });
});

function cmsSocialLinksFromContent(content: {
  socialLinks: unknown;
  linkedin: string;
  instagram: string;
}) {
  const parsed = z.array(cmsSocialLinkSchema).safeParse(content.socialLinks);
  if (parsed.success) {
    return parsed.data;
  }

  return [
    content.linkedin ? { label: "LinkedIn", url: content.linkedin } : null,
    content.instagram ? { label: "Instagram", url: content.instagram } : null,
  ].filter((link): link is { label: string; url: string } => link !== null);
}

export const getCmsServices = cache(async (): Promise<CmsService[]> => {
  if (!process.env.DATABASE_URL) {
    return defaultServices;
  }

  const savedServices = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  if (savedServices.length === 0) {
    return defaultServices;
  }
  const fallbacksBySlug = new Map(defaultServices.map((service) => [service.slug, service]));

  return savedServices.map((saved) => {
    const fallback = fallbacksBySlug.get(saved.slug);
    return {
      slug: saved.slug,
      title: saved.title,
      short: saved.shortDescription ?? fallback?.short ?? "",
      description: saved.pageIntroduction ?? saved.description ?? fallback?.description ?? "",
      category: saved.category ?? fallback?.category ?? "Services",
      keyServices: saved.keyServices ? z.array(z.string()).parse(saved.keyServices) : fallback?.keyServices ?? [],
      pagePoints: saved.pagePoints ? z.array(z.string()).parse(saved.pagePoints) : fallback?.pagePoints ?? [],
      pageCta: saved.pageCta ?? fallback?.pageCta ?? "Contact us",
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

export const getPortfolioProjects = cache(async (publishedOnly = true): Promise<CmsProject[]> => {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const [projects, services] = await Promise.all([
    prisma.project.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    getCmsServices(),
  ]);
  const serviceSlugs = new Set(services.map((service) => service.slug));
  const serviceByTitle = new Map(services.map((service) => [service.title.toLowerCase(), service.slug]));
  const servicesBySlug = new Map(services.map((service) => [service.slug, service]));

  const projectsWithStoredImages = await Promise.all(projects.map(async (project) => {
    const legacyImage = project.imageUrl?.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/]+=*)$/);
    if (!legacyImage) {
      return project;
    }

    const image = await prisma.portfolioImage.create({
      data: { mimeType: legacyImage[1], data: Buffer.from(legacyImage[2], "base64") },
      select: { id: true },
    });
    const imageUrl = `/api/portfolio/images/${image.id}`;
    return prisma.project.update({ where: { id: project.id }, data: { imageUrl } });
  }));

  return projectsWithStoredImages.map((project) => {
    const serviceSlug = project.category && serviceSlugs.has(project.category)
      ? project.category
      : serviceByTitle.get(project.category?.toLowerCase() ?? "") ?? services[0]?.slug ?? "";

    return {
      id: project.id,
      title: project.title,
      description: project.description ?? "",
      category: servicesBySlug.get(serviceSlug)?.title ?? project.category ?? "Uncategorized",
      serviceSlug,
      imageUrl: project.imageUrl ?? "",
      projectUrl: project.projectUrl ?? "",
      featured: project.featured,
      published: project.published,
    };
  });
});

export async function getCmsService(slug: string): Promise<CmsService | undefined> {
  const services = await getCmsServices();
  return services.find((service) => service.slug === slug);
}

export async function getAdminContent(): Promise<AdminContent> {
  const [settings, services, projects, savedFaqs] = await Promise.all([
    getCmsSettings(),
    getCmsServices(),
    getPortfolioProjects(false),
    getCmsFaqs(),
  ]);
  return { settings, services, projects, faqs: savedFaqs };
}

export async function saveAdminContent(content: AdminContent) {
  const { socials, ...settings } = content.settings;
  const legacySocial = (label: string) =>
    socials.find((social) => social.label.toLowerCase() === label.toLowerCase())?.url ?? "";

  await prisma.$transaction(async (transaction) => {
    await transaction.siteContent.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        ...settings,
        socialLinks: socials,
        linkedin: legacySocial("LinkedIn"),
        instagram: legacySocial("Instagram"),
      },
      update: {
        ...settings,
        socialLinks: socials,
        linkedin: legacySocial("LinkedIn"),
        instagram: legacySocial("Instagram"),
      },
    });

    await transaction.service.deleteMany({
      where: { slug: { notIn: content.services.map((service) => service.slug) } },
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

    const submittedProjectIds = content.projects.flatMap((project) => project.id ? [project.id] : []);
    await transaction.project.deleteMany({
      where: submittedProjectIds.length > 0 ? { id: { notIn: submittedProjectIds } } : {},
    });

    for (const [sortOrder, project] of content.projects.entries()) {
      const { id, serviceSlug, ...projectData } = project;
      const service = content.services.find((item) => item.slug === serviceSlug);
      if (!service) {
        throw new Error(`Portfolio item "${project.title}" references an unknown service.`);
      }
      const savedProjectData = { ...projectData, category: serviceSlug, sortOrder };
      if (id) {
        await transaction.project.update({
          where: { id },
          data: savedProjectData,
        });
      } else {
        await transaction.project.create({
          data: { ...savedProjectData, type: "PROJECT" },
        });
      }
    }

    await transaction.fAQ.deleteMany();
    if (content.faqs.length > 0) {
      await transaction.fAQ.createMany({
        data: content.faqs.map((faqItem, sortOrder) => ({ ...faqItem, sortOrder })),
      });
    }
  },
    {
      maxWait: 10000,
      timeout: 20000,
    }
  );
}
