import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { studioMiddleware } from "@/lib/hk/studio-middleware";
import { LEAD_STATUSES, PROJECT_STATUSES, type StaffRole } from "@/lib/hk/labels";
import { clean, plain, plains } from "@/lib/hk/row";

const CONTENT: StaffRole[] = ["super_admin", "admin", "editor"];
const LEADS: StaffRole[] = ["super_admin", "admin", "sales"];
const SETTINGS: StaffRole[] = ["super_admin", "admin"];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function db() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

async function staff(userId: string) {
  const sql = await db();
  const rows = await sql<{ role: StaffRole }>`select role from staff_roles where user_id = ${userId}`;
  return { sql, role: rows[0]?.role ?? null };
}

function assert(role: StaffRole | null, allowed: StaffRole[]) {
  if (!role || !allowed.includes(role)) {
    throw new Error("You do not have permission for this action.");
  }
}

async function log(sql: Awaited<ReturnType<typeof db>>, userId: string, action: string, recordRef: string) {
  await sql`insert into activity_logs (user_id, action, record_ref) values (${userId}, ${action}, ${recordRef})`;
}

const slugField = z.string().trim().regex(SLUG, "Use lowercase letters, numbers and hyphens");

export const getAccess = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .handler(async ({ context }) => {
    const sql = await db();
    await sql`
      insert into staff_roles (user_id, email, display_name, role)
      values (${context.userId}, '', 'Studio', 'super_admin')
      on conflict (user_id) do update set role = 'super_admin', display_name = 'Studio'
    `;
    const leads = await sql<{ n: number }>`select count(*)::int as n from enquiries where status = 'new'`;
    return {
      role: "super_admin" as const,
      name: "Studio",
      email: "",
      bootstrapped: false,
      newLeads: Number(leads[0]?.n ?? 0),
    };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .handler(async ({ context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, ["super_admin", "admin", "editor", "sales"]);
    const canLeads = role ? LEADS.includes(role) : false;
    const [enquiries, services, projects, active, days, activity] = await Promise.all([
      sql<{ status: string; n: number }>`select status, count(*)::int as n from enquiries group by status`,
      sql<{ n: number }>`select count(*)::int as n from services where published = true`,
      sql<{ n: number }>`select count(*)::int as n from projects where published = true`,
      sql<{ n: number }>`
        select count(*)::int as n from client_projects where status in ('planning', 'active', 'review')
      `,
      sql<{ day: string; n: number }>`
        select created_at::date::text as day, count(*)::int as n
        from enquiries
        where created_at >= current_date - interval '13 days'
        group by 1 order by 1
      `,
      sql<Record<string, unknown>>`
        select id, user_id, action, record_ref, created_at::text as created_at
        from activity_logs order by id desc limit 12
      `,
    ]);
    const byStatus = Object.fromEntries(enquiries.map((row) => [row.status, Number(row.n)]));
    const total = enquiries.reduce((sum, row) => sum + Number(row.n), 0);
    const recent = canLeads
      ? plains(
          await sql<Record<string, unknown>>`
            select id, name, customer_type, service_category, status, created_at::text as created_at
            from enquiries order by created_at desc limit 6
          `,
        )
      : [];
    return {
      canLeads,
      totalEnquiries: canLeads ? total : null,
      newLeads: canLeads ? Number(byStatus.new ?? 0) : null,
      byStatus: canLeads ? byStatus : {},
      days: canLeads ? days.map((row) => ({ day: String(row.day).slice(5), n: Number(row.n) })) : [],
      publishedServices: Number(services[0]?.n ?? 0),
      publishedProjects: Number(projects[0]?.n ?? 0),
      activeProjects: Number(active[0]?.n ?? 0),
      activity: plains(activity),
      recent,
    };
  });

const serviceSchema = z.object({
  original_slug: z.string().optional().default(""),
  slug: slugField,
  category_slug: slugField,
  name: z.string().trim().min(2).max(140),
  summary: z.string().trim().min(8).max(400),
  body: z.string().trim().min(8).max(8000),
  includes: z.string().max(4000).optional().default(""),
  featured: z.boolean(),
  published: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
  meta_title: z.string().max(180).optional().default(""),
  meta_description: z.string().max(300).optional().default(""),
  image_url: z.string().max(1_500_000).optional().default(""),
});

export const listServicesAdmin = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .handler(async ({ context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    const categories = plains(
      await sql<Record<string, unknown>>`select slug, name from service_categories order by sort_order`,
    );
    const services = plains(
      await sql<Record<string, unknown>>`
        select slug, category_slug, name, summary, body, includes, featured, published, sort_order,
               meta_title, meta_description, image_url
        from services order by category_slug, sort_order, name
      `,
    );
    return { categories, services };
  });

export const saveService = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: unknown) => serviceSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    const category = await sql`select slug from service_categories where slug = ${data.category_slug}`;
    if (!category[0]) throw new Error("Unknown category.");
    const original = data.original_slug && SLUG.test(data.original_slug) ? data.original_slug : "";
    if (original) {
      await sql`
        update services set
          slug = ${data.slug},
          category_slug = ${data.category_slug},
          name = ${clean(data.name)},
          summary = ${clean(data.summary)},
          body = ${clean(data.body)},
          includes = ${data.includes ?? ""},
          featured = ${data.featured},
          published = ${data.published},
          sort_order = ${data.sort_order},
          meta_title = ${clean(data.meta_title ?? "")},
          meta_description = ${clean(data.meta_description ?? "")},
          image_url = ${data.image_url ?? ""},
          updated_at = now()
        where slug = ${original}
      `;
    } else {
      await sql`
        insert into services (
          slug, category_slug, name, summary, body, includes, featured, published, sort_order,
          meta_title, meta_description, image_url
        ) values (
          ${data.slug}, ${data.category_slug}, ${clean(data.name)}, ${clean(data.summary)}, ${clean(data.body)},
          ${data.includes ?? ""}, ${data.featured}, ${data.published}, ${data.sort_order},
          ${clean(data.meta_title ?? "")}, ${clean(data.meta_description ?? "")}, ${data.image_url ?? ""}
        )
      `;
    }
    await log(sql, context.userId, original ? "Updated service" : "Created service", data.slug);
    return { ok: true };
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: { slug: string }) => input)
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    if (!SLUG.test(data.slug)) throw new Error("Unknown service");
    await sql`delete from services where slug = ${data.slug}`;
    await log(sql, context.userId, "Deleted service", data.slug);
    return { ok: true };
  });

