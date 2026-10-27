"use client";

import { useCallback, useLayoutEffect, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

/** Runs in <head> before first paint: stored choice → system preference. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const read = (): Theme => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage blocked: theme still applies for this session */
    }
  }, []);

  return { theme, setTheme, toggle: () => setTheme(read() === "dark" ? "light" : "dark") };
}

/**
 * React's dev Strict Mode remount can strip attributes set by the inline script,
 * so re-apply the stored/system theme before paint. No-op in production.
 */
export function ThemeSync() {
  useLayoutEffect(() => {
    if (document.documentElement.hasAttribute("data-theme")) return;
    let t: Theme = "light";
    try {
      const s = localStorage.getItem("theme");
      t = s === "dark" || s === "light" ? s : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {}
    document.documentElement.setAttribute("data-theme", t);
  }, []);
  return null;
}
