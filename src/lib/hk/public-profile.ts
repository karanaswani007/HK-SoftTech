import { z } from "zod";

export type PublicTeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  website_url: string;
  linkedin_url: string;
  instagram_url: string;
  github_url: string;
  x_url: string;
  sort_order: number;
  published: boolean;
};

export function isPublicHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function isPublicImageSource(value: string) {
  return (
    !value ||
    isPublicHttpUrl(value) ||
    /^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/.test(value)
  );
}

const publicUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => !value || isPublicHttpUrl(value), "Use a valid HTTP or HTTPS URL.");

const publicImage = z
  .string()
  .trim()
  .max(1_250_000)
  .refine(
    isPublicImageSource,
    "Use an HTTP(S) image URL or upload a PNG, JPEG, WebP, or GIF image.",
  );

export const publicTeamMemberSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(120),
  bio: z.string().trim().max(1200).default(""),
  image_url: publicImage.default(""),
  website_url: publicUrl.default(""),
  linkedin_url: publicUrl.default(""),
  instagram_url: publicUrl.default(""),
  github_url: publicUrl.default(""),
  x_url: publicUrl.default(""),
  sort_order: z.number().int().min(0).max(9999),
  published: z.boolean(),
});

export type PublicTeamMemberInput = z.infer<typeof publicTeamMemberSchema>;
