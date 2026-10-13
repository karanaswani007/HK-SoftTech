import { NextResponse } from "next/server";

import { adminSessionCookie, adminSessionOptions } from "@/lib/admin-auth";
import { hasSameOrigin } from "@/lib/admin-request";

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(adminSessionCookie, "", { ...adminSessionOptions, maxAge: 0 });
  return response;
}
