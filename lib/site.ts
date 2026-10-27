export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cord-academy.example";
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
