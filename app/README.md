# HK SoftTech website

## Run locally

1. Install dependencies with `npm install`.
2. Create `app/.env` and configure your MySQL connection and admin password:

   ```dotenv
   DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
   ADMIN_PASSWORD="use-a-long-unique-password"
   ```

3. Apply the database schema and generate the Prisma client:

   ```bash
   npm run db:push
   npm run prisma:generate
   ```

4. Start the website with `npm run dev`.
5. Open `http://localhost:3000/admin` and sign in with `ADMIN_PASSWORD`.

Keep `.env` private; environment files are ignored by Git. Use HTTPS in production so the admin session cookie is secure.

## Admin editor

The admin page edits the home-page hero, company summary, service and FAQ headings, call to action, existing service cards and detail-page copy, FAQs, contact details, and social links. Save changes to publish them to the public website. Existing design, layout, and service URLs stay unchanged.

The CMS stores content in the existing MySQL database. Apply `npm run db:push` after pulling a schema update. Admin saves replace the FAQ list and update existing services by their established slugs.
