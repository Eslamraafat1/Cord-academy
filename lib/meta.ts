import type { Metadata } from "next";
import { locales } from "@/lib/i18n/format";

export function pageMeta(lang: string, path: string, title: string, description?: string, noindex = false): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `/${lang}${path}`, languages: Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])) },
    openGraph: { title, description, url: `/${lang}${path}` },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
