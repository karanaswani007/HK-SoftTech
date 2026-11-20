import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isPublicHttpUrl,
  isPublicImageSource,
  publicTeamMemberSchema,
} from "./public-profile.ts";

test("public profile links allow only absolute HTTP(S) URLs without credentials", () => {
  assert.equal(isPublicHttpUrl("https://example.com/profile"), true);
  assert.equal(isPublicHttpUrl("http://example.com"), true);
  assert.equal(isPublicHttpUrl("javascript:alert(1)"), false);
  assert.equal(isPublicHttpUrl("https://user:pass@example.com"), false);
  assert.equal(isPublicHttpUrl("/relative-path"), false);
});

test("profile images allow safe URLs and supported raster data URLs", () => {
  assert.equal(isPublicImageSource("https://example.com/photo.webp"), true);
  assert.equal(isPublicImageSource("data:image/png;base64,Zm9v"), true);
  assert.equal(isPublicImageSource("data:image/svg+xml;base64,Zm9v"), false);
  assert.equal(isPublicImageSource("javascript:alert(1)"), false);
});

test("public team profiles validate identity, role, links, and publish state", () => {
  const parsed = publicTeamMemberSchema.safeParse({
    name: "Team Member",
    role: "Designer",
    bio: "",
    image_url: "",
    website_url: "",
    linkedin_url: "javascript:alert(1)",
    instagram_url: "",
    github_url: "",
    x_url: "",
    sort_order: 0,
    published: false,
  });
  assert.equal(parsed.success, false);
});
