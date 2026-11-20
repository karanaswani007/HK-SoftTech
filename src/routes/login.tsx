import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { studioLogin, studioSession } from "@/lib/hk/studio-fns";
import { errText } from "@/lib/hk/row";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Studio sign in | HK SoftTech" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const status = useServerFn(studioSession);
  const login = useServerFn(studioLogin);
  const [phase, setPhase] = useState<"check" | "in" | "out">("check");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let live = true;
    status()
      .then((value) => {
        if (live) setPhase(value.signedIn ? "in" : "out");
      })
      .catch(() => {
        if (live) setPhase("out");
      });
    return () => {
      live = false;
    };
  }, [status]);

  if (phase === "in") return <Navigate to="/admin" />;

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-4 py-10">
      <form
        className="w-full max-w-sm rounded-2xl border border-line bg-card p-6 sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          setPending(true);
          setError("");
          login({ data: { password } })
            .then((result) => {
              if (result.ok) setPhase("in");
              else setError(result.error);
            })
            .catch((reason) => setError(errText(reason)))
            .finally(() => setPending(false));
        }}
      >
        <p className="text-xs font-semibold tracking-wide text-accent uppercase">HK SoftTech</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Studio</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Staff only. Enter the studio password.</p>
        {phase === "check" ? <p className="mt-6 text-sm text-muted">Checking session…</p> : null}
        <label className="mt-6 block text-sm font-medium" htmlFor="studio-password">
          Password
        </label>
        <input
          id="studio-password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-3 text-base text-ink"
        />
        {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
        <button
          type="submit"
          disabled={pending || phase === "check"}
          className="mt-5 w-full rounded-full bg-navy px-4 py-3 text-sm font-semibold text-on-navy disabled:opacity-60"
        >
          {pending ? "Checking…" : "Enter studio"}
        </button>
      </form>
    </main>
  );
}