export const moveService = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: { slug: string; direction: "up" | "down" }) => input)
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    const current = await sql<{ slug: string; category_slug: string; sort_order: number }>`
      select slug, category_slug, sort_order from services where slug = ${data.slug}
    `;
    const row = current[0];
    if (!row) throw new Error("Service not found");
    const siblings = await sql<{ slug: string; sort_order: number }>`
      select slug, sort_order from services where category_slug = ${row.category_slug}
      order by sort_order asc, name asc
    `;
    const index = siblings.findIndex((item) => item.slug === row.slug);
    const next = data.direction === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= siblings.length) return { ok: true };
    const a = siblings[index];
    const b = siblings[next];
    if (!a || !b) return { ok: true };
    await sql`update services set sort_order = ${b.sort_order} where slug = ${a.slug}`;
    await sql`update services set sort_order = ${a.sort_order} where slug = ${b.slug}`;
    return { ok: true };
  });

const projectSchema = z.object({
  original_slug: z.string().optional().default(""),
  slug: slugField,
  title: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(8).max(400),
  body: z.string().trim().min(8).max(8000),
  category: z.string().trim().min(2).max(80),
  stack: z.string().max(300).optional().default(""),
  project_url: z.string().max(400).optional().default(""),
  github_url: z.string().max(400).optional().default(""),
  image_url: z.string().max(1_500_000).optional().default(""),
  featured: z.boolean(),
  published: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
  meta_title: z.string().max(180).optional().default(""),
  meta_description: z.string().max(300).optional().default(""),
});

