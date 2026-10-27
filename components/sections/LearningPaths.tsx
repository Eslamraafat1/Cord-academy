"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { tone } from "@/lib/palette";
import { registerGsap } from "@/lib/gsap";
import { formatDuration, fmt } from "@/lib/i18n/format";
import type { CourseView } from "@/types";
import { useI18n } from "../providers/I18nProvider";
import { Container, SectionHeading } from "../ui/Primitives";
import { ButtonLink } from "../ui/Button";
import { LocLink } from "../ui/LocLink";
import { CourseCover } from "../courses/CourseCover";

export interface PathView {
  id: string;
  title: string;
  description: string;
  hue: number;
  courses: CourseView[];
}

/** Scroll-driven roadmap: the line fills and steps light up as you scroll (GSAP ScrollTrigger). */
export function LearningPaths({ paths }: { paths: PathView[] }) {
  const { dict } = useI18n();
  const [active, setActive] = useState(paths[0].id);
  const path = paths.find((p) => p.id === active) ?? paths[0];
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      steps.forEach((s) => s.classList.add("is-active"));
      return;
    }
    const { gsap, ScrollTrigger } = registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-line-fill]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 65%", end: "bottom 65%", scrub: true } },
      );
      steps.forEach((s) =>
        ScrollTrigger.create({ trigger: s, start: "top 68%", toggleClass: { targets: s, className: "is-active" } }),
      );
    }, el);
    return () => ctx.revert();
  }, [active]);

  return (
    <section id="paths" className="scroll-mt-24 py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow={dict.paths.eyebrow} title={dict.paths.title} sub={dict.paths.sub} />
          <div role="tablist" aria-label={dict.paths.title} className="flex flex-col gap-2">
            {paths.map((p) => {
              const on = p.id === active;
              return (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(p.id)}
                  className={cn(
                    "flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-start transition",
                    on ? "border-fg bg-fg text-bg" : "border-line bg-surface hover:border-fg",
                  )}
                >
                  <span>
                    <span className="block font-semibold">{p.title}</span>
                    <span className={cn("text-sm", on ? "opacity-70" : "text-muted")}>{fmt(dict.paths.steps, { n: p.courses.length })}</span>
                  </span>
                  <span className="size-3 rounded-full" style={{ background: tone(p.hue).a }} aria-hidden />
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-muted">{path.description}</p>
          <ButtonLink href={`/courses/${path.courses[0].slug}`} className="mt-6">
            {dict.paths.start}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </ButtonLink>
        </div>

        <ol key={path.id} ref={list} className="relative space-y-8 ps-10 sm:ps-14" aria-label={path.title}>
          <span aria-hidden className="absolute inset-y-2 start-[15px] w-0.5 rounded bg-line sm:start-[19px]">
            <span data-line-fill className="absolute inset-0 origin-top rounded bg-gradient-to-b from-accent via-accent2 to-lime" />
          </span>
          {path.courses.map((c, i) => (
            <li key={c.id} data-step className="group relative [&.is-active_[data-dot]]:scale-110 [&.is-active_[data-dot]]:bg-accent [&.is-active_[data-dot]]:text-accent-fg [&.is-active_[data-card]]:border-accent [&.is-active_[data-card]]:opacity-100 opacity-100">
              <span
                data-dot
                className="absolute -start-10 top-5 grid size-8 place-items-center rounded-full border-2 border-bg bg-bg2 text-xs font-bold ring-1 ring-line transition-all duration-500 sm:-start-14 sm:size-10 sm:text-sm"
              >
                {i + 1}
              </span>
              <LocLink
                data-card
                href={`/courses/${c.slug}`}
                className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-4 opacity-70 transition duration-500 hover:-translate-y-1 sm:flex-row sm:items-center sm:p-5"
              >
                <span className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl sm:aspect-square sm:w-32">
                  <CourseCover hue={c.hue} pattern={c.pattern} thumbnail={c.thumbnail} sizes="160px" />
                </span>
                <span className="min-w-0">
                  <span className="eyebrow">{fmt(dict.paths.step, { n: i + 1 })}</span>
                  <span className="display mt-1 block text-xl" style={{ letterSpacing: 0 }}>
                    {c.title}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{c.instructorName}</span>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
                    <Clock className="size-3.5" aria-hidden />
                    {formatDuration(c.durationMin, dict)} · {dict.common.level[c.level]}
                  </span>
                </span>
              </LocLink>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
