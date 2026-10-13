import { NextResponse } from "next/server";
import { z } from "zod";

import { adminSessionCookie, adminSessionOptions, createAdminSession, passwordsMatch } from "@/lib/admin-auth";
import { hasSameOrigin } from "@/lib/admin-request";

const loginSchema = z.object({ password: z.string().min(1).max(1024) });

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    return NextResponse.json({ error: "Admin access is not configured on the server." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid login request." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success || !passwordsMatch(parsed.data.password, expectedPassword)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(adminSessionCookie, createAdminSession(expectedPassword), adminSessionOptions);
  return response;
}
