export const CUSTOMER_TYPES = [
  "Student",
  "Freelancer",
  "Business",
  "Startup",
  "College",
  "Company",
  "Other",
] as const;

export const CONTACT_METHODS = ["Phone", "Email", "WhatsApp"] as const;

export const TIMELINES = [
  "As soon as possible",
  "Within 2 weeks",
  "Within a month",
  "This quarter",
  "Flexible",
] as const;

export const BUDGETS = [
  "",
  "Not sure yet",
  "Under ₹25,000",
  "₹25,000–₹75,000",
  "₹75,000–₹2,00,000",
  "₹2,00,000+",
  "Prefer to discuss",
] as const;

export const LEAD_STATUSES = [
  ["new", "New"],
  ["contacted", "Contacted"],
  ["qualified", "Qualified"],
  ["proposal_sent", "Proposal Sent"],
  ["converted", "Converted"],
  ["not_interested", "Not Interested"],
  ["on_hold", "On Hold"],
  ["lost", "Lost"],
] as const;

export const PROJECT_STATUSES = [
  ["planning", "Planning"],
  ["active", "Active"],
  ["review", "In review"],
  ["completed", "Completed"],
  ["on_hold", "On hold"],
] as const;

export const STAFF_ROLES = [
  ["super_admin", "Super Admin"],
  ["admin", "Admin"],
  ["editor", "Editor"],
  ["sales", "Sales Manager"],
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number][0];

export function statusLabel(value: string): string {
  const found = LEAD_STATUSES.find((item) => item[0] === value);
  return found ? found[1] : value;
}

export const CONTENT_ROLES: StaffRole[] = ["super_admin", "admin", "editor"];
export const LEAD_ROLES: StaffRole[] = ["super_admin", "admin", "sales"];
export const SETTINGS_ROLES: StaffRole[] = ["super_admin", "admin"];

export const WHY = [
  ["Modern Technologies", "Current web, software and AI tools, chosen because they fit the job."],
  ["Practical Solutions", "Built around a workflow you can describe, not a feature list for its own sake."],
  ["Scalable Architecture", "A small first release structured so it can grow when the work proves itself."],
  ["AI-Ready Systems", "Automation and assistants where they remove a real task, with a person still able to review."],
  ["Business-Focused Development", "Decisions tied to the outcome you asked for, written down before build."],
  ["Continuous Support", "Maintenance, backups and updates when you want them, agreed separately from the build."],
] as const;

export const PROCESS = [
  ["Discover", "We listen to the goal, the audience and the constraints before suggesting a build."],
  ["Strategize", "We recommend a practical scope and say what should wait."],
  ["Develop", "We design and build against that scope, with checkpoints you can review."],
  ["Deliver & Support", "We hand the work over and stay available for a care plan if you want one."],
] as const;

export const AUDIENCES = [
  {
    title: "Students",
    body: "Workshops, resume reviews, mock interviews, portfolio feedback and Git training for a first professional profile.",
    links: [
      ["web-development-training", "Web training"],
      ["resume-building", "Resume building"],
      ["mock-interviews", "Mock interviews"],
    ],
  },
  {
    title: "Freelancers",
    body: "Portfolio sites, personal branding, LinkedIn and presentations so your work is easy to understand.",
    links: [
      ["portfolio-website", "Portfolio sites"],
      ["personal-branding", "Personal branding"],
      ["linkedin-optimization", "LinkedIn"],
    ],
  },
  {
    title: "Small Businesses",
    body: "Business websites, Google Business setup, SEO basics, WhatsApp automation and simpler operational tools.",
    links: [
      ["business-website", "Business websites"],
      ["google-business-profile", "Google Business"],
      ["whatsapp-automation", "WhatsApp automation"],
    ],
  },
  {
    title: "Startups",
    body: "Landing pages, MVPs, SaaS foundations, CRM and automation planned around one real workflow.",
    links: [
      ["saas-mvp", "SaaS & MVP"],
      ["landing-page", "Landing pages"],
      ["crm", "CRM"],
    ],
  },
  {
    title: "Colleges & Companies",
    body: "Campus workshops, faculty programs, corporate training, consulting and internal software scoped with the institution.",
    links: [
      ["college-workshops", "College workshops"],
      ["corporate-training", "Corporate training"],
      ["technology-consulting", "Consulting"],
    ],
  },
] as const;

export const ADJACENT = [
  ["Data Analytics", "Analysis scoped to questions you already need answered. Not offered here as a published case study."],
  ["IoT & Embedded Systems", "Discussed only as a scoped engagement. Device results are not claimed without a project record."],
  ["Cloud Solutions", "Hosting and architecture choices made for a specific system, not a generic cloud package."],
  ["Mobile App Development", "Considered when a phone app is actually the right surface. No store listing is implied."],
] as const;
