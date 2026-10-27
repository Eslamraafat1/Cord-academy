import type { MetadataRoute } from "next";
import { courses } from "@/data/courses";
import { locales } from "@/lib/i18n";
import { SITE_URL, STATIC_ROUTES } from "@/lib/site";

// Fixed date: new Date() can't be used while prerendering under Cache Components.
const LAST_MODIFIED = "2026-10-26";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...STATIC_ROUTES.filter((p) => !p.startsWith("/dashboard") && !["/login", "/register", "/forgot-password"].includes(p)), ...courses.map((c) => `/courses/${c.slug}`)];

  return paths.flatMap((p) =>
    locales.map((l) => ({
      url: `${SITE_URL}/${l}${p}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: p === "" ? ("weekly" as const) : ("monthly" as const),
      priority: p === "" ? 1 : p.startsWith("/courses") ? 0.8 : 0.5,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${SITE_URL}/${x}${p}`])) },
    })),
  );
}
