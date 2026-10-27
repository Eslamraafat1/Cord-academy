"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { registerGsap } from "@/lib/gsap";
import { DEMO_VIDEOS } from "@/data/videos";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useI18n } from "../providers/I18nProvider";
import { ButtonLink } from "../ui/Button";
import { Magnetic } from "../ui/Magnetic";
import { ErrorBoundary } from "../ui/ErrorBoundary";
import { Container, Pill } from "../ui/Primitives";
import { PlayTrigger } from "../courses/CourseActions";
import { buttonClasses } from "../ui/Button";
import { Counter } from "../animations/Counter";

// Three.js is only fetched when motion is allowed; phones get a lighter scene.
const HeroScene = dynamic(() => import("../animations/HeroScene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ stats }: { stats: { courses: number; rating: number } }) {
  const { dict } = useI18n();
  const root = useRef<HTMLElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const small = useMediaQuery("(max-width: 1023px)");
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");

  // GSAP scroll-driven parallax (cleaned up with the context)
  useEffect(() => {
    if (reduce || !root.current) return;
    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-shape]", {
        yPercent: (i) => -25 - i * 18,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-visual]", {
        scale: 1.25,
        rotate: -8,
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-copy]", {
        yPercent: -12,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "30% top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  // pause the WebGL loop when offscreen
  useEffect(() => {
    const el = visual.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const lines = [dict.hero.title1, dict.hero.title2, dict.hero.title3];

  return (
    <section ref={root} className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-32 sm:pt-36">
      {/* background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div data-hero-shape className="animate-drift absolute -top-24 start-[-10%] size-[34rem] rounded-full bg-accent/30 blur-[110px]" />
        <div data-hero-shape className="animate-drift absolute bottom-[-12rem] end-[-8%] size-[30rem] rounded-full bg-accent2/25 blur-[110px] [animation-delay:-6s]" />
        <div data-hero-shape className="animate-drift absolute start-[40%] top-[30%] size-72 rounded-full bg-lime/20 blur-[100px] [animation-delay:-11s]" />
        <div
          className="absolute inset-0 opacity-[0.5] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
          style={{
            backgroundImage: "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <Container className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div data-hero-copy>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <Pill className="glass py-1.5 ps-2 pe-4 text-[13px]">
              <span className="grid size-6 place-items-center rounded-full bg-lime text-[#0a1824]">
                <Sparkles className="size-3.5" aria-hidden />
              </span>
              {dict.hero.eyebrow}
            </Pill>
          </motion.div>

          <h1 className="display mt-7 text-[clamp(2.4rem,7vw,5.5rem)]">
            {lines.map((l, i) => (
              <span key={i} className="block overflow-hidden pb-[0.12em]">
                <motion.span
                  className={i === 1 ? "gradient-text block" : "block"}
                  initial={{ y: "115%", rotate: 3 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 0.95, ease, delay: 0.1 + i * 0.12 }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-7 max-w-xl text-lg text-muted sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.55 }}
          >
            {dict.hero.sub}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.7 }}
          >
            <ButtonLink href="/courses" size="lg" magnetic>
              {dict.hero.cta}
              <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
            </ButtonLink>
            <Magnetic>
              <PlayTrigger
                url={DEMO_VIDEOS.yt1}
                title={dict.hero.introTitle}
                label={dict.hero.cta2}
                className={buttonClasses("glass", "lg")}
              >
                <span className="grid size-8 place-items-center rounded-full bg-accent text-accent-fg">
                  <Play className="size-3.5 translate-x-px fill-current" aria-hidden />
                </span>
                {dict.hero.cta2}
              </PlayTrigger>
            </Magnetic>
          </motion.div>

          <motion.ul
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[dict.hero.badge1, dict.hero.badge2, dict.hero.badge3].map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-lime ring-2 ring-lime/30" />
                {b}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* visual */}
        <div ref={visual} data-hero-visual className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-none">
          <div aria-hidden className="animate-float-slow absolute inset-[14%] rounded-full bg-gradient-to-br from-accent via-accent/70 to-accent2 opacity-90 blur-[2px] lg:opacity-30" />
          <div aria-hidden className="absolute inset-[6%] rounded-full border border-line" />
          <div aria-hidden className="absolute inset-[22%] rounded-full border border-dashed border-line" />
          {!reduce && (
            <ErrorBoundary>
              <div className="absolute inset-0">
                <HeroScene active={visible} small={small} />
              </div>
            </ErrorBoundary>
          )}
          <motion.div
            className="glass absolute start-0 top-[14%] rounded-2xl px-4 py-3 shadow-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease }}
          >
            <p className="display text-3xl">
              <Counter to={stats.courses} suffix="+" />
            </p>
            <p className="text-xs text-muted">{dict.stats.courses}</p>
          </motion.div>
          <motion.div
            className="glass absolute bottom-[12%] end-0 rounded-2xl px-4 py-3 shadow-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.7, ease }}
          >
            <p className="display text-3xl">
              <Counter to={stats.rating} decimals={1} />
              <span className="text-accent"> ★</span>
            </p>
            <p className="text-xs text-muted">{dict.stats.rating}</p>
          </motion.div>
        </div>
      </Container>

      <div aria-hidden className="absolute bottom-6 start-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted sm:flex rtl:translate-x-1/2">
        {dict.hero.scroll}
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span className="absolute inset-x-0 top-0 h-4 bg-fg" animate={{ y: [-16, 40] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} />
        </span>
      </div>
    </section>
  );
}
