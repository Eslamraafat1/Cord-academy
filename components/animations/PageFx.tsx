"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { registerGsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ErrorBoundary } from "../ui/ErrorBoundary";

const ScrollScene = dynamic(() => import("./ScrollScene"), { ssr: false });

/**
 * Site-wide scroll effects, mounted once in the locale layout: top progress bar, the page-long WebGL backdrop,
 * and GSAP entrances for anything tagged `data-fx="heading" | "card"`. Re-binds on every route change.
 * It sits after <main>, so its triggers are created after the pinned sections inside the page.
 */
export function PageFx() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const narrow = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    if (reduce) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const ctx = gsap.context(() => {
      if (bar.current) {
        gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
      }

      gsap.utils.toArray<HTMLElement>('[data-fx="heading"]').forEach((el) => {
        gsap.from(el, { y: 70, opacity: 0, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });

      const cards = gsap.utils.toArray<HTMLElement>('[data-fx="card"]');
      if (cards.length) {
        gsap.set(cards, { opacity: 0, y: 90, scale: 0.94 });
        ScrollTrigger.batch(cards, {
          start: "top 92%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.12, ease: "power3.out", overwrite: true }),
        });
      }
    });
    const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    const raf = requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [reduce, pathname]);

  if (reduce) return null;
  // video pages and the dashboard stay calm
  const calm = /\/(watch|dashboard)(\/|$)/.test(pathname);
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
        <div ref={bar} className="h-full origin-left bg-gradient-to-r from-accent to-lime rtl:origin-right" style={{ transform: "scaleX(0)" }} />
      </div>
      {!calm && (
        <ErrorBoundary>
          <ScrollScene narrow={narrow} />
        </ErrorBoundary>
      )}
    </>
  );
}
