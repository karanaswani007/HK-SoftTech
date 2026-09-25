export type ServiceItem = {
  slug: string;
  title: string;
  short: string;
  description: string;
  keyServices: string[];
  href: string;
  category: string;
  audience?: string[];
};

export const serviceCategories: ServiceItem[] = [
  {
    slug: "web-development",
    title: "Web Development",
    short: "Business websites, landing pages, portfolios, and scalable online experiences.",
    description:
      "From startup landing pages to full business websites, HK SoftTech designs and builds digital experiences that turn visitors into opportunities.",
    keyServices: ["Business Websites", "Portfolio Sites", "Landing Pages", "SEO Setup"],
    href: "/web-development",
    category: "Core Services",
  },
  {
    slug: "ai-solutions",
    title: "AI Solutions",
    short: "AI chatbots, automation, internal tools, and workflow improvements.",
    description:
      "Practical AI systems built around business workflows, user support, productivity, and content acceleration.",
    keyServices: ["AI Chatbots", "GPT Integration", "Automation", "AI Internal Tools"],
    href: "/ai-solutions",
    category: "Core Services",
  },
  {
    slug: "software-development",
    title: "Software Development",
    short: "Custom business software for operations, management, and growth.",
    description:
      "Custom software solutions for teams that need better workflows, process control, and digital operations.",
    keyServices: ["CRM", "ERP", "Inventory", "Attendance & Billing"],
    href: "/software-development",
    category: "Core Services",
  },
  {
    slug: "digital-presence",
    title: "Digital Presence",
    short: "Profile optimization, portfolio building, and professional branding.",
    description:
      "Professional digital presence support for students, freelancers, and early-career professionals ready to stand out online.",
    keyServices: ["LinkedIn Growth", "Portfolio Building", "Resume Optimization", "Personal Branding"],
    href: "/digital-presence",
    category: "Career & Brand",
  },
  {
    slug: "career-services",
    title: "Career Services",
    short: "Career guidance and placement readiness for students and professionals.",
    description:
      "Career-focused support to improve readiness, confidence, and visibility in competitive hiring environments.",
    keyServices: ["Resume Review", "Mock Interview", "Internship Guidance", "Portfolio Review"],
    href: "/career-services",
    category: "Career & Brand",
  },
  {
    slug: "training",
    title: "Workshops & Training",
    short: "Hands-on training for students, professionals, and colleges.",
    description:
      "Structured learning programs designed to build practical technical and professional readiness in emerging technologies.",
    keyServices: ["Web Development Bootcamp", "Git & GitHub", "AI Tools", "Interview Preparation"],
    href: "/training",
    category: "Training",
  },
  {
    slug: "corporate-training",
    title: "Corporate Training",
    short: "Digital skill development and AI adoption for teams and business units.",
    description:
      "Focused workshops and practical training programs that help companies improve productivity and transform workflows.",
    keyServices: ["AI Adoption", "Microsoft Copilot", "GitHub", "Team Productivity"],
    href: "/corporate-training",
    category: "Training",
  },
  {
    slug: "consulting",
    title: "Consulting",
    short: "Technology consulting and digital strategy for growth-focused teams.",
    description:
      "Decision-ready guidance for startups, businesses, and teams planning digital transformation, AI adoption, or system improvements.",
    keyServices: ["Technology Consulting", "Website Audit", "AI Roadmap", "Automation Planning"],
    href: "/consulting",
    category: "Business Growth",
  },
  {
    slug: "maintenance",
    title: "Maintenance Plans",
    short: "Ongoing support, updates, backups, and performance improvements.",
    description:
      "Reliable support plans for websites and digital platforms that need consistent maintenance and secure operation.",
    keyServices: ["Website Backup", "Security", "SEO", "Priority Support"],
    href: "/maintenance",
    category: "Support",
  },
  {
    slug: "design-services",
    title: "Design Services",
    short: "Professional visuals for brands, digital products, and presentations.",
    description:
      "Brand, UI/UX, and presentation design support that helps businesses communicate clearly and confidently.",
    keyServices: ["Logo Design", "Banner Design", "UI/UX Design", "Business Card Design"],
    href: "/design",
    category: "Creative",
  },
];

