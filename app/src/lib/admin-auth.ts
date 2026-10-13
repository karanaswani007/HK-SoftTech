import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminSessionCookie = "hksofttech_admin_session";
const sessionDurationSeconds = 60 * 60 * 8;

function sign(expiration: string, password: string) {
  return createHmac("sha256", password).update(expiration).digest("hex");
}

export function passwordsMatch(provided: string, expected: string) {
  const providedHash = createHash("sha256").update(provided).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(providedHash, expectedHash);
}

export function createAdminSession(password: string) {
  const expiration = String(Math.floor(Date.now() / 1000) + sessionDurationSeconds);
  return `${expiration}.${sign(expiration, password)}`;
}

export async function hasAdminSession() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return false;
  }

  const token = (await cookies()).get(adminSessionCookie)?.value;
  const [expiration, signature, extra] = token?.split(".") ?? [];
  if (!expiration || !signature || extra || !/^\d+$/.test(expiration)) {
    return false;
  }

  if (Number(expiration) <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expected = sign(expiration, password);
  const actualBytes = Buffer.from(signature, "hex");
  const expectedBytes = Buffer.from(expected, "hex");

  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

export const adminSessionOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: sessionDurationSeconds,
};