export const listProjectsAdmin = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .handler(async ({ context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    return plains(
      await sql<Record<string, unknown>>`
        select slug, title, summary, body, category, stack, project_url, github_url, image_url,
               featured, published, sort_order, meta_title, meta_description
        from projects order by sort_order, title
      `,
    );
  });

export const saveProject = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: unknown) => projectSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    const original = data.original_slug && SLUG.test(data.original_slug) ? data.original_slug : "";
    if (original) {
      await sql`
        update projects set
          slug = ${data.slug}, title = ${clean(data.title)}, summary = ${clean(data.summary)},
          body = ${clean(data.body)}, category = ${clean(data.category)}, stack = ${clean(data.stack ?? "")},
          project_url = ${clean(data.project_url ?? "")}, github_url = ${clean(data.github_url ?? "")},
          image_url = ${data.image_url ?? ""}, featured = ${data.featured}, published = ${data.published},
          sort_order = ${data.sort_order}, meta_title = ${clean(data.meta_title ?? "")},
          meta_description = ${clean(data.meta_description ?? "")}, updated_at = now()
        where slug = ${original}
      `;
    } else {
      await sql`
        insert into projects (
          slug, title, summary, body, category, stack, project_url, github_url, image_url,
          featured, published, sort_order, meta_title, meta_description
        ) values (
          ${data.slug}, ${clean(data.title)}, ${clean(data.summary)}, ${clean(data.body)}, ${clean(data.category)},
          ${clean(data.stack ?? "")}, ${clean(data.project_url ?? "")}, ${clean(data.github_url ?? "")},
          ${data.image_url ?? ""}, ${data.featured}, ${data.published}, ${data.sort_order},
          ${clean(data.meta_title ?? "")}, ${clean(data.meta_description ?? "")}
        )
      `;
    }
    await log(sql, context.userId, original ? "Updated project" : "Created project", data.slug);
    return { ok: true };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: { slug: string }) => input)
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    await sql`delete from projects where slug = ${data.slug}`;
    await log(sql, context.userId, "Deleted project", data.slug);
    return { ok: true };
  });

export const listEnquiries = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .handler(async ({ context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, LEADS);
    const enquiries = plains(
      await sql<Record<string, unknown>>`
        select e.id, e.name, e.email, e.phone, e.organization, e.customer_type, e.service_category,
               e.budget, e.timeline, e.description, e.contact_method, e.status, e.assignee_id,
               e.follow_up_on::text as follow_up_on, e.email_status, e.created_at::text as created_at,
               coalesce(u.name, '') as assignee_name
        from enquiries e
        left join "user" u on u.id = e.assignee_id
        order by e.created_at desc
        limit 300
      `,
    );
    const staffRows = plains(
      await sql<Record<string, unknown>>`
        select s.user_id, coalesce(u.name, s.display_name) as name, s.role
        from staff_roles s
        left join "user" u on u.id = s.user_id
        where s.role in ('super_admin', 'admin', 'sales')
        order by name
      `,
    );
    return { enquiries, staff: staffRows };
  });

export const addEnquiryNote = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: { id: string; body: string }) => {
    if (!input.id || input.body.trim().length < 2) throw new Error("Write a note first.");
    return { id: input.id, body: clean(input.body).slice(0, 4000) };
  })
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, LEADS);
    await sql`insert into enquiry_notes (enquiry_id, author_id, body) values (${data.id}, ${context.userId}, ${data.body})`;
    await log(sql, context.userId, "Added enquiry note", data.id);
    return { ok: true };
  });

const enquiryPatch = z.object({
  id: z.string().min(4).max(40),
  status: z.enum(LEAD_STATUSES.map((item) => item[0]) as [string, ...string[]]),
  assignee_id: z.string().max(80).optional().default(""),
  follow_up_on: z.string().max(20).optional().default(""),
});

export const updateEnquiry = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: unknown) => enquiryPatch.parse(input))
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, LEADS);
    const follow = /^\d{4}-\d{2}-\d{2}$/.test(data.follow_up_on ?? "") ? data.follow_up_on : null;
    await sql`
      update enquiries set
        status = ${data.status},
        assignee_id = ${data.assignee_id ?? ""},
        follow_up_on = ${follow},
        updated_at = now()
      where id = ${data.id}
    `;
    await log(sql, context.userId, "Updated enquiry", data.id);
    return { ok: true };
  });

