import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function db() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

export const studioSession = createServerFn({ method: "GET" }).handler(async () => {
  const { readStudioCookie } = await import("./studio-gate.server");
  return { signedIn: readStudioCookie() };
});

export const studioLogin = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ password: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    const sql = await db();
    const recent = await sql<{ n: number }>`
      select count(*)::int as n from enquiry_throttle
      where fingerprint = 'studio-login' and created_at > now() - interval '15 minutes'
    `;
    if (Number(recent[0]?.n ?? 0) >= 8) {
      return { ok: false as const, error: "Too many attempts. Wait a few minutes and try again." };
    }
    const { checkPassword, writeStudioCookie } = await import("./studio-gate.server");
    const result = checkPassword(data.password);
    if (result === "unset") {
      return { ok: false as const, error: "The studio password is not configured yet." };
    }
    if (result !== "ok") {
      await sql`insert into enquiry_throttle (fingerprint) values ('studio-login')`;
      return { ok: false as const, error: "That password is not correct." };
    }
    writeStudioCookie();
    return { ok: true as const, error: "" };
  });

export const studioLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { clearStudioCookie } = await import("./studio-gate.server");
  clearStudioCookie();
  return { ok: true as const };
});
