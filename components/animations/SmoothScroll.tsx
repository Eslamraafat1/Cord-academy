"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerGsap } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const lenis = new Lenis({ duration: 1.05, wheelMultiplier: 0.95, anchors: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
