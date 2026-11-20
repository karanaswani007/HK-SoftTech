import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AccessProvider, AdminFrame, type Access } from "@/components/admin/frame";
import { getAccess } from "@/lib/hk/admin-fns";
import { studioSession } from "@/lib/hk/studio-fns";
import { errText } from "@/lib/hk/row";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Studio | HK SoftTech" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const status = useServerFn(studioSession);
  const load = useServerFn(getAccess);
  const [access, setAccess] = useState<Access | null>(null);
  const [error, setError] = useState("");
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    let live = true;
    status()
      .then(async (session) => {
        if (!live) return;
        if (!session.signedIn) {
          setSignedOut(true);
          return;
        }
        const value = await load();
        if (live) setAccess(value);
      })
      .catch((reason) => {
        if (live) setError(errText(reason));
      });
    return () => {
      live = false;
    };
  }, [load, status]);

  if (signedOut) return <Navigate to="/login" />;
  if (error) {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <p className="max-w-md text-sm">{error}</p>
      </main>
    );
  }
  if (!access) {
    return (
      <main className="grid min-h-screen place-items-center bg-paper">
        <p className="text-sm text-muted">Opening the studio…</p>
      </main>
    );
  }
  return (
    <AccessProvider value={access}>
      <AdminFrame>
        <Outlet />
      </AdminFrame>
    </AccessProvider>
  );
}
