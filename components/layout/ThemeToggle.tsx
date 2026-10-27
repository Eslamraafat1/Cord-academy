"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { useI18n } from "../providers/I18nProvider";

export function ThemeToggle() {
  const { toggle } = useTheme();
  const { dict } = useI18n();
  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={dict.a11y.toggleTheme}
      whileTap={{ scale: 0.88, rotate: 20 }}
      className="relative grid size-11 place-items-center rounded-full border border-line bg-surface/60 transition hover:border-fg"
    >
      {/* icon swap is pure CSS keyed on <html data-theme>, so SSR and client markup always match */}
      <Moon className="theme-moon size-[18px]" aria-hidden />
      <Sun className="theme-sun size-[18px]" aria-hidden />
    </motion.button>
  );
}
