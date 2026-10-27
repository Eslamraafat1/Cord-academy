"use client";

import { ArrowRight, History } from "lucide-react";
import { fmt } from "@/lib/i18n/format";
import { useProgress, useRecentlyViewed } from "@/lib/store";
import type { CourseView } from "@/types";
import { useI18n } from "../providers/I18nProvider";
import { Container, SectionHeading } from "../ui/Primitives";
import { Reveal } from "../animations/Reveal";
import { CourseCover } from "../courses/CourseCover";
import { LocLink } from "../ui/LocLink";
import { ButtonLink } from "../ui/Button";

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} className={`h-1.5 overflow-hidden rounded-full bg-line ${className}`}>
      <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-[width] duration-700" style={{ width: `${value}%` }} />
    </div>
  );
}

/**
 * "Continue learning" — reads progress from this browser's localStorage.
 * There are no accounts yet, so this works per-device only.
 */
export function ContinueLearning({ courses, lessonCounts }: { courses: CourseView[]; lessonCounts: Record<string, number> }) {
  const { dict, href } = useI18n();
  const { done, last, percent } = useProgress();
  const { ids: recent } = useRecentlyViewed();

  const inProgress = courses.filter((c) => (done[c.id]?.length ?? 0) > 0 && percent(c.id, lessonCounts[c.id]) < 100);
  const recentCourses = recent.map((id) => courses.find((c) => c.id === id)).filter((c): c is CourseView => !!c).slice(0, 4);

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow={dict.continue.eyebrow} title={dict.continue.title} />

        {inProgress.length === 0 ? (
          <Reveal className="flex flex-col items-start gap-4 rounded-[2rem] border border-dashed border-line bg-surface/50 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="display text-2xl">{dict.continue.emptyTitle}</p>
              <p className="mt-2 max-w-xl text-muted">{dict.continue.emptyText}</p>
            </div>
            <ButtonLink href="/courses" variant="outline">
              {dict.nav.courses}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </ButtonLink>
          </Reveal>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {inProgress.map((c) => {
              const p = percent(c.id, lessonCounts[c.id]);
              const lesson = last[c.id];
              return (
                <Reveal key={c.id}>
                  <LocLink
                    href={`/courses/${c.slug}/watch${lesson ? `?lesson=${lesson}` : ""}`}
                    className="group flex items-center gap-4 rounded-3xl border border-line bg-surface p-3 pe-5 transition hover:border-fg"
                  >
                    <span className="relative size-24 shrink-0 overflow-hidden rounded-2xl sm:size-28">
                      <CourseCover hue={c.hue} pattern={c.pattern} thumbnail={c.thumbnail} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 font-semibold">{c.title}</span>
                      <span className="mt-1 block text-sm text-muted">{fmt(dict.continue.complete, { p })}</span>
                      <ProgressBar value={p} className="mt-3" />
                    </span>
                    <span className="hidden items-center gap-1 text-sm font-semibold text-accent sm:flex">
                      {dict.continue.resume}
                      <ArrowRight className="size-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
                    </span>
                  </LocLink>
                </Reveal>
              );
            })}
          </div>
        )}

        {recentCourses.length > 0 && (
          <div className="mt-10">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted">
              <History className="size-4" aria-hidden /> {dict.continue.recently}
            </p>
            <ul className="flex flex-wrap gap-2">
              {recentCourses.map((c) => (
                <li key={c.id}>
                  <a href={href(`/courses/${c.slug}`)} className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-4 text-sm transition hover:border-fg">
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
