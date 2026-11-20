-- HK SoftTech public site and studio schema

create table if not exists site_settings (
  id int primary key default 1 check (id = 1),
  company_name text not null,
  tagline text not null,
  phone text not null,
  whatsapp text not null,
  email text not null default '',
  address text not null default '',
  hours text not null default '',
  hero_label text not null,
  hero_title text not null,
  hero_body text not null,
  about_intro text not null,
  mission text not null,
  vision text not null,
  founder_name text not null,
  founder_role text not null,
  founder_bio text not null,
  cta_title text not null,
  cta_body text not null,
  footer_blurb text not null,
  linkedin_url text not null default '',
  instagram_url text not null default '',
  github_url text not null default '',
  meta_title text not null,
  meta_description text not null,
  canonical_base text not null default '',
  robots_index boolean not null default true,
  privacy_body text not null,
  terms_body text not null,
  updated_at timestamptz not null default now()
);

create table if not exists service_categories (
  slug text primary key,
  name text not null,
  summary text not null,
  icon text not null,
  sort_order int not null default 0
);

create table if not exists services (
  slug text primary key,
  category_slug text not null references service_categories(slug) on delete restrict,
  name text not null,
  summary text not null,
  body text not null,
  includes text not null default '',
  featured boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  meta_title text not null default '',
  meta_description text not null default '',
  image_url text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  slug text primary key,
  title text not null,
  summary text not null,
  body text not null,
  category text not null,
  stack text not null default '',
  project_url text not null default '',
  github_url text not null default '',
  image_url text not null default '',
  featured boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  meta_title text not null default '',
  meta_description text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists faqs (
  id serial primary key,
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists testimonials (
  id serial primary key,
  author_name text not null,
  author_role text not null default '',
  quote text not null,
  approved boolean not null default false,
  published boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists training_programs (
  slug text primary key,
  title text not null,
  summary text not null,
  audience text not null,
  schedule text not null default '',
  published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists training_registrations (
  id serial primary key,
  program_slug text references training_programs(slug) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  note text not null default '',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create sequence if not exists enquiry_seq;

create table if not exists enquiries (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null,
  organization text not null default '',
  customer_type text not null,
  service_category text not null,
  budget text not null default '',
  timeline text not null,
  description text not null,
  contact_method text not null,
  status text not null default 'new',
  assignee_id text not null default '',
  follow_up_on date,
  email_status text not null default 'not_configured',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists enquiry_notes (
  id serial primary key,
  enquiry_id text not null references enquiries(id) on delete cascade,
  author_id text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists client_projects (
  id serial primary key,
  title text not null,
  description text not null default '',
  owner_id text not null default '',
  status text not null default 'planning',
  progress int not null default 0 check (progress >= 0 and progress <= 100),
  deadline date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists posts (
  slug text primary key,
  title text not null,
  excerpt text not null,
  body text not null,
  cover_url text not null default '',
  category text not null default '',
  tags text not null default '',
  status text not null default 'draft',
  meta_title text not null default '',
  meta_description text not null default '',
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists media_assets (
  id serial primary key,
  name text not null,
  mime text not null,
  size_bytes int not null,
  data_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists staff_roles (
  user_id text primary key,
  email text not null default '',
  display_name text not null default '',
  role text not null,
  created_at timestamptz not null default now()
);

create table if not exists activity_logs (
  id serial primary key,
  user_id text not null,
  action text not null,
  record_ref text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists enquiry_throttle (
  id serial primary key,
  fingerprint text not null,
  created_at timestamptz not null default now()
);

create index if not exists services_category_idx on services (category_slug, sort_order);
create index if not exists projects_published_idx on projects (published, sort_order);
create index if not exists enquiries_status_idx on enquiries (status, created_at desc);
create index if not exists faqs_sort_idx on faqs (published, sort_order);
create index if not exists activity_logs_created_idx on activity_logs (created_at desc);
create index if not exists enquiry_throttle_fp_idx on enquiry_throttle (fingerprint, created_at desc);

insert into site_settings (id, company_name, tagline, phone, whatsapp, email, address, hours, hero_label, hero_title, hero_body, about_intro, mission, vision, founder_name, founder_role, founder_bio, cta_title, cta_body, footer_blurb, linkedin_url, instagram_url, github_url, meta_title, meta_description, canonical_base, robots_index, privacy_body, terms_body) values (
1, 'HK SoftTech', 'INNOVATE. DEVELOP. EMPOWER.', '+91 7378603865', '917378603865', '', '', '', 'Technology partner for growth', 'Build Smarter. Grow Faster. Go Digital.', 'HK SoftTech helps businesses, startups, students and professionals transform ideas into impactful digital solutions through software development, AI automation, modern web technologies and practical technology services.', 'HK SoftTech is a technology studio led by Karan R. Aswani. The work covers software and websites, AI and automation, digital presence, practical training, and technology consulting for businesses, startups, students, colleges and professionals.', 'Help people and organisations turn a specific idea into a working digital solution, with scope that stays understandable.', 'Be a trusted technology partner for clients who want clear software, useful automation and training they can apply.', 'Karan R. Aswani', 'Founder & CEO, HK SoftTech', 'Karan R. Aswani founded HK SoftTech and leads the studio as Founder and CEO. This site does not add a biography, headcount, founding year or awards beyond what the studio chooses to publish.', 'Have an Idea? Let''s Build It.', 'Tell us what you want to create. We''ll help you find the right technology solution.', 'HK SoftTech designs and builds software, websites, automation and training for people who want a practical technology partner.', '', '', '', 'HK SoftTech | Software, AI and Digital Solutions', 'HK SoftTech helps businesses, startups, students and professionals with software development, AI automation, digital presence, training and technology consulting.', '', true, 'HK SoftTech collects only what you submit on an enquiry or training form: your name, email, phone number, organisation if you provide one, the kind of work you are asking about, and the description you write.

Those details are stored so the studio can reply. They are visible to authorised studio staff. They are not sold and they are not shown on the public website.

Enquiry reference numbers are for your own follow-up. Please do not send passwords, payment card numbers or government identity numbers through the form.

To ask for a correction or deletion, contact the studio on the phone number published on this website and mention your enquiry reference.

The site may store a technical session if you are a member of staff signed in to the studio. That session is used only to protect the studio.

This policy describes the website you are using. If a client project has its own privacy terms, those are agreed separately.', 'Using this website does not create a contract for software, training or support. A project starts only when scope, price and timing are agreed in writing.

Content on the site describes services the studio offers. It is not a promise of a particular business result, ranking, placement or revenue.

Project examples are named studio work. Where a screenshot, client name or performance figure is missing, that is intentional. We do not publish those unless they are real and approved.

You agree that information you send through a form is accurate to the best of your knowledge and that you are allowed to share it.

The studio may decline work that is outside its scope, unclear, or not a fit for the requested budget and timeline.

These terms can be updated from the studio. The version on this page is the one that applies to the site.');
insert into service_categories (slug, name, summary, icon, sort_order) values
('software-web', 'Software & Web Development', 'Websites, products and business systems built to be clear, fast and ready to grow.', 'code', 1),
('ai-automation', 'AI & Automation', 'Chatbots, assistants and workflow automation that remove repetitive work.', 'spark', 2),
('digital-presence', 'Digital Presence & Creative Design', 'Branding, profiles and visuals that make a person or business look credible.', 'pen', 3),
('training-career', 'Training & Career Development', 'Practical workshops and career support for students, colleges and teams.', 'grad', 4),
('consulting-support', 'Technology Consulting & Support', 'Advice, audits and ongoing care so systems stay useful after launch.', 'compass', 5);
insert into services (slug, category_slug, name, summary, body, includes, featured, published, sort_order, meta_title, meta_description) values
('business-website', 'software-web', 'Business Website Development', 'A clear company website that explains what you do and how to reach you.', 'A clear company website that explains what you do and how to reach you. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Page structure and content guidance\nMobile-friendly layout\nContact path\nBasic on-page SEO setup', true, true, 10, 'Business Website Development | HK SoftTech', 'A clear company website that explains what you do and how to reach you.'),
('portfolio-website', 'software-web', 'Portfolio Website Development', 'A site that presents your work without burying it in decoration.', 'A site that presents your work without burying it in decoration. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Project structure\nAbout and contact pages\nFast, simple navigation', true, true, 20, 'Portfolio Website Development | HK SoftTech', 'A site that presents your work without burying it in decoration.'),
('landing-page', 'software-web', 'Landing Page Development', 'One focused page for a campaign, offer or product launch.', 'One focused page for a campaign, offer or product launch. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Single-purpose layout\nEnquiry or signup path\nClear headline and proof structure', false, true, 30, 'Landing Page Development | HK SoftTech', 'One focused page for a campaign, offer or product launch.'),
('ecommerce-website', 'software-web', 'E-commerce Website Development', 'An online store scoped around your catalogue, payments and operations.', 'An online store scoped around your catalogue, payments and operations. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Product catalogue\nCheckout approach\nOrder notifications', false, true, 40, 'E-commerce Website Development | HK SoftTech', 'An online store scoped around your catalogue, payments and operations.'),
('custom-web-app', 'software-web', 'Custom Web Applications', 'Software in the browser for a workflow a template cannot cover.', 'Software in the browser for a workflow a template cannot cover. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Workflow mapping\nRole-based screens\nA scoped first release', true, true, 50, 'Custom Web Applications | HK SoftTech', 'Software in the browser for a workflow a template cannot cover.'),
('saas-mvp', 'software-web', 'SaaS & MVP Development', 'A first usable version of a product, built to learn from real users.', 'A first usable version of a product, built to learn from real users. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Core user journey\nAccount basics\nA release you can demo', true, true, 60, 'SaaS & MVP Development | HK SoftTech', 'A first usable version of a product, built to learn from real users.'),
('custom-software', 'software-web', 'Custom Software Development', 'Tools shaped around how your team actually works.', 'Tools shaped around how your team actually works. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Process discovery\nApplication structure\nHandover notes', false, true, 70, 'Custom Software Development | HK SoftTech', 'Tools shaped around how your team actually works.'),
('crm', 'software-web', 'CRM Development', 'A system to track leads, conversations and follow-ups.', 'A system to track leads, conversations and follow-ups. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Lead records\nStatus pipeline\nNotes and ownership', true, true, 80, 'CRM Development | HK SoftTech', 'A system to track leads, conversations and follow-ups.'),
('erp', 'software-web', 'ERP Systems', 'Connected operational software when spreadsheets no longer hold the business.', 'Connected operational software when spreadsheets no longer hold the business. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Module scoping\nData model\nPhased rollout', false, true, 90, 'ERP Systems | HK SoftTech', 'Connected operational software when spreadsheets no longer hold the business.'),
('inventory-management', 'software-web', 'Inventory Management Systems', 'Stock visibility for products moving in and out.', 'Stock visibility for products moving in and out. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Item records\nStock movement\nBasic reporting', false, true, 100, 'Inventory Management Systems | HK SoftTech', 'Stock visibility for products moving in and out.'),
('billing-attendance', 'software-web', 'Billing & Attendance Systems', 'Billing, invoicing or attendance flows for a specific operation.', 'Billing, invoicing or attendance flows for a specific operation. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'The workflow you use today\nRecords and exports\nA simple admin view', false, true, 110, 'Billing & Attendance Systems | HK SoftTech', 'Billing, invoicing or attendance flows for a specific operation.'),
('api-integration', 'software-web', 'API Development & Integration', 'Connections between the tools you already rely on.', 'Connections between the tools you already rely on. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'API design or consumption\nAuthentication approach\nError handling', false, true, 120, 'API Development & Integration | HK SoftTech', 'Connections between the tools you already rely on.'),
('ui-ux-design', 'software-web', 'UI/UX Design', 'Interface design grounded in the task a person needs to finish.', 'Interface design grounded in the task a person needs to finish. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Flows and screens\nVisual system\nDesign ready for build', false, true, 130, 'UI/UX Design | HK SoftTech', 'Interface design grounded in the task a person needs to finish.'),
('ai-chatbot', 'ai-automation', 'AI Chatbot Development', 'A chatbot scoped to questions your team can actually answer.', 'A chatbot scoped to questions your team can actually answer. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Conversation scope\nKnowledge source\nHandoff to a human', true, true, 10, 'AI Chatbot Development | HK SoftTech', 'A chatbot scoped to questions your team can actually answer.'),
('custom-gpt', 'ai-automation', 'Custom GPT Integration', 'A tailored assistant inside a product or internal workflow.', 'A tailored assistant inside a product or internal workflow. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Use-case definition\nPrompt and tool setup\nUsage boundaries', false, true, 20, 'Custom GPT Integration | HK SoftTech', 'A tailored assistant inside a product or internal workflow.'),
('ai-business-tools', 'ai-automation', 'AI-Powered Business Tools', 'Small internal tools that draft, sort or check work your team repeats.', 'Small internal tools that draft, sort or check work your team repeats. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'The repeated task\nA review step for people\nA narrow first version', true, true, 30, 'AI-Powered Business Tools | HK SoftTech', 'Small internal tools that draft, sort or check work your team repeats.'),
('whatsapp-automation', 'ai-automation', 'WhatsApp Automation', 'Structured WhatsApp replies and routing for enquiries you already receive.', 'Structured WhatsApp replies and routing for enquiries you already receive. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Message flows\nWhen a person should take over\nLogging of conversations', true, true, 40, 'WhatsApp Automation | HK SoftTech', 'Structured WhatsApp replies and routing for enquiries you already receive.'),
('workflow-automation', 'ai-automation', 'Workflow Automation', 'Connect steps that are currently copied between tools by hand.', 'Connect steps that are currently copied between tools by hand. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Current steps mapped\nAutomations with a stop condition\nA simple audit trail', true, true, 50, 'Workflow Automation | HK SoftTech', 'Connect steps that are currently copied between tools by hand.'),
('process-automation', 'ai-automation', 'Business Process Automation', 'Reduce manual effort in a named business process, not every process at once.', 'Reduce manual effort in a named business process, not every process at once. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Process chosen with you\nException handling\nStaff still in control', false, true, 60, 'Business Process Automation | HK SoftTech', 'Reduce manual effort in a named business process, not every process at once.'),
('ai-agents', 'ai-automation', 'AI Agents', 'An agent for a bounded job, with permissions you define.', 'An agent for a bounded job, with permissions you define. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Job boundary\nTools it may use\nHuman approval where needed', true, true, 70, 'AI Agents | HK SoftTech', 'An agent for a bounded job, with permissions you define.'),
('intelligent-assistants', 'ai-automation', 'Intelligent Assistants', 'Assistants that help a team draft, search or summarise inside a known context.', 'Assistants that help a team draft, search or summarise inside a known context. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Source material\nWhat the assistant must not do\nReview workflow', false, true, 80, 'Intelligent Assistants | HK SoftTech', 'Assistants that help a team draft, search or summarise inside a known context.'),
('data-processing-automation', 'ai-automation', 'Data Processing Automation', 'Turn repetitive file and data handling into a checked pipeline.', 'Turn repetitive file and data handling into a checked pipeline. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Input format\nValidation rules\nOutput your team can use', false, true, 90, 'Data Processing Automation | HK SoftTech', 'Turn repetitive file and data handling into a checked pipeline.'),
('aiml-integration', 'ai-automation', 'AI/ML Integration', 'Fit a model or AI API into software you already have.', 'Fit a model or AI API into software you already have. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Where it sits in the product\nFallback when it is unsure\nCost and latency discussed up front', false, true, 100, 'AI/ML Integration | HK SoftTech', 'Fit a model or AI API into software you already have.'),
('business-digital-presence', 'digital-presence', 'Business Digital Presence', 'A coherent public presence: site, profile and the way you describe the work.', 'A coherent public presence: site, profile and the way you describe the work. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Presence audit\nPriority fixes\nConsistent descriptions', true, true, 10, 'Business Digital Presence | HK SoftTech', 'A coherent public presence: site, profile and the way you describe the work.'),
('personal-branding', 'digital-presence', 'Personal Branding', 'Positioning for a student, freelancer or founder who needs to be understood quickly.', 'Positioning for a student, freelancer or founder who needs to be understood quickly. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Audience and offer\nProfile narrative\nWhat to publish first', false, true, 20, 'Personal Branding | HK SoftTech', 'Positioning for a student, freelancer or founder who needs to be understood quickly.'),
('portfolio-development', 'digital-presence', 'Portfolio Development', 'Structure and presentation of work samples you are willing to show.', 'Structure and presentation of work samples you are willing to show. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Project selection\nHow each piece is described\nA page or profile to host it', false, true, 30, 'Portfolio Development | HK SoftTech', 'Structure and presentation of work samples you are willing to show.'),
('linkedin-optimization', 'digital-presence', 'LinkedIn Profile Optimization', 'A clearer LinkedIn profile: headline, about, experience and featured work.', 'A clearer LinkedIn profile: headline, about, experience and featured work. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Profile rewrite\nFeatured section\nWhat not to claim', true, true, 40, 'LinkedIn Profile Optimization | HK SoftTech', 'A clearer LinkedIn profile: headline, about, experience and featured work.'),
('resume-design', 'digital-presence', 'Resume Design', 'A resume that is readable by a person and sensible for screening tools.', 'A resume that is readable by a person and sensible for screening tools. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Content edit\nLayout\nOne role target', false, true, 50, 'Resume Design | HK SoftTech', 'A resume that is readable by a person and sensible for screening tools.'),
('seo-setup', 'digital-presence', 'SEO Setup & Optimization', 'Technical and on-page foundations so the right pages can be found.', 'Technical and on-page foundations so the right pages can be found. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Indexation basics\nTitles and descriptions\nInternal links', true, true, 60, 'SEO Setup & Optimization | HK SoftTech', 'Technical and on-page foundations so the right pages can be found.'),
('google-business-profile', 'digital-presence', 'Google Business Profile Setup', 'A complete Google Business Profile for a real location or service area.', 'A complete Google Business Profile for a real location or service area. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Profile setup\nCategories and description\nPhoto and post guidance', false, true, 70, 'Google Business Profile Setup | HK SoftTech', 'A complete Google Business Profile for a real location or service area.'),
('social-media-creatives', 'digital-presence', 'Social Media Creatives', 'Posts, covers and simple templates matched to your brand.', 'Posts, covers and simple templates matched to your brand. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Sizes you actually use\nA small starter set\nFiles you can reuse', false, true, 80, 'Social Media Creatives | HK SoftTech', 'Posts, covers and simple templates matched to your brand.'),
('logo-design', 'digital-presence', 'Logo Design', 'A logo with a limited, usable set of versions.', 'A logo with a limited, usable set of versions. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Direction from your brief\nPrimary and compact marks\nFiles for web and print', false, true, 90, 'Logo Design | HK SoftTech', 'A logo with a limited, usable set of versions.'),
('brand-identity', 'digital-presence', 'Brand Identity Design', 'Colour, type and rules so later pages and posts feel like one company.', 'Colour, type and rules so later pages and posts feel like one company. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Visual direction\nCore assets\nShort usage notes', true, true, 100, 'Brand Identity Design | HK SoftTech', 'Colour, type and rules so later pages and posts feel like one company.'),
('banner-poster', 'digital-presence', 'Banner and Poster Design', 'Banners or posters for an event, offer or announcement.', 'Banners or posters for an event, offer or announcement. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Size and placement\nCopy you approve\nPrint or digital file', false, true, 110, 'Banner and Poster Design | HK SoftTech', 'Banners or posters for an event, offer or announcement.'),
('business-card', 'digital-presence', 'Business Card Design', 'A card that matches the identity and stays readable at small size.', 'A card that matches the identity and stays readable at small size. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Front and back\nPrint-ready file', false, true, 120, 'Business Card Design | HK SoftTech', 'A card that matches the identity and stays readable at small size.'),
('presentation-design', 'digital-presence', 'Presentation Design', 'A deck structured for a pitch, class or client meeting.', 'A deck structured for a pitch, class or client meeting. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Narrative order\nSlide design\nEditable file', false, true, 130, 'Presentation Design | HK SoftTech', 'A deck structured for a pitch, class or client meeting.'),
('web-development-training', 'training-career', 'Web Development Training', 'Hands-on web training for students or teams starting from a real project.', 'Hands-on web training for students or teams starting from a real project. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'HTML, CSS and JavaScript fundamentals\nA small build exercise\nHow to continue after the session', true, true, 10, 'Web Development Training | HK SoftTech', 'Hands-on web training for students or teams starting from a real project.'),
('python-workshops', 'training-career', 'Python & Programming Workshops', 'Workshops that teach programming by writing and reviewing code.', 'Workshops that teach programming by writing and reviewing code. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Level matched to the group\nExercises\nTakeaway references', false, true, 20, 'Python & Programming Workshops | HK SoftTech', 'Workshops that teach programming by writing and reviewing code.'),
('ai-tools-training', 'training-career', 'AI Tools Training', 'Practical use of AI tools, including where they fail and how to check the output.', 'Practical use of AI tools, including where they fail and how to check the output. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Tools relevant to the group\nPrompt practice\nReview habits', true, true, 30, 'AI Tools Training | HK SoftTech', 'Practical use of AI tools, including where they fail and how to check the output.'),
('prompt-engineering', 'training-career', 'Prompt Engineering', 'How to brief an AI system clearly for a specific kind of work.', 'How to brief an AI system clearly for a specific kind of work. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Task framing\nExamples\nLimits of prompting', false, true, 40, 'Prompt Engineering | HK SoftTech', 'How to brief an AI system clearly for a specific kind of work.'),
('data-analytics-training', 'training-career', 'Data Analytics Training', 'Spreadsheets through to clearer analysis, scoped to the group''s data.', 'Spreadsheets through to clearer analysis, scoped to the group''s data. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Questions worth asking\nCleaning and charts\nWhat a chart does not prove', false, true, 50, 'Data Analytics Training | HK SoftTech', 'Spreadsheets through to clearer analysis, scoped to the group''s data.'),
('aiml-training', 'training-career', 'AI/ML Training', 'An introductory or intermediate session on machine learning concepts and use.', 'An introductory or intermediate session on machine learning concepts and use. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Concepts before tools\nA worked example\nFurther study path', false, true, 60, 'AI/ML Training | HK SoftTech', 'An introductory or intermediate session on machine learning concepts and use.'),
('git-github-training', 'training-career', 'Git & GitHub Training', 'Version control for students and teams who need a shared history of work.', 'Version control for students and teams who need a shared history of work. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Commits and branches\nGitHub workflow\nA practice repository', false, true, 70, 'Git & GitHub Training | HK SoftTech', 'Version control for students and teams who need a shared history of work.'),
('college-workshops', 'training-career', 'College Workshops', 'Campus sessions planned with faculty around a skill the students can practice.', 'Campus sessions planned with faculty around a skill the students can practice. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Agenda agreed with the college\nSession delivery\nOptional follow-up format', true, true, 80, 'College Workshops | HK SoftTech', 'Campus sessions planned with faculty around a skill the students can practice.'),
('faculty-development', 'training-career', 'Faculty Development Programs', 'Sessions for educators who want to teach or use a technology with more confidence.', 'Sessions for educators who want to teach or use a technology with more confidence. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Topic chosen with the department\nHands-on blocks\nMaterials they can reuse', false, true, 90, 'Faculty Development Programs | HK SoftTech', 'Sessions for educators who want to teach or use a technology with more confidence.'),
('corporate-training', 'training-career', 'Corporate Technology Training', 'Training for a team adopting a tool, a workflow or an AI practice.', 'Training for a team adopting a tool, a workflow or an AI practice. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Role of the audience\nExercises from their context\nA short recap', false, true, 100, 'Corporate Technology Training | HK SoftTech', 'Training for a team adopting a tool, a workflow or an AI practice.'),
('resume-building', 'training-career', 'Resume Building', 'Help shaping a resume around a target role.', 'Help shaping a resume around a target role. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Content review\nStructure\nOne polished version', false, true, 110, 'Resume Building | HK SoftTech', 'Help shaping a resume around a target role.'),
('mock-interviews', 'training-career', 'Mock Interviews', 'A practice interview with direct feedback.', 'A practice interview with direct feedback. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Role-specific questions\nNotes after the session\nWhat to improve next', false, true, 120, 'Mock Interviews | HK SoftTech', 'A practice interview with direct feedback.'),
('internship-guidance', 'training-career', 'Internship Guidance', 'Advice on where to look, how to apply and how to present student work.', 'Advice on where to look, how to apply and how to present student work. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Search plan\nApplication materials\nHonest feedback', false, true, 130, 'Internship Guidance | HK SoftTech', 'Advice on where to look, how to apply and how to present student work.'),
('career-consulting', 'training-career', 'Career Consulting', 'A structured conversation about direction, skills and next steps.', 'A structured conversation about direction, skills and next steps. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Current position\nOptions\nA short action list', true, true, 140, 'Career Consulting | HK SoftTech', 'A structured conversation about direction, skills and next steps.'),
('portfolio-reviews', 'training-career', 'Portfolio Reviews', 'A review of a portfolio with specific changes, not vague encouragement.', 'A review of a portfolio with specific changes, not vague encouragement. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'What a reviewer sees first\nGaps\nPriority edits', false, true, 150, 'Portfolio Reviews | HK SoftTech', 'A review of a portfolio with specific changes, not vague encouragement.'),
('it-consulting', 'consulting-support', 'IT Consulting', 'Practical advice on tools, hosting and technical choices.', 'Practical advice on tools, hosting and technical choices. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Current setup\nRisks\nRecommended next step', false, true, 10, 'IT Consulting | HK SoftTech', 'Practical advice on tools, hosting and technical choices.'),
('technology-consulting', 'consulting-support', 'Technology Consulting', 'Help deciding what to build, buy or leave alone.', 'Help deciding what to build, buy or leave alone. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Goals and constraints\nOptions compared\nA written recommendation', true, true, 20, 'Technology Consulting | HK SoftTech', 'Help deciding what to build, buy or leave alone.'),
('website-audits', 'consulting-support', 'Website Audits', 'A review of content, speed, SEO basics and the enquiry path.', 'A review of content, speed, SEO basics and the enquiry path. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Findings ordered by impact\nWhat is working\nWhat to fix first', true, true, 30, 'Website Audits | HK SoftTech', 'A review of content, speed, SEO basics and the enquiry path.'),
('architecture-planning', 'consulting-support', 'Software Architecture Planning', 'A plan for structure before a large build starts.', 'A plan for structure before a large build starts. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Boundaries of the system\nData and integrations\nA phased build order', false, true, 40, 'Software Architecture Planning | HK SoftTech', 'A plan for structure before a large build starts.'),
('ai-adoption-consulting', 'consulting-support', 'AI Adoption Consulting', 'Where AI will help a team, and where it should not be forced in.', 'Where AI will help a team, and where it should not be forced in. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Tasks worth automating\nRisks and review\nA pilot, not a slogan', true, true, 50, 'AI Adoption Consulting | HK SoftTech', 'Where AI will help a team, and where it should not be forced in.'),
('digital-transformation', 'consulting-support', 'Digital Transformation Strategy', 'A grounded plan to move a specific process or offer online.', 'A grounded plan to move a specific process or offer online. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Current process\nTarget process\nFirst project to fund', false, true, 60, 'Digital Transformation Strategy | HK SoftTech', 'A grounded plan to move a specific process or offer online.'),
('website-maintenance', 'consulting-support', 'Website Maintenance', 'Ongoing updates so a site stays accurate and usable.', 'Ongoing updates so a site stays accurate and usable. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'What is included\nHow requests are sent\nWhat sits outside the plan', true, true, 70, 'Website Maintenance | HK SoftTech', 'Ongoing updates so a site stays accurate and usable.'),
('website-backups', 'consulting-support', 'Website Backups', 'Backup setup and a check that a restore is possible.', 'Backup setup and a check that a restore is possible. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'What is backed up\nHow often\nA restore test', false, true, 80, 'Website Backups | HK SoftTech', 'Backup setup and a check that a restore is possible.'),
('security-updates', 'consulting-support', 'Security Updates', 'Dependency, platform and configuration updates on an agreed cadence.', 'Dependency, platform and configuration updates on an agreed cadence. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Update scope\nWhat we will not touch blindly\nNotes after each pass', false, true, 90, 'Security Updates | HK SoftTech', 'Dependency, platform and configuration updates on an agreed cadence.'),
('performance-optimization', 'consulting-support', 'Performance Optimization', 'Make a slow page or flow faster, measured before and after on that page.', 'Make a slow page or flow faster, measured before and after on that page. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Baseline\nChanges\nThe result on the pages we touched', false, true, 100, 'Performance Optimization | HK SoftTech', 'Make a slow page or flow faster, measured before and after on that page.'),
('technical-support', 'consulting-support', 'Technical Support', 'A named channel for break-fix help on systems we agree to cover.', 'A named channel for break-fix help on systems we agree to cover. Work starts after the scope is agreed. Nothing on this page is a client result or a guaranteed outcome.', 'Hours and channel\nWhat is covered\nHow urgent issues are flagged', false, true, 110, 'Technical Support | HK SoftTech', 'A named channel for break-fix help on systems we agree to cover.');
insert into faqs (question, answer, sort_order, published) values
('What services does HK SoftTech provide?', 'HK SoftTech works across software and web development, AI and automation, digital presence and design, training and career support, and technology consulting. Individual services are listed on the Services page and can be scoped together when a project needs more than one.', 10, true),
('Does HK SoftTech build custom websites?', 'Yes. Business sites, portfolios, landing pages and simpler web applications are core work. The right shape depends on the content you have and the action you want a visitor to take.', 20, true),
('Do you develop AI solutions?', 'Yes, when there is a defined task: a chatbot, a workflow, an internal tool or an assistant with a clear boundary. We do not recommend AI where a form or a checklist would do the job.', 30, true),
('Do you provide custom software?', 'Yes. CRM, inventory, billing, attendance and other operational tools are scoped from the process you already run. A first version is preferred over a system that tries to cover every department on day one.', 40, true),
('How are project timelines decided?', 'After a short discovery conversation. A focused website is often a matter of weeks. Custom software and AI work depend on integrations, content and how decisions get made. You receive a written estimate before build work starts. We do not publish a universal timeline.', 50, true),
('How does pricing work?', 'There is no single public rate. Price follows scope: pages, features, training days or a support plan. Share a budget range on the enquiry form if you have one. If a request does not fit the budget, we will say so.', 60, true),
('Do you train students, colleges and companies?', 'Yes. Workshops can be arranged for a campus, a faculty group or a company team. Topics include web development, Git and GitHub, AI tools, analytics and interview preparation. The agenda is agreed before the session.', 70, true),
('Do you maintain websites after launch?', 'Yes. Maintenance, backups, security updates and performance work are available as separate support. They are agreed explicitly so ownership after launch is clear.', 80, true),
('How do I start a project?', 'Use Start a Project on this website, or message the studio on WhatsApp. Tell us who the work is for and what should change. You will get a reference number when the enquiry is saved, and the team follows up on the contact method you choose.', 90, true);
insert into training_programs (slug, title, summary, audience, schedule, published, sort_order) values
('web-development-training', 'Web Development Training', 'A practical introduction to building on the web, taught around a small project.', 'Students and career switchers', 'Scheduled with the group', true, 10),
('ai-tools-training', 'AI Tools Training', 'How to use current AI tools carefully, with review habits included.', 'Students, professionals and teams', 'Scheduled with the group', true, 20),
('college-workshops', 'College Workshops', 'Campus workshops planned with faculty.', 'College students and departments', 'On the college calendar', true, 30),
('corporate-training', 'Corporate Technology Training', 'Role-focused sessions for teams adopting a tool or an AI workflow.', 'Companies and institutions', 'Scheduled with the team', true, 40),
('career-consulting', 'Career Consulting Clinics', 'Resume, portfolio and interview conversations for people preparing to apply.', 'Students and early-career professionals', 'By appointment', true, 50);
insert into projects (slug, title, summary, body, category, stack, featured, published, sort_order, meta_title, meta_description) values
('hk-certifier', 'HK Certifier', 'A studio product for issuing and checking certificates.', 'HK Certifier is a named HK SoftTech product for certificate workflows. A public URL, screenshots and any measured results are added here by the team only when they are ready to share. This page does not invent them.', 'Product', '', true, true, 10, 'HK Certifier | HK SoftTech', 'A studio product for issuing and checking certificates.'),
('hk-pnr-checker', 'HK PNR Checker', 'A utility associated with the studio for checking PNR status.', 'HK PNR Checker is listed as a studio project. Travel data, uptime and user counts are not published here because they have not been verified for this website.', 'Utility', '', true, true, 20, 'HK PNR Checker | HK SoftTech', 'A utility associated with the studio for checking PNR status.'),
('smart-crop-protection', 'Smart Crop Protection System', 'A named studio project in crop protection.', 'This record exists so the work can be described accurately by the team. It is not presented as a commercial product with field results, and IoT or embedded claims are added only with evidence.', 'Applied systems', '', true, true, 30, 'Smart Crop Protection System | HK SoftTech', 'A named studio project in crop protection.'),
('ai-chatbot-project', 'AI Chatbot', 'Chatbot work delivered as a studio capability, not as a named client case.', 'This entry refers to chatbot implementation as a type of work HK SoftTech takes on. It is not a client testimonial and it does not claim a deployment you cannot click through. Add a live URL from the studio when one should be public.', 'AI', '', true, true, 40, 'AI Chatbot | HK SoftTech', 'Chatbot work delivered as a studio capability, not as a named client case.'),
('portfolio-website-projects', 'Portfolio Website Projects', 'Websites built to present a person''s or a studio''s work.', 'Portfolio sites are a regular service. Individual client sites are added to this portfolio only with permission and a real link. Until then this entry describes the kind of work, not a fabricated gallery.', 'Web', '', true, true, 50, 'Portfolio Website Projects | HK SoftTech', 'Websites built to present a person''s or a studio''s work.');
insert into posts (slug, title, excerpt, body, category, tags, status, meta_title, meta_description, published_at) values (
'how-an-engagement-starts', 'How an engagement starts', 'What happens after you contact HK SoftTech, from the first conversation to handover.', 'A project at HK SoftTech starts with a conversation, not a package pulled off a shelf.

Discover. We ask who the work is for, what should be different when it is finished, and what already exists. A website, a chatbot, a workshop and a custom tool do not share a template timeline.

Strategize. We recommend a scope small enough to finish and clear enough to review. If something should wait for a later phase, we say so.

Develop. Design and build happen against that scope. You see progress at agreed checkpoints rather than at the end only.

Deliver and support. Handover includes how to request changes. Ongoing maintenance, backups or training are separate agreements, so the responsibility after launch is explicit.

An enquiry on this website creates a reference number and a record the studio can reply to. It is not itself a contract.', 'Studio', 'process, projects', 'published', 'How an engagement starts | HK SoftTech', 'How HK SoftTech scopes, builds and hands over a project.', now());
