import { createMiddleware } from "@tanstack/react-start";

export const STUDIO_USER_ID = "hk-studio";

export const studioMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const { readStudioCookie } = await import("./studio-gate.server");
  if (!readStudioCookie()) {
    throw new Error("Sign in with the studio password.");
  }
  return next({ context: { userId: STUDIO_USER_ID } });
});
