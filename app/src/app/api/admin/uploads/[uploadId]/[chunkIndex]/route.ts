import { NextResponse } from "next/server";
import { z } from "zod";

import { hasAdminSession } from "@/lib/admin-auth";
import { hasSameOrigin } from "@/lib/admin-request";
import { portfolioImageChunkSize } from "@/lib/portfolio-image-upload";
import { prisma } from "@/lib/db";

const uploadIdSchema = z.uuid();
const chunkIndexSchema = z.coerce.number().int().min(0).max(2_147_483_646);

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ uploadId: string; chunkIndex: string }> },
) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database connection is not configured." }, { status: 503 });
  }

  const { uploadId, chunkIndex: rawChunkIndex } = await params;
  const parsedUploadId = uploadIdSchema.safeParse(uploadId);
  const parsedChunkIndex = chunkIndexSchema.safeParse(rawChunkIndex);
  if (!parsedUploadId.success || !parsedChunkIndex.success) {
    return NextResponse.json({ error: "Invalid image chunk address." }, { status: 400 });
  }

  const chunk = Buffer.from(await request.arrayBuffer());
  if (chunk.length === 0 || chunk.length > portfolioImageChunkSize) {
    return NextResponse.json({ error: "Invalid image chunk size." }, { status: 400 });
  }

  try {
    const upload = await prisma.portfolioImageUpload.findUnique({ where: { id: uploadId } });
    if (!upload || parsedChunkIndex.data >= upload.totalChunks) {
      return NextResponse.json({ error: "Image upload was not found or has expired." }, { status: 404 });
    }

    await prisma.portfolioImageChunk.upsert({
      where: { uploadId_index: { uploadId, index: parsedChunkIndex.data } },
      create: { uploadId, index: parsedChunkIndex.data, data: chunk },
      update: { data: chunk },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unable to save portfolio image chunk:", error);
    return NextResponse.json({ error: "Unable to save image chunk." }, { status: 500 });
  }
}
