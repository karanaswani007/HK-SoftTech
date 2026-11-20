# HK SoftTech

Public website and private studio for HK SoftTech.

The public site presents services, solutions, portfolio, training and a project enquiry form. The studio at `/admin` is where staff edit that content, review leads and keep internal delivery records.

## What is real

- Company name, tagline, phone and founder are the details supplied for HK SoftTech.
- The header uses the original logo file. It is not recolored.
- Portfolio entries are named studio projects. They do not include screenshots, client names or performance numbers unless someone adds a real image or link in the studio.
- Testimonials start empty. A quote is public only after it is marked approved and published.
- Enquiry emails are stored, not sent. Outbound mail is not connected, so the studio never pretends a message was delivered.

## Studio access

The studio is the link in the footer. It opens only with the password in the server environment variable `ADMIN_PASSWORD`. That value is not written into the site, and it is not a public setting. Configure a strong password in the host environment before deployment; if it is missing, studio sign-in stays disabled. There is no built-in or fallback password. Sessions last 12 hours.

See [.env.example](./.env.example) for the environment variable names used by the app. It contains placeholders only; configure real credentials through your local process or deployment secret store.

When configuring a Grok auth client, register the Better Auth callback URLs `/api/auth/callback/grok-google` and `/api/auth/callback/grok-x`.

There is no social sign-in and no public registration for the studio. The password holder is Super Admin.

## Content you can change without code

Services, portfolio, enquiries, internal projects, training, testimonials, articles, FAQs, homepage and about copy, policies, media, SEO fields, company contact details and staff roles.

## Stack note

This app runs on the platform it is published with: React, TanStack Start, TypeScript, Tailwind, Postgres and signed-in sessions. It is not a Next.js, Supabase, Prisma or Resend project. Those services are not available in this environment, and wiring them would stop the live site from running. Database migrations live in `migrations/` and apply on publish. Secrets are injected for the deployment; they are not stored in the repository.
