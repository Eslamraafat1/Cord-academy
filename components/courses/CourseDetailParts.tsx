"use client";

import { useEffect } from "react";
import { ArrowRight, CheckCircle2, Circle, Eye, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDuration, fmt } from "@/lib/i18n/format";
import { useProgress, useRecentlyViewed } from "@/lib/store";
import type { CourseView } from "@/types";
import { useI18n } from "../providers/I18nProvider";
import { ButtonLink, buttonClasses } from "../ui/Button";
import { Accordion } from "../ui/Accordion";
import { LocLink } from "../ui/LocLink";
import { ProgressBar } from "../sections/ContinueLearning";
import { PlayTrigger, ShareButton, WishlistButton } from "./CourseActions";
import { useToast } from "../ui/Toast";
import { enrollInCourse } from "@/lib/api";

export interface LessonView {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
  preview: boolean;
}
export interface ModuleView {
  id: string;
  title: string;
  lessons: LessonView[];
}

export function RecentTracker({ courseId }: { courseId: string }) {
  const { push } = useRecentlyViewed();
  useEffect(() => {
    push(courseId);
  }, [courseId, push]);
  return null;
}

/** Primary actions: watch/continue, trailer, save, share. */
export function DetailActions({ course, firstLessonId, totalLessons }: { course: CourseView; firstLessonId: string; totalLessons: number }) {
  const { dict } = useI18n();
  const { done, last, percent } = useProgress();
  const started = (done[course.id]?.length ?? 0) > 0;
  const lesson = last[course.id] ?? firstLessonId;
  const p = percent(course.id, totalLessons);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonLink href={`/courses/${course.slug}/watch?lesson=${lesson}`} size="lg" magnetic>
          <Play className="size-5 fill-current" aria-hidden />
          {started ? dict.course.continue : dict.course.watchCourse}
        </ButtonLink>
        <PlayTrigger url={course.videoUrl} title={course.title} course={course} className={buttonClasses("outline", "lg")}>
          {dict.course.playTrailer}
        </PlayTrigger>
        <WishlistButton courseId={course.id} withLabel />
        <ShareButton title={course.title} />
      </div>
      {started && (
        <div className="max-w-md">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium">{dict.course.progress}</span>
            <span className="text-muted tabular-nums">{p}%</span>
          </div>
          <ProgressBar value={p} />
        </div>
      )}
    </div>
  );
}

export function Curriculum({ course, modules }: { course: CourseView; modules: ModuleView[] }) {
  const { dict } = useI18n();
  const { done } = useProgress();
  const completed = done[course.id] ?? [];

  return (
    <Accordion
      multiple
      defaultOpen={modules[0]?.id}
      items={modules.map((m, mi) => {
        const total = m.lessons.reduce((n, l) => n + l.duration, 0);
        return {
          id: m.id,
          title: (
            <span className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
              <span>
                {mi + 1}. {m.title}
              </span>
              <span className="text-sm font-normal text-muted">
                {fmt(dict.common.lessons, { n: m.lessons.length })} · {formatDuration(total, dict)}
              </span>
            </span>
          ),
          content: (
            <ul className="-mx-2 divide-y divide-line">
              {m.lessons.map((l, li) => {
                const isDone = completed.includes(l.id);
                return (
                  <li key={l.id} className="flex items-center gap-3 py-2">
                    <LocLink
                      href={`/courses/${course.slug}/watch?lesson=${l.id}`}
                      className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-xl px-2 text-fg transition hover:bg-fg/5"
                    >
                      {isDone ? <CheckCircle2 className="size-5 shrink-0 text-accent" aria-label="✓" /> : <Circle className="size-5 shrink-0 text-muted" aria-hidden />}
                      <span className="min-w-0 flex-1 truncate">
                        {mi + 1}.{li + 1} {l.title}
                      </span>
                      <span className="shrink-0 text-sm text-muted tabular-nums">{formatDuration(l.duration, dict)}</span>
                    </LocLink>
                    {l.preview && (
                      <PlayTrigger
                        url={l.videoUrl}
                        title={l.title}
                        course={course}
                        className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold transition hover:border-fg"
                      >
                        <Eye className="size-3.5" aria-hidden />
                        {dict.course.previewLesson}
                      </PlayTrigger>
                    )}
                  </li>
                );
              })}
            </ul>
          ),
        };
      })}
    />
  );
}

/** Enrol button: payments are not connected, so it says so instead of pretending. */
export function EnrollButton({ courseId, label, className }: { courseId: string; label: string; className?: string }) {
  const { dict } = useI18n();
  const toast = useToast();
  return (
    <button
      type="button"
      className={cn(buttonClasses("primary", "lg"), "w-full", className)}
      onClick={async () => {
        const r = await enrollInCourse(courseId);
        toast(r.ok ? dict.toast.saved : dict.toast.demoAction, r.ok ? "success" : "info");
      }}
    >
      {label}
      <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
    </button>
  );
}