export const listEnquiryNotes = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, LEADS);
    return plains(
      await sql<Record<string, unknown>>`
        select n.id, n.body, n.created_at::text as created_at, coalesce(u.name, 'Staff') as author
        from enquiry_notes n
        left join "user" u on u.id = n.author_id
        where n.enquiry_id = ${data.id}
        order by n.id desc
      `,
    );
  });

const deliverySchema = z.object({
  id: z.number().int().optional(),
  title: z.string().trim().min(2).max(160),
  description: z.string().max(4000).optional().default(""),
  owner_id: z.string().max(80).optional().default(""),
  status: z.enum(PROJECT_STATUSES.map((item) => item[0]) as [string, ...string[]]),
  progress: z.number().int().min(0).max(100),
  deadline: z.string().max(20).optional().default(""),
  notes: z.string().max(4000).optional().default(""),
});

export const listDelivery = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .handler(async ({ context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, LEADS);
    const projects = plains(
      await sql<Record<string, unknown>>`
        select p.id, p.title, p.description, p.owner_id, p.status, p.progress,
               p.deadline::text as deadline, p.notes, coalesce(u.name, '') as owner_name
        from client_projects p
        left join "user" u on u.id = p.owner_id
        order by p.updated_at desc
      `,
    );
    const owners = plains(
      await sql<Record<string, unknown>>`
        select s.user_id, coalesce(u.name, s.display_name) as name
        from staff_roles s left join "user" u on u.id = s.user_id
        order by name
      `,
    );
    return { projects, owners };
  });

export const saveDelivery = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: unknown) => deliverySchema.parse(input))
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, LEADS);
    const deadline = /^\d{4}-\d{2}-\d{2}$/.test(data.deadline ?? "") ? data.deadline : null;
    if (data.id) {
      await sql`
        update client_projects set
          title = ${clean(data.title)}, description = ${clean(data.description ?? "")},
          owner_id = ${data.owner_id ?? ""}, status = ${data.status}, progress = ${data.progress},
          deadline = ${deadline}, notes = ${clean(data.notes ?? "")}, updated_at = now()
        where id = ${data.id}
      `;
    } else {
      await sql`
        insert into client_projects (title, description, owner_id, status, progress, deadline, notes)
        values (
          ${clean(data.title)}, ${clean(data.description ?? "")}, ${data.owner_id ?? ""},
          ${data.status}, ${data.progress}, ${deadline}, ${clean(data.notes ?? "")}
        )
      `;
    }
    await log(sql, context.userId, data.id ? "Updated delivery project" : "Created delivery project", data.title);
    return { ok: true };
  });

export const deleteDelivery = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, ["super_admin", "admin"]);
    await sql`delete from client_projects where id = ${data.id}`;
    await log(sql, context.userId, "Deleted delivery project", String(data.id));
    return { ok: true };
  });

const programSchema = z.object({
  original_slug: z.string().optional().default(""),
  slug: slugField,
  title: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(8).max(800),
  audience: z.string().trim().min(2).max(160),
  schedule: z.string().max(160).optional().default(""),
  published: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

export const listTrainingAdmin = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .handler(async ({ context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, [...CONTENT, "sales"]);
    const programs = plains(
      await sql<Record<string, unknown>>`
        select slug, title, summary, audience, schedule, published, sort_order
        from training_programs order by sort_order, title
      `,
    );
    const registrations = LEADS.includes(role!)
      ? plains(
          await sql<Record<string, unknown>>`
            select r.id, r.program_slug, r.name, r.email, r.phone, r.note, r.status,
                   r.created_at::text as created_at, coalesce(p.title, '') as program_title
            from training_registrations r
            left join training_programs p on p.slug = r.program_slug
            order by r.created_at desc limit 200
          `,
        )
      : [];
    return { programs, registrations, canLeads: LEADS.includes(role!) };
  });

export const saveProgram = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: unknown) => programSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    const original = data.original_slug && SLUG.test(data.original_slug) ? data.original_slug : "";
    if (original) {
      await sql`
        update training_programs set
          slug = ${data.slug}, title = ${clean(data.title)}, summary = ${clean(data.summary)},
          audience = ${clean(data.audience)}, schedule = ${clean(data.schedule ?? "")},
          published = ${data.published}, sort_order = ${data.sort_order}, updated_at = now()
        where slug = ${original}
      `;
    } else {
      await sql`
        insert into training_programs (slug, title, summary, audience, schedule, published, sort_order)
        values (
          ${data.slug}, ${clean(data.title)}, ${clean(data.summary)}, ${clean(data.audience)},
          ${clean(data.schedule ?? "")}, ${data.published}, ${data.sort_order}
        )
      `;
    }
    await log(sql, context.userId, "Saved training program", data.slug);
    return { ok: true };
  });

