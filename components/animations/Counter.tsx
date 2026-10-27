"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { useI18n } from "../providers/I18nProvider";
import { numberLocale } from "@/lib/i18n/format";

/** Count-up number that runs once when visible. */
export function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const { lang } = useI18n();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) return;
    const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: setValue });
    return () => c.stop();
  }, [inView, to, reduce]);

  const shown = reduce && inView ? to : value;
  const text = new Intl.NumberFormat(numberLocale(lang), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(shown);

  return (
    <span ref={ref} className="ltr-iso tabular-nums">
      {text}
      {suffix}
    </span>
  );
}
