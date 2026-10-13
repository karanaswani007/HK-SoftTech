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

The admin page separates Home, Services, Portfolio, FAQs, and Contact & social into selectable categories, so only the selected page's fields are shown. It can add, edit, remove, and reorder services, FAQs, portfolio items, and social links. Each portfolio item is assigned to one of the saved services. Portfolio images can be uploaded as JPG, PNG, WebP, or GIF files up to 2 MB each (about 2.5 MB total); they are stored with the portfolio content in PostgreSQL. Portfolio items can include a live demo URL; source-code links are not displayed.

The CMS stores content in PostgreSQL through Neon. Prisma uses the pooled `DATABASE_URL` at runtime and `DIRECT_URL` for schema commands. Apply `npm run db:push` after pulling a schema update. Admin saves replace the FAQ and service lists with the submitted content; existing services keep their page URL unless their slug is changed.

Switching from MySQL to Neon creates a new database; `npm run db:push` creates the schema but does not copy existing MySQL records. Export/import any data you need to keep before switching production traffic.
