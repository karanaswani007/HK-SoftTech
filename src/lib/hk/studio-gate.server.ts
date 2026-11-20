import { createHmac, timingSafeEqual } from "node:crypto";
import { deleteCookie, getCookie, getRequestProtocol, setCookie } from "@tanstack/react-start/server";

const COOKIE = "hk_studio";
const MAX_AGE = 60 * 60 * 12;

function expectedPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

function sign(exp: number) {
  const body = String(exp);
  const sig = createHmac("sha256", expectedPassword()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function checkPassword(input: string): "ok" | "bad" | "unset" {
  const expected = expectedPassword();
  if (!expected) return "unset";
  const given = Buffer.from(input);
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length) {
    timingSafeEqual(wanted, wanted);
    return "bad";
  }
  return timingSafeEqual(given, wanted) ? "ok" : "bad";
}

export function verifyStudioToken(token: string | undefined) {
  if (!expectedPassword() || !token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", expectedPassword()).update(body).digest("base64url");
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false;
  const exp = Number(body);
  return Number.isFinite(exp) && exp > Math.floor(Date.now() / 1000);
}

export function readStudioCookie() {
  return verifyStudioToken(getCookie(COOKIE));
}

export function writeStudioCookie() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  setCookie(COOKIE, sign(exp), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: getRequestProtocol() === "https",
    maxAge: MAX_AGE,
  });
}

export function clearStudioCookie() {
  deleteCookie(COOKIE, { path: "/" });
}
