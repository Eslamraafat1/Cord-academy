/**
 * Canonical public origin (metadataBase, canonical/hreflang, sitemap, robots, JSON-LD).
 * Order: NEXT_PUBLIC_SITE_URL -> VERCEL_PROJECT_PRODUCTION_URL (Vercel system env) -> known production URL.
 * Never falls back to localhost or a placeholder domain.
 */
const PRODUCTION_URL = "https://cord-academy.vercel.app";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) return `https://${vercelHost.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;

  return PRODUCTION_URL;
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = { en: "Cord Academy", ar: "أكاديمية كورد" } as const;

/** Fixed on purpose: Date.now()/new Date() can't run while prerendering under Cache Components. */
export const COPYRIGHT_YEAR = 2026;

/** Static (non-course) public routes, used for the sitemap and command palette. */
export const STATIC_ROUTES = [
  "",
  "/courses",
  "/about",
  "/contact",
  "/faq",
  "/login",
  "/register",
  "/forgot-password",
  "/dashboard",
  "/dashboard/courses",
  "/dashboard/wishlist",
  "/dashboard/settings",
  "/privacy",
  "/terms",
] as const;
