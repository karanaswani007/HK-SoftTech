import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

const imageIdSchema = z.string().cuid();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ imageId: string }> },
) {
  const { imageId } = await params;
  if (!imageIdSchema.safeParse(imageId).success) {
    return new NextResponse("Image not found.", { status: 404 });
  }

  if (!process.env.DATABASE_URL) {
    return new NextResponse("Image storage is not configured.", { status: 503 });
  }

  try {
    const image = await prisma.portfolioImage.findUnique({
      where: { id: imageId },
      select: { mimeType: true, data: true },
    });
    if (!image) {
      return new NextResponse("Image not found.", { status: 404 });
    }

    const bytes = new Uint8Array(image.data.byteLength);
    bytes.set(image.data);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": image.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Unable to read portfolio image:", error);
    return new NextResponse("Unable to load image.", { status: 500 });
  }
}
