"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import type { Locale } from "@/types";
import type { Dict } from "@/lib/i18n/en";
import { I18nProvider } from "./I18nProvider";
import { ThemeSync } from "./ThemeProvider";
import { ToastProvider } from "../ui/Toast";
import { VideoProvider } from "../video/VideoProvider";
import { SmoothScroll } from "../animations/SmoothScroll";
import { CustomCursor } from "../animations/CustomCursor";
import { CommandPalette, type SearchEntry } from "../layout/CommandPalette";

export function Providers({ lang, dict, search, children }: { lang: Locale; dict: Dict; search: SearchEntry[]; children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <I18nProvider lang={lang} dict={dict}>
        <ThemeSync />
        <ToastProvider>
          <VideoProvider>
            <SmoothScroll />
            <CustomCursor />
            {children}
            <CommandPalette courses={search} />
          </VideoProvider>
        </ToastProvider>
      </I18nProvider>
    </MotionConfig>
  );
}
