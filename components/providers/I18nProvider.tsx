"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale } from "@/types";
import type { Dict } from "@/lib/i18n/en";
import { dirOf } from "@/lib/i18n/format";

interface I18nValue {
  lang: Locale;
  dir: "rtl" | "ltr";
  dict: Dict;
  /** Prefix an internal path with the current locale: href("/courses") -> "/ar/courses" */
  href: (path: string) => string;
}

const Ctx = createContext<I18nValue | null>(null);

export function I18nProvider({ lang, dict, children }: { lang: Locale; dict: Dict; children: ReactNode }) {
  const value = useMemo<I18nValue>(
    () => ({ lang, dict, dir: dirOf(lang), href: (p) => `/${lang}${p === "/" ? "" : p}` }),
    [lang, dict],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside <I18nProvider>");
  return v;
}
