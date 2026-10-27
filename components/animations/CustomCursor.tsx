"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop-only follower ring. Never replaces the native cursor, never
 * shown on touch devices or with reduced motion.
 */
export function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ring.current;
    if (!fine || reduce || !el) return;

    let x = -100, y = -100, cx = -100, cy = -100, raf = 0, active = false;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!active) {
        active = true;
        el.style.opacity = "1";
      }
      const t = e.target as HTMLElement | null;
      const hot = !!t?.closest("a, button, [role='button'], input, select, textarea, [data-cursor]");
      el.dataset.hot = hot ? "1" : "0";
    };
    const onLeave = () => {
      active = false;
      el.style.opacity = "0";
    };
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden
      data-hot="0"
      className="pointer-events-none fixed start-0 top-0 z-[120] hidden size-9 rounded-full border border-accent opacity-0 mix-blend-difference transition-[width,height,background-color,opacity] duration-200 data-[hot='1']:size-14 data-[hot='1']:bg-white/20 [@media(hover:hover)_and_(pointer:fine)]:block"
    />
  );
}
