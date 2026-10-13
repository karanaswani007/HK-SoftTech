import { AdminPanel, LoginForm } from "@/components/admin/AdminPanel";
import { hasAdminSession } from "@/lib/admin-auth";
import { getAdminContent, type AdminContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const configured = Boolean(process.env.ADMIN_PASSWORD);
  const authenticated = configured && (await hasAdminSession());

  if (!configured) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <h1 className="text-xl font-bold">Admin password is not configured</h1>
          <p className="mt-2 text-sm leading-6">Set a strong ADMIN_PASSWORD in the app&apos;s .env file, then restart the server.</p>
        </div>
      </section>
    );
  }

  if (!process.env.DATABASE_URL) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <h1 className="text-xl font-bold">Database is not configured</h1>
          <p className="mt-2 text-sm leading-6">Set DATABASE_URL in the app&apos;s .env file and apply the Prisma schema with <code>npm run db:push</code>.</p>
        </div>
      </section>
    );
  }

  if (!authenticated) {
    return <LoginForm />;
  }

  let content: AdminContent;
  try {
    content = await getAdminContent();
  } catch (error) {
    console.error("Unable to open admin content:", error);
    return (
      <section className="mx-auto max-w-2xl px-4 py-20">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
          <h1 className="text-xl font-bold">Could not load website content</h1>
          <p className="mt-2 text-sm leading-6">Check your DATABASE_URL and apply the Prisma schema with <code>npm run db:push</code>.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AdminPanel initialContent={content} />
    </section>
  );
}