export const deleteProgram = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: { slug: string }) => input)
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    await sql`delete from training_programs where slug = ${data.slug}`;
    await log(sql, context.userId, "Deleted training program", data.slug);
    return { ok: true };
  });

export const updateRegistration = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: { id: number; status: string }) => input)
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, LEADS);
    if (!["new", "contacted", "confirmed", "closed"].includes(data.status)) throw new Error("Unknown status");
    await sql`update training_registrations set status = ${data.status} where id = ${data.id}`;
    return { ok: true };
  });

const testimonialSchema = z.object({
  id: z.number().int().optional(),
  author_name: z.string().trim().min(2).max(120),
  author_role: z.string().max(160).optional().default(""),
  quote: z.string().trim().min(8).max(1200),
  approved: z.boolean(),
  published: z.boolean(),
  featured: z.boolean(),
});

export const listTestimonialsAdmin = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .handler(async ({ context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    return plains(
      await sql<Record<string, unknown>>`
        select id, author_name, author_role, quote, approved, published, featured
        from testimonials order by id desc
      `,
    );
  });

export const saveTestimonial = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: unknown) => testimonialSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    const published = data.published && data.approved;
    if (data.id) {
      await sql`
        update testimonials set
          author_name = ${clean(data.author_name)}, author_role = ${clean(data.author_role ?? "")},
          quote = ${clean(data.quote)}, approved = ${data.approved}, published = ${published}, featured = ${data.featured}
        where id = ${data.id}
      `;
    } else {
      await sql`
        insert into testimonials (author_name, author_role, quote, approved, published, featured)
        values (
          ${clean(data.author_name)}, ${clean(data.author_role ?? "")}, ${clean(data.quote)},
          ${data.approved}, ${published}, ${data.featured}
        )
      `;
    }
    await log(sql, context.userId, "Saved testimonial", data.author_name);
    return { ok: true };
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    await sql`delete from testimonials where id = ${data.id}`;
    await log(sql, context.userId, "Deleted testimonial", String(data.id));
    return { ok: true };
  });

const postSchema = z.object({
  original_slug: z.string().optional().default(""),
  slug: slugField,
  title: z.string().trim().min(2).max(180),
  excerpt: z.string().trim().min(8).max(400),
  body: z.string().trim().min(8).max(20000),
  cover_url: z.string().max(1_500_000).optional().default(""),
  category: z.string().max(80).optional().default(""),
  tags: z.string().max(200).optional().default(""),
  status: z.enum(["draft", "published"]),
  meta_title: z.string().max(180).optional().default(""),
  meta_description: z.string().max(300).optional().default(""),
});

export const listPostsAdmin = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .handler(async ({ context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    return plains(
      await sql<Record<string, unknown>>`
        select slug, title, excerpt, body, cover_url, category, tags, status,
               meta_title, meta_description, published_at::text as published_at
        from posts order by updated_at desc
      `,
    );
  });

export const savePost = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: unknown) => postSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    const original = data.original_slug && SLUG.test(data.original_slug) ? data.original_slug : "";
    if (original) {
      await sql`
        update posts set
          slug = ${data.slug}, title = ${clean(data.title)}, excerpt = ${clean(data.excerpt)},
          body = ${clean(data.body)}, cover_url = ${data.cover_url ?? ""}, category = ${clean(data.category ?? "")},
          tags = ${clean(data.tags ?? "")}, status = ${data.status},
          meta_title = ${clean(data.meta_title ?? "")}, meta_description = ${clean(data.meta_description ?? "")},
          published_at = case when ${data.status} = 'published' then coalesce(published_at, now()) else published_at end,
          updated_at = now()
        where slug = ${original}
      `;
    } else {
      await sql`
        insert into posts (slug, title, excerpt, body, cover_url, category, tags, status, meta_title, meta_description, published_at)
        values (
          ${data.slug}, ${clean(data.title)}, ${clean(data.excerpt)}, ${clean(data.body)}, ${data.cover_url ?? ""},
          ${clean(data.category ?? "")}, ${clean(data.tags ?? "")}, ${data.status},
          ${clean(data.meta_title ?? "")}, ${clean(data.meta_description ?? "")},
          case when ${data.status} = 'published' then now() else null end
        )
      `;
    }
    await log(sql, context.userId, "Saved article", data.slug);
    return { ok: true };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: { slug: string }) => input)
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    await sql`delete from posts where slug = ${data.slug}`;
    await log(sql, context.userId, "Deleted article", data.slug);
    return { ok: true };
  });

