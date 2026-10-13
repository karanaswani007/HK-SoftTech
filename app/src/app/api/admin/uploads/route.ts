import { NextResponse } from "next/server";
import { z } from "zod";

import { hasAdminSession } from "@/lib/admin-auth";
import { hasSameOrigin } from "@/lib/admin-request";
import { prisma } from "@/lib/db";

const uploadSchema = z.object({
  id: z.uuid(),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  totalChunks: z.number().int().min(1).max(2_147_483_647),
});

export async function POST(request: Request) {
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
    return NextResponse.json({ error: "Invalid image upload request." }, { status: 400 });
  }

  const parsed = uploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid image upload details." }, { status: 400 });
  }

  try {
    await prisma.$transaction([
      prisma.portfolioImageUpload.deleteMany({
        where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
      prisma.portfolioImageUpload.create({ data: parsed.data }),
    ]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unable to initialize portfolio image upload:", error);
    return NextResponse.json({ error: "Unable to initialize image upload." }, { status: 500 });
  }
}