export const servicePages = {
  "web-development": {
    title: "Web Development",
    intro:
      "HK SoftTech builds digital experiences designed to support business growth, trust, and conversion across websites, portfolios, landing pages, and online presence platforms.",
    points: [
      "Business websites",
      "Portfolio websites",
      "Landing pages",
      "College project websites",
      "NGO websites",
      "Event websites",
      "Personal brand websites",
      "E-commerce websites",
      "Website redesign",
      "Website maintenance",
      "Speed optimization",
      "SEO setup",
      "Domain & hosting setup",
    ],
    cta: "Start a web project",
  },
  "ai-solutions": {
    title: "AI Solutions",
    intro:
      "AI systems can reduce repetitive work, improve responsiveness, and help teams work more effectively when aligned with real business needs.",
    points: [
      "AI chatbots",
      "GPT integration",
      "Customer support bots",
      "Resume analyzer",
      "AI automation",
      "AI content generator",
      "AI image generator",
      "AI voice assistant",
      "AI-based internal company tools",
    ],
    cta: "Request an AI consultation",
  },
  "software-development": {
    title: "Software Development",
    intro:
      "Custom software can streamline business operations, improve visibility, and reduce manual effort across departments and processes.",
    points: [
      "Custom software",
      "CRM",
      "ERP",
      "Inventory management",
      "Billing system",
      "Attendance system",
      "Hospital management",
      "School management",
      "Restaurant software",
    ],
    cta: "Plan your software solution",
  },
  "digital-presence": {
    title: "Digital Presence",
    intro:
      "A strong professional online presence helps students, freelancers, and businesses communicate credibility and value more clearly.",
    points: [
      "LinkedIn profile optimization",
      "GitHub profile optimization",
      "Portfolio creation",
      "Resume optimization",
      "ATS resume",
      "Personal branding",
      "Freelancer profile setup",
      "Email signature",
      "Professional email setup",
    ],
    cta: "Build your digital presence",
  },
  "career-services": {
    title: "Career Services",
    intro:
      "Career support designed for students and early-career professionals who want better preparation, positioning, and confidence.",
    points: [
      "Resume review",
      "Mock interview",
      "Placement preparation",
      "Career guidance",
      "Internship guidance",
      "LinkedIn growth",
      "GitHub setup",
      "Portfolio review",
    ],
    cta: "Discuss your career goals",
  },
  training: {
    title: "Workshops & Training",
    intro:
      "Practical workshops for students, professionals, and colleges focused on skills that support modern careers and digital readiness.",
    points: [
      "HTML & CSS Bootcamp",
      "JavaScript",
      "React",
      "Git & GitHub",
      "Portfolio building",
      "Resume building",
      "LinkedIn optimization",
      "Interview preparation",
      "AI tools",
    ],
    cta: "Explore training programs",
  },
  "corporate-training": {
    title: "Corporate Training",
    intro:
      "Practical, role-focused training for teams adopting digital workflows, AI tools, and modern productivity practices.",
    points: [
      "AI adoption",
      "Microsoft Copilot",
      "ChatGPT",
      "GitHub",
      "Team productivity",
      "Digital transformation",
    ],
    cta: "Request a corporate workshop",
  },
  consulting: {
    title: "Consulting",
    intro:
      "Technology guidance, improvement planning, and roadmap creation for teams that need clarity and practical next steps.",
    points: [
      "Technology consulting",
      "Startup consulting",
      "Website audit",
      "Digital strategy",
      "AI roadmap",
      "Automation planning",
    ],
    cta: "Book a consultation",
  },
  maintenance: {
    title: "Maintenance Plans",
    intro:
      "Long-term support plans keep websites current, secure, and ready for ongoing business use.",
    points: [
      "Website backup",
      "Updates",
      "Security",
      "Small changes",
      "SEO",
      "Analytics",
      "Performance",
      "Unlimited updates",
      "Priority support",
      "AI improvements",
    ],
    cta: "Contact us for support",
  },
  design: {
    title: "Design Services",
    intro:
      "Brand and interface design support that helps teams communicate value clearly and build stronger digital presence.",
    points: [
      "Logo design",
      "Banner design",
      "Social media design",
      "Business card",
      "Presentation design",
      "UI/UX design",
    ],
    cta: "Discuss your design needs",
  },
};
