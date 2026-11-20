alter table site_settings
  add column if not exists founder_image_url text not null default '',
  add column if not exists founder_website_url text not null default '',
  add column if not exists founder_linkedin_url text not null default '',
  add column if not exists founder_instagram_url text not null default '',
  add column if not exists founder_github_url text not null default '',
  add column if not exists founder_x_url text not null default '';

create table if not exists public_team_members (
  id bigserial primary key,
  name text not null,
  role text not null,
  bio text not null default '',
  image_url text not null default '',
  website_url text not null default '',
  linkedin_url text not null default '',
  instagram_url text not null default '',
  github_url text not null default '',
  x_url text not null default '',
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists public_team_members_published_order_idx
  on public_team_members (published, sort_order, id);

update site_settings
set founder_bio = 'Karan R. Aswani founded HK SoftTech and leads the studio as Founder and CEO. The studio works across software and websites, AI and automation, digital presence, practical training, and technology consulting.'
where id = 1
  and founder_bio = 'Karan R. Aswani founded HK SoftTech and leads the studio as Founder and CEO. This site does not add a biography, headcount, founding year or awards beyond what the studio chooses to publish.';