const faqSchema = z.object({
  id: z.number().int().optional(),
  question: z.string().trim().min(4).max(240),
  answer: z.string().trim().min(8).max(4000),
  sort_order: z.number().int().min(0).max(9999),
  published: z.boolean(),
});

export const listFaqsAdmin = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .handler(async ({ context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    const faqs = plains(
      await sql<Record<string, unknown>>`select id, question, answer, sort_order, published from faqs order by sort_order, id`,
    );
    const settingsRow = (
      await sql<Record<string, unknown>>`
        select hero_label, hero_title, hero_body, about_intro, mission, vision,
               founder_name, founder_role, founder_bio, cta_title, cta_body, footer_blurb,
               privacy_body, terms_body
        from site_settings where id = 1
      `
    )[0];
    return { faqs, settings: plain(settingsRow ?? {}) };
  });

export const saveFaq = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: unknown) => faqSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    if (data.id) {
      await sql`
        update faqs set question = ${clean(data.question)}, answer = ${clean(data.answer)},
          sort_order = ${data.sort_order}, published = ${data.published}
        where id = ${data.id}
      `;
    } else {
      await sql`
        insert into faqs (question, answer, sort_order, published)
        values (${clean(data.question)}, ${clean(data.answer)}, ${data.sort_order}, ${data.published})
      `;
    }
    await log(sql, context.userId, "Saved FAQ", data.question.slice(0, 80));
    return { ok: true };
  });

export const deleteFaq = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    await sql`delete from faqs where id = ${data.id}`;
    return { ok: true };
  });

const settingsKeys = [
  "company_name",
  "tagline",
  "phone",
  "whatsapp",
  "email",
  "address",
  "hours",
  "hero_label",
  "hero_title",
  "hero_body",
  "about_intro",
  "mission",
  "vision",
  "founder_name",
  "founder_role",
  "founder_bio",
  "cta_title",
  "cta_body",
  "footer_blurb",
  "linkedin_url",
  "instagram_url",
  "github_url",
  "meta_title",
  "meta_description",
  "canonical_base",
  "privacy_body",
  "terms_body",
] as const;

export const getSettingsAdmin = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .handler(async ({ context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, [...SETTINGS, "editor"]);
    const raw = (await sql<Record<string, unknown>>`select * from site_settings where id = 1`)[0];
    if (!raw) throw new Error("Settings missing");
    const row = plain(raw);
    const { updated_at: _unused, id: _id, ...rest } = row;
    return rest;
  });

const copyKeys = new Set<string>([
  "hero_label",
  "hero_title",
  "hero_body",
  "about_intro",
  "mission",
  "vision",
  "founder_name",
  "founder_role",
  "founder_bio",
  "cta_title",
  "cta_body",
  "footer_blurb",
  "privacy_body",
  "terms_body",
]);

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: unknown) =>
    z.record(z.string(), z.union([z.string(), z.boolean(), z.number(), z.null()])).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    if (!role || (role !== "editor" && !SETTINGS.includes(role))) {
      throw new Error("You do not have permission for this action.");
    }
    for (const key of settingsKeys) {
      if (typeof data[key] !== "string") continue;
      if (role === "editor" && !copyKeys.has(key)) continue;
      await sql.query(`update site_settings set ${key} = $1, updated_at = now() where id = 1`, [
        clean(String(data[key])).slice(0, key.endsWith("_body") ? 20000 : 2000),
      ]);
    }
    if (typeof data.robots_index === "boolean" && role !== "editor") {
      await sql`update site_settings set robots_index = ${data.robots_index}, updated_at = now() where id = 1`;
    }
    await log(sql, context.userId, "Updated website settings", "site_settings");
    return { ok: true };
  });

