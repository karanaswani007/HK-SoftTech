import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { BUDGETS, CONTACT_METHODS, CUSTOMER_TYPES, TIMELINES } from "@/lib/hk/labels";
import { clean, plain, plains } from "@/lib/hk/row";

async function db() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email").max(160),
  phone: z.string().trim().min(7, "Enter a phone number").max(24),
  organization: z.string().trim().max(160).optional().default(""),
  customer_type: z.enum(CUSTOMER_TYPES),
  service_category: z.string().trim().min(2).max(80),
  budget: z.string().trim().max(80).optional().default(""),
  timeline: z.enum(TIMELINES),
  description: z.string().trim().min(20, "Describe the work in at least a few sentences").max(4000),
  contact_method: z.enum(CONTACT_METHODS),
  company_website: z.string().max(200).optional().default(""),
});

const trainingSchema = z.object({
  program_slug: z.string().trim().min(2).max(80),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email").max(160),
  phone: z.string().trim().min(7).max(24),
  note: z.string().trim().max(2000).optional().default(""),
  company_website: z.string().max(200).optional().default(""),
});

export const getShell = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await db();
  const settingsRows = await sql<Record<string, unknown>>`
    select company_name, tagline, phone, whatsapp, email, address, hours,
           hero_label, hero_title, hero_body, about_intro, mission, vision,
           founder_name, founder_role, founder_bio, cta_title, cta_body, footer_blurb,
           linkedin_url, instagram_url, github_url, meta_title, meta_description,
           canonical_base, robots_index, privacy_body, terms_body
    from site_settings where id = 1
  `;
  const settings: Record<string, string | boolean> = {};
  for (const [key, value] of Object.entries(plain(settingsRows[0] ?? {}))) {
    if (typeof value === "boolean") settings[key] = value;
    else settings[key] = value == null ? "" : String(value);
  }
  if (!settingsRows[0]) throw new Error("Site settings are not ready.");
  const categories = plains(
    await sql<Record<string, unknown>>`
      select slug, name, summary, icon, sort_order from service_categories order by sort_order
    `,
  );
  const services = plains(
    await sql<Record<string, unknown>>`
      select slug, category_slug, name from services where published = true order by sort_order, name
    `,
  );
  return {
    settings,
    categories: categories.map((category) => ({
      slug: String(category.slug ?? ""),
      name: String(category.name ?? ""),
      summary: String(category.summary ?? ""),
      icon: String(category.icon ?? ""),
      services: services
        .filter((service) => service.category_slug === category.slug)
        .slice(0, 6)
        .map((service) => ({
          slug: String(service.slug ?? ""),
          name: String(service.name ?? ""),
          category_slug: String(service.category_slug ?? ""),
        })),
    })),
  };
});

export const getHome = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await db();
  const categories = plains(
    await sql<Record<string, unknown>>`
      select slug, name, summary, icon from service_categories order by sort_order
    `,
  );
  const services = plains(
    await sql<Record<string, unknown>>`
      select slug, category_slug, name, summary, featured
      from services where published = true order by sort_order, name
    `,
  );
  const projects = plains(
    await sql<Record<string, unknown>>`
      select slug, title, summary, category, stack, image_url
      from projects where published = true and featured = true order by sort_order
    `,
  );
  const faqs = plains(
    await sql<Record<string, unknown>>`
      select id, question, answer from faqs where published = true order by sort_order
    `,
  );
  const testimonials = plains(
    await sql<Record<string, unknown>>`
      select id, author_name, author_role, quote
      from testimonials where published = true and approved = true
      order by featured desc, id desc
    `,
  );
  return { categories, services, projects, faqs, testimonials };
});

export const getServices = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await db();
  const categories = plains(
    await sql<Record<string, unknown>>`select slug, name, summary, icon from service_categories order by sort_order`,
  );
  const services = plains(
    await sql<Record<string, unknown>>`
      select slug, category_slug, name, summary, featured
      from services where published = true order by sort_order, name
    `,
  );
  return { categories, services };
});

export const getService = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => {
    if (!input?.slug || !/^[a-z0-9-]+$/.test(input.slug)) throw new Error("Unknown service");
    return input;
  })
  .handler(async ({ data }) => {
    const sql = await db();
    const rows = plains(
      await sql<Record<string, unknown>>`
        select s.slug, s.name, s.summary, s.body, s.includes, s.meta_title, s.meta_description, s.image_url,
               c.slug as category_slug, c.name as category_name, c.summary as category_summary
        from services s
        join service_categories c on c.slug = s.category_slug
        where s.slug = ${data.slug} and s.published = true
      `,
    );
    const service = rows[0];
    if (!service) return null;
    const related = plains(
      await sql<Record<string, unknown>>`
        select slug, name, summary from services
        where published = true and category_slug = ${service.category_slug} and slug <> ${data.slug}
        order by sort_order limit 4
      `,
    );
    return { service, related };
  });

export const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await db();
  return plains(
    await sql<Record<string, unknown>>`
      select slug, title, summary, category, stack, image_url, project_url
      from projects where published = true order by sort_order, title
    `,
  );
});

