import type { L10n, Locale } from "@/types";
import type { Dict } from "./en";

export const locales: Locale[] = ["ar", "en"];
export const defaultLocale: Locale = "ar";
export const LANG_COOKIE = "lang";

export const isLocale = (v: string): v is Locale => v === "ar" || v === "en";
export const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");

/** "{n} lessons" + {n: 3} -> "3 lessons" */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export const pick = (v: L10n, l: Locale) => v[l];

/** Latin digits in both languages keeps numbers, prices and URLs visually consistent in RTL. */
export const numberLocale = (l: Locale) => (l === "ar" ? "ar-u-nu-latn" : "en-US");
export const formatNumber = (n: number, l: Locale) => new Intl.NumberFormat(numberLocale(l)).format(n);
export const formatCompact = (n: number, l: Locale) =>
  new Intl.NumberFormat(numberLocale(l), { notation: "compact", maximumFractionDigits: 1 }).format(n);
export const formatDate = (iso: string, l: Locale) =>
  new Intl.DateTimeFormat(numberLocale(l), { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(iso));

export function formatDuration(minutes: number, d: Dict) {
  if (minutes < 60) return fmt(d.common.minutesShort, { n: minutes });
  return fmt(d.common.hoursShort, { h: Math.floor(minutes / 60), m: minutes % 60 });
}

/** `/ar/courses` + "en" -> `/en/courses` */
export function switchLocalePath(pathname: string, to: Locale) {
  const parts = pathname.split("/");
  if (isLocale(parts[1] ?? "")) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join("/") || `/${to}`;
}
