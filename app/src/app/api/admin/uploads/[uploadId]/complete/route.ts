import { NextResponse } from "next/server";
import { z } from "zod";

import { hasAdminSession } from "@/lib/admin-auth";
import { hasSameOrigin } from "@/lib/admin-request";
import { prisma } from "@/lib/db";

const uploadIdSchema = z.uuid();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ uploadId: string }> },
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

  const { uploadId } = await params;
  if (!uploadIdSchema.safeParse(uploadId).success) {
    return NextResponse.json({ error: "Invalid image upload ID." }, { status: 400 });
  }

  try {
    const image = await prisma.$transaction(async (transaction) => {
      const upload = await transaction.portfolioImageUpload.findUnique({
        where: { id: uploadId },
        include: { chunks: { orderBy: { index: "asc" } } },
      });
      if (!upload) {
        throw new Error("Image upload was not found or has expired.");
      }
      if (
        upload.chunks.length !== upload.totalChunks ||
        upload.chunks.some((chunk, index) => chunk.index !== index)
      ) {
        throw new Error("Image upload is incomplete. Please retry the upload.");
      }

      const data = Buffer.concat(upload.chunks.map((chunk) => chunk.data));
      const savedImage = await transaction.portfolioImage.create({
        data: { mimeType: upload.mimeType, data },
        select: { id: true },
      });
      await transaction.portfolioImageUpload.delete({ where: { id: uploadId } });
      return savedImage;
    });

    return NextResponse.json({ imageUrl: `/api/portfolio/images/${image.id}` });
  } catch (error) {
    if (error instanceof Error && (
      error.message === "Image upload was not found or has expired." ||
      error.message === "Image upload is incomplete. Please retry the upload."
    )) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Unable to finalize portfolio image upload:", error);
    return NextResponse.json({ error: "Unable to finish image upload." }, { status: 500 });
  }
}
