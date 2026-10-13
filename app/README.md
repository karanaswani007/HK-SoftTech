# HK SoftTech website

## Run locally

1. Install dependencies with `npm install`.
2. Create `app/.env` from `.env.example`. In Neon, copy both connection strings from your project:
   - Put Neon’s **pooled** connection string in `DATABASE_URL`.
   - Put Neon’s **direct** connection string in `DIRECT_URL`.
   - Keep `sslmode=require` on both URLs and set a strong admin password.

   ```dotenv
   DATABASE_URL="postgresql://USER:PASSWORD@YOUR-NEON-POOLER-HOST/DBNAME?sslmode=require"
   DIRECT_URL="postgresql://USER:PASSWORD@YOUR-NEON-HOST/DBNAME?sslmode=require"
   ADMIN_PASSWORD="use-a-long-unique-password"
   ```

3. Apply the database schema and generate the Prisma client:

   ```bash
   npm run prisma:generate
   npm run db:push
   ```

4. Start the website with `npm run dev`.
5. Open `http://localhost:3000/admin` and sign in with `ADMIN_PASSWORD`.

Keep `.env` private; environment files are ignored by Git. Use HTTPS in production so the admin session cookie is secure. The checked-in `.env.example` contains placeholders only.

## Admin editor

The admin page edits the home-page hero, company summary, service and FAQ headings, call to action, existing service cards and detail-page copy, FAQs, contact details, and social links. Save changes to publish them to the public website. Existing design, layout, and service URLs stay unchanged.

The CMS stores content in PostgreSQL through Neon. Prisma uses the pooled `DATABASE_URL` at runtime and `DIRECT_URL` for schema commands. Apply `npm run db:push` after pulling a schema update. Admin saves replace the FAQ list and update existing services by their established slugs.

Switching from MySQL to Neon creates a new database; `npm run db:push` creates the schema but does not copy existing MySQL records. Export/import any data you need to keep before switching production traffic.
