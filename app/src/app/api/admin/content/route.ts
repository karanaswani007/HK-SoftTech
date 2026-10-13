import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { hasAdminSession } from "@/lib/admin-auth";
import { hasSameOrigin } from "@/lib/admin-request";
import { adminContentSchema, getAdminContent, saveAdminContent } from "@/lib/cms";

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database connection is not configured." }, { status: 503 });
  }

  try {
    return NextResponse.json(await getAdminContent());
  } catch (error) {
    console.error("Unable to load admin content:", error);
    return NextResponse.json({ error: "Unable to load website content." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database connection is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid website content." }, { status: 400 });
  }

  const parsed = adminContentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the website content fields and try again.", details: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    await saveAdminContent(parsed.data);
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/faq");
    revalidatePath("/contact");
    for (const service of parsed.data.services) {
      const href = service.slug === "design-services" ? "/design" : `/${service.slug}`;
      revalidatePath(href);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unable to save admin content:", error);
    return NextResponse.json({ error: "Unable to save website content." }, { status: 500 });
  }
}