export const getProject = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => {
    if (!input?.slug || !/^[a-z0-9-]+$/.test(input.slug)) throw new Error("Unknown project");
    return input;
  })
  .handler(async ({ data }) => {
    const sql = await db();
    const rows = plains(
      await sql<Record<string, unknown>>`
        select slug, title, summary, body, category, stack, project_url, github_url, image_url,
               meta_title, meta_description
        from projects where slug = ${data.slug} and published = true
      `,
    );
    return rows[0] ?? null;
  });

export const getTraining = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await db();
  return plains(
    await sql<Record<string, unknown>>`
      select slug, title, summary, audience, schedule
      from training_programs where published = true order by sort_order, title
    `,
  );
});

export const getPosts = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await db();
  return plains(
    await sql<Record<string, unknown>>`
      select slug, title, excerpt, category, tags, published_at::text as published_at
      from posts where status = 'published' order by published_at desc nulls last
    `,
  );
});

export const getPost = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => {
    if (!input?.slug || !/^[a-z0-9-]+$/.test(input.slug)) throw new Error("Unknown article");
    return input;
  })
  .handler(async ({ data }) => {
    const sql = await db();
    const rows = plains(
      await sql<Record<string, unknown>>`
        select slug, title, excerpt, body, category, tags, cover_url,
               meta_title, meta_description, published_at::text as published_at
        from posts where slug = ${data.slug} and status = 'published'
      `,
    );
    return rows[0] ?? null;
  });

async function throttle(sql: Awaited<ReturnType<typeof db>>, fingerprint: string) {
  const recent = await sql<{ n: number }>`
    select count(*)::int as n from enquiry_throttle
    where fingerprint = ${fingerprint} and created_at > now() - interval '1 hour'
  `;
  const global = await sql<{ n: number }>`
    select count(*)::int as n from enquiry_throttle
    where created_at > now() - interval '1 hour'
  `;
  if (Number(recent[0]?.n ?? 0) >= 3 || Number(global[0]?.n ?? 0) >= 40) {
    throw new Error("Too many submissions right now. Please wait or message the studio on WhatsApp.");
  }
  await sql`insert into enquiry_throttle (fingerprint) values (${fingerprint})`;
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    if (clean(data.company_website ?? "")) {
      return { ok: true as const, suppressed: true as const, id: "" };
    }
    if (data.budget && !BUDGETS.includes(data.budget as (typeof BUDGETS)[number])) {
      throw new Error("Choose a budget range or leave it blank.");
    }
    const sql = await db();
    const email = clean(data.email).toLowerCase();
    await throttle(sql, email);
    const known = await sql`select slug from service_categories where slug = ${data.service_category}`;
    if (!known[0]) throw new Error("Choose a service category.");
    const idRow = await sql<{ id: string }>`
      select 'HK-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('enquiry_seq')::text, 4, '0') as id
    `;
    const id = idRow[0]?.id;
    if (!id) throw new Error("Could not create a reference number.");
    await sql`
      insert into enquiries (
        id, name, email, phone, organization, customer_type, service_category,
        budget, timeline, description, contact_method, email_status
      ) values (
        ${id}, ${clean(data.name)}, ${email}, ${clean(data.phone)}, ${clean(data.organization ?? "")},
        ${data.customer_type}, ${data.service_category}, ${clean(data.budget ?? "")}, ${data.timeline},
        ${clean(data.description)}, ${data.contact_method}, 'not_configured'
      )
    `;
    return { ok: true as const, suppressed: false as const, id, emailDelivery: "not_configured" as const };
  });

export const submitTraining = createServerFn({ method: "POST" })
  .validator((input: unknown) => trainingSchema.parse(input))
  .handler(async ({ data }) => {
    if (clean(data.company_website ?? "")) return { ok: true as const, suppressed: true as const };
    const sql = await db();
    const email = clean(data.email).toLowerCase();
    await throttle(sql, `train:${email}`);
    const program = await sql`select slug from training_programs where slug = ${data.program_slug} and published = true`;
    if (!program[0]) throw new Error("Choose a training program.");
    await sql`
      insert into training_registrations (program_slug, name, email, phone, note)
      values (${data.program_slug}, ${clean(data.name)}, ${email}, ${clean(data.phone)}, ${clean(data.note ?? "")})
    `;
    return { ok: true as const, suppressed: false as const };
  });

export const getSitemapEntries = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await db();
  const services = await sql<{ slug: string }>`select slug from services where published = true`;
  const projects = await sql<{ slug: string }>`select slug from projects where published = true`;
  const posts = await sql<{ slug: string }>`select slug from posts where status = 'published'`;
  const settings = await sql<{ canonical_base: string }>`select canonical_base from site_settings where id = 1`;
  return {
    base: settings[0]?.canonical_base ?? "",
    services: services.map((row) => row.slug),
    projects: projects.map((row) => row.slug),
    posts: posts.map((row) => row.slug),
  };
});
