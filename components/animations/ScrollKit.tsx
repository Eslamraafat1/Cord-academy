"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const NO_MOTION = "(prefers-reduced-motion: reduce)";
const ease = [0.22, 1, 0.36, 1] as const;

/** Headline whose words slide up out of a mask on mount. Safe for Arabic (splits on spaces only). */
export function SplitText({
  text,
  as: Tag = "h1",
  className,
  delay = 0,
  gradientWords = [],
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** indexes of words rendered with the accent gradient */
  gradientWords?: number[];
}) {
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.14em] align-top [&:not(:last-child)]:me-[0.26em]">
          <motion.span
            className={cn("inline-block", gradientWords.includes(i) && "gradient-text")}
            initial={{ y: "118%", rotate: 4 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.9, ease, delay: delay + i * 0.07 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Scroll-triggered entrance driven by GSAP. Renders hidden on the server and animates once when it nears the viewport.
 * `x` is logical: positive moves from the inline-end side, so it mirrors in RTL.
 */
export function ScrollIn({
  children,
  className,
  y = 60,
  x = 0,
  scale = 0.95,
  rotateX = 0,
  delay = 0,
  start = "top 92%",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  x?: number;
  scale?: number;
  rotateX?: number;
  delay?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia(NO_MOTION).matches) {
      el.style.opacity = "1";
      return;
    }
    const { gsap } = registerGsap();
    const dir = document.documentElement.dir === "rtl" ? -1 : 1;
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y, x: x * dir, scale, rotateX, transformPerspective: 900 },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotateX: 0,
        duration: 1,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start, once: true },
        clearProps: "transform",
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [y, x, scale, rotateX, delay, start]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

/** Moves its content at a different speed than the page. `speed` 0.2 = drifts 20% of the scroll distance. */
export function Parallax({ children, speed = 0.2, className }: { children?: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia(NO_MOTION).matches) return;
    const { gsap } = registerGsap();
    const tween = gsap.fromTo(
      el,
      { y: () => -speed * 200 },
      {
        y: () => speed * 200,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Words fade up from dim to full as the block scrolls through the viewport. */
export function WordsScrub({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    if (window.matchMedia(NO_MOTION).matches) {
      w.forEach((x) => (x.style.opacity = "1"));
      return;
    }
    const { gsap } = registerGsap();
    const tween = gsap.to(w, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.4 },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [text]);

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} data-w className="inline-block opacity-25 [&:not(:last-child)]:me-[0.26em]">
          {w}
        </span>
      ))}
    </p>
  );
}

/** 3D pointer tilt for hero imagery (mouse only). */
export function Tilt({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 140, damping: 16 });
  const sy = useSpring(py, { stiffness: 140, damping: 16 });
  const rx = useTransform(sy, (v) => v * -max);
  const ry = useTransform(sx, (v) => v * max);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
        py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Generic sticky card stack: every child sticks under the header and shrinks back as the next one slides over it.
 */
export function Stack({ children, top = 5.25, step = 0.9, className }: { children: ReactNode[]; top?: number; step?: number; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia(NO_MOTION).matches) return;
    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      const wraps = gsap.utils.toArray<HTMLElement>("[data-stack]");
      const n = wraps.length;
      const last = wraps[n - 1];
      wraps.slice(0, -1).forEach((w, i) => {
        const depth = n - 1 - i;
        const trigger = {
          trigger: wraps[i + 1],
          start: "top bottom",
          endTrigger: last,
          end: () => `top ${parseFloat(getComputedStyle(last).top) || 0}px`,
          scrub: true,
          invalidateOnRefresh: true,
        };
        gsap.to(w.querySelector("[data-stack-inner]"), { scale: 1 - depth * 0.045, ease: "none", scrollTrigger: trigger });
        gsap.to(w.querySelector("[data-stack-shade]"), { opacity: Math.min(0.5, depth * 0.15), ease: "none", scrollTrigger: trigger });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={className}>
      {children.map((c, i) => (
        <div key={i} data-stack className="sticky mb-6 md:mb-10" style={{ top: `calc(${top}rem + ${i} * ${step}rem)` }}>
          <div data-stack-inner className="relative origin-top will-change-transform">
            {c}
            <div data-stack-shade aria-hidden className="pointer-events-none absolute inset-0 rounded-[2rem] bg-bg opacity-0" />
          </div>
        </div>
      ))}
    </div>
  );
}
