"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";
import { useI18n } from "../providers/I18nProvider";
import { LANG_COOKIE, switchLocalePath } from "@/lib/i18n/format";

export function LangSwitcher({ className }: { className?: string }) {
  const { lang, dict } = useI18n();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const to = lang === "ar" ? "en" : "ar";
  const href = switchLocalePath(pathname, to) + (search ? `?${search}` : "");

  return (
    <Link
      href={href}
      hrefLang={to}
      lang={to}
      scroll={false}
      onClick={() => {
        document.cookie = `${LANG_COOKIE}=${to}; path=/; max-age=31536000; SameSite=Lax`;
      }}
      aria-label={dict.a11y.switchLang}
      className={
        className ??
        "inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface/60 px-4 text-sm font-semibold transition hover:border-fg"
      }
    >
      <Languages className="size-[18px]" aria-hidden />
      {dict.nav.langLabel}
    </Link>
  );
}