export const listMedia = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .handler(async ({ context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    return plains(
      await sql<Record<string, unknown>>`
        select id, name, mime, size_bytes, data_url, created_at::text as created_at
        from media_assets order by id desc limit 60
      `,
    );
  });

export const addMedia = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: { name: string; data_url: string }) => input)
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    const match = /^data:(image\/(?:png|jpeg|webp|gif));base64,([a-z0-9+/=\s]+)$/i.exec(data.data_url);
    if (!match) throw new Error("Upload a PNG, JPEG, WebP or GIF.");
    const size = Math.floor((match[2]?.length ?? 0) * 0.75);
    if (size > 900_000) throw new Error("Images must be under 900 KB.");
    await sql`
      insert into media_assets (name, mime, size_bytes, data_url)
      values (${clean(data.name).slice(0, 120) || "image"}, ${match[1]}, ${size}, ${data.data_url})
    `;
    await log(sql, context.userId, "Uploaded media", clean(data.name).slice(0, 80));
    return { ok: true };
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, CONTENT);
    await sql`delete from media_assets where id = ${data.id}`;
    await log(sql, context.userId, "Deleted media", String(data.id));
    return { ok: true };
  });

export const listTeam = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .handler(async ({ context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, ["super_admin", "admin"]);
    return plains(
      await sql<Record<string, unknown>>`
        select u.id as user_id, u.name, u.email, coalesce(s.role, 'none') as role
        from "user" u
        left join staff_roles s on s.user_id = u.id
        order by u."createdAt" desc
      `,
    );
  });

export const setRole = createServerFn({ method: "POST" })
  .middleware([studioMiddleware])
  .validator((input: { user_id: string; role: string }) => input)
  .handler(async ({ data, context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, ["super_admin", "admin"]);
    const allowed = ["super_admin", "admin", "editor", "sales", "none"];
    if (!allowed.includes(data.role)) throw new Error("Unknown role");
    if (role === "admin" && (data.role === "super_admin" || data.role === "admin")) {
      throw new Error("Only a super admin can grant that role.");
    }
    const target = await sql<{ role: string }>`select role from staff_roles where user_id = ${data.user_id}`;
    if (role === "admin" && target[0]?.role === "super_admin") {
      throw new Error("Only a super admin can change that person.");
    }
    if (target[0]?.role === "super_admin" && data.role !== "super_admin") {
      const count = await sql<{ n: number }>`select count(*)::int as n from staff_roles where role = 'super_admin'`;
      if (Number(count[0]?.n ?? 0) <= 1) throw new Error("The studio needs at least one super admin.");
    }
    const person = await sql<{ name: string; email: string }>`select name, email from "user" where id = ${data.user_id}`;
    if (!person[0]) throw new Error("That person has not signed in yet.");
    if (data.role === "none") {
      await sql`delete from staff_roles where user_id = ${data.user_id}`;
    } else {
      await sql`
        insert into staff_roles (user_id, email, display_name, role)
        values (${data.user_id}, ${person[0].email}, ${person[0].name}, ${data.role})
        on conflict (user_id) do update set role = excluded.role, email = excluded.email, display_name = excluded.display_name
      `;
    }
    await log(sql, context.userId, "Changed staff role", data.role);
    return { ok: true };
  });

export const listActivity = createServerFn({ method: "GET" })
  .middleware([studioMiddleware])
  .handler(async ({ context }) => {
    const { sql, role } = await staff(context.userId);
    assert(role, ["super_admin", "admin", "editor", "sales"]);
    return plains(
      await sql<Record<string, unknown>>`
        select a.id, a.action, a.record_ref, a.created_at::text as created_at,
               coalesce(u.name, a.user_id) as actor
        from activity_logs a
        left join "user" u on u.id = a.user_id
        order by a.id desc limit 150
      `,
    );
  });
