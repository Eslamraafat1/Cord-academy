"use client";

import { useEffect, useRef } from "react";
import { registerGsap } from "@/lib/gsap";
import type { CourseView } from "@/types";
import { useI18n } from "../providers/I18nProvider";
import { Container, SectionHeading } from "../ui/Primitives";
import { CourseCard } from "../courses/CourseCard";
import { ViewAll } from "./CourseSections";

const NO_MOTION = "(prefers-reduced-motion: reduce)";

/** Cards that pile on top of each other: each one sticks, then the next slides over it while it shrinks back. */
export function StackedFeatured({ courses }: { courses: CourseView[] }) {
  const { dict } = useI18n();
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
        gsap.to(w.querySelector("[data-stack-shade]"), { opacity: Math.min(0.55, depth * 0.16), ease: "none", scrollTrigger: trigger });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={dict.featured.eyebrow} title={dict.featured.title} sub={dict.featured.sub} action={<ViewAll dict={dict} />} />
        <div ref={root}>
          {courses.map((c, i) => (
            <div key={c.id} data-stack className="sticky mb-6 md:mb-10" style={{ top: `calc(5.25rem + ${i} * 0.9rem)` }}>
              <div data-stack-inner className="relative origin-top will-change-transform">
                <CourseCard course={c} variant="stack" priority={i === 0} className="md:min-h-[26rem]" />
                <div data-stack-shade aria-hidden className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-bg opacity-0" />
                <span
                  aria-hidden
                  className="display pointer-events-none absolute bottom-5 start-6 z-10 hidden text-7xl text-transparent [-webkit-text-stroke:1.5px_white] md:block"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** On desktop the section pins and the rail scrolls sideways with the page; on touch it stays a swipeable snap rail. */
export function PinnedTrending({ courses }: { courses: CourseView[] }) {
  const { dict, lang } = useI18n();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const s = section.current;
    const t = track.current;
    if (!s || !t) return;
    const { gsap } = registerGsap();
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const dist = () => Math.max(0, t.offsetWidth - window.innerWidth);
      const sign = lang === "ar" ? 1 : -1;
      const cards = gsap.utils.toArray<HTMLElement>("[data-rail-card]", t);
      gsap.fromTo(
        cards,
        { rotateY: sign * -14, scale: 0.92 },
        { rotateY: 0, scale: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: s, start: "top 80%", end: "top top", scrub: true } },
      );
      gsap.to(t, {
        x: () => sign * dist(),
        ease: "none",
        scrollTrigger: {
          trigger: s,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
    });
    return () => mm.revert();
  }, [lang]);

  return (
    <section ref={section} className="py-24 sm:py-28 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:overflow-hidden lg:py-0">
      <Container className="w-full">
        <SectionHeading eyebrow={dict.trending.eyebrow} title={dict.trending.title} sub={dict.trending.sub} />
      </Container>
      <div
        tabIndex={0}
        role="region"
        aria-label={dict.trending.title}
        className="overflow-x-auto overscroll-x-contain pb-6 [scrollbar-width:none] lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
        data-lenis-prevent-wheel
      >
        <div
          ref={track}
          className="flex w-max snap-x snap-mandatory gap-5 px-4 sm:px-6 lg:snap-none lg:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:[perspective:1200px]"
        >
          {courses.map((c, i) => (
            <div key={c.id} data-rail-card className="relative w-[82vw] max-w-sm shrink-0 snap-start sm:w-[22rem]">
              <span aria-hidden className="display pointer-events-none absolute end-4 top-[6.5rem] z-10 text-6xl text-transparent [-webkit-text-stroke:1.5px_white]">
                {i + 1}
              </span>
              <CourseCard course={c} className="h-full" />
            </div>
          ))}
        </div>
      </div>
      <Container className="mt-10 hidden w-full lg:block">
        <span aria-hidden className="block h-0.5 w-full overflow-hidden rounded bg-line">
          <span ref={bar} className="block h-full origin-left rounded bg-accent rtl:origin-right" style={{ transform: "scaleX(0)" }} />
        </span>
      </Container>
    </section>
  );
}

/** Big statement whose words light up one by one while the section is pinned. */
export function Manifesto() {
  const { dict } = useI18n();
  const root = useRef<HTMLElement>(null);
  const words = dict.manifesto.text.split(" ");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const w = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
    if (window.matchMedia(NO_MOTION).matches) {
      w.forEach((x) => (x.style.opacity = "1"));
      return;
    }
    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      gsap.to(w, {
        opacity: 1,
        stagger: 0.12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "+=110%", scrub: 0.5, pin: true, anticipatePin: 1 },
      });
      gsap.to("[data-orb]", {
        yPercent: -60,
        rotate: 120,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, [dict.manifesto.text]);

  return (
    <section ref={root} className="relative isolate flex min-h-screen items-center overflow-hidden py-20">
      <div aria-hidden data-orb className="absolute -end-24 top-1/3 -z-10 size-72 rounded-full bg-gradient-to-br from-accent to-accent2 opacity-30 blur-3xl sm:size-[28rem]" />
      <Container>
        <p className="eyebrow mb-6">{dict.manifesto.eyebrow}</p>
        <p className="display text-[clamp(1.9rem,5.4vw,4.75rem)]">
          {words.map((word, i) => (
            <span key={i} data-word className="inline-block opacity-20 [&:not(:last-child)]:me-[0.28em]">
              {word}
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}

/** Two rows of oversized topic names that slide in opposite directions as the page scrolls. */
export function ScrollMarquee({ words, compact = false }: { words: string[]; compact?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const copies = [...words, ...words, ...words];

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia(NO_MOTION).matches) return;
    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      const st = { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 };
      gsap.fromTo("[data-row=a]", { xPercent: 0 }, { xPercent: -33.33, ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-row=b]", { xPercent: -33.33 }, { xPercent: 0, ease: "none", scrollTrigger: st });
    }, el);
    return () => ctx.revert();
  }, []);

  const row = (kind: "a" | "b") => (
    <div data-row={kind} className="flex w-max items-center gap-8 whitespace-nowrap">
      {copies.map((w, i) => (
        <span key={i} className="flex items-center gap-8">
          <span
            className={`display ${compact ? "text-[clamp(2rem,6vw,4.5rem)]" : "text-[clamp(3rem,11vw,9rem)]"} ${kind === "a" ? "text-transparent [-webkit-text-stroke:1.5px_var(--fg)]" : "text-accent"}`}
            style={{ letterSpacing: 0 }}
          >
            {w}
          </span>
          <span aria-hidden className="text-[clamp(1.5rem,4vw,3rem)] text-accent2">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} dir="ltr" aria-hidden className={compact ? "overflow-hidden py-6 sm:py-8" : "overflow-hidden py-10 sm:py-16"}>
      <div className="space-y-2">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
