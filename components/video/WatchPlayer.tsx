"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, ListVideo, PanelRightClose, PlayCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { fmt, formatDuration } from "@/lib/i18n/format";
import { track } from "@/lib/analytics";
import { useProgress } from "@/lib/store";
import type { CourseView } from "@/types";
import { useI18n } from "../providers/I18nProvider";
import { Button } from "../ui/Button";
import { LocLink } from "../ui/LocLink";
import { useToast } from "../ui/Toast";
import { CourseCover } from "../courses/CourseCover";
import { ProgressBar } from "../sections/ContinueLearning";
import type { ModuleView } from "../courses/CourseDetailParts";
import { VideoPlayer } from "./VideoPlayer";

export function WatchPlayer({ course, modules }: { course: CourseView; modules: ModuleView[] }) {
  const { dict } = useI18n();
  const toast = useToast();
  const sp = useSearchParams();
  const { done, last, toggleLesson, setLastLesson, percent } = useProgress();

  const flat = useMemo(() => modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleTitle: m.title }))), [modules]);
  const wanted = sp.get("lesson") ?? last[course.id];
  const index = Math.max(0, flat.findIndex((l) => l.id === wanted));
  const lesson = flat[index];
  const completed = done[course.id] ?? [];
  const isDone = completed.includes(lesson.id);
  const p = percent(course.id, flat.length);

  const [open, setOpen] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLastLesson(course.id, lesson.id);
  }, [course.id, lesson.id, setLastLesson]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [lesson.id, open]);

  function go(i: number) {
    const target = flat[i];
    if (!target) return;
    setInteracted(true);
    const u = new URL(window.location.href);
    u.searchParams.set("lesson", target.id);
    window.history.replaceState(null, "", u.pathname + u.search);
  }

  function complete() {
    toggleLesson(course.id, lesson.id);
    track("video_complete_lesson", { courseId: course.id, lessonId: lesson.id });
    toast(isDone ? dict.toast.lessonUndone : dict.toast.lessonDone);
  }

  return (
    <div className={cn("grid gap-6", open && "lg:grid-cols-[minmax(0,1fr)_22rem]")}>
      <div className="min-w-0">
        <div className="overflow-hidden rounded-3xl border border-line bg-black shadow-card">
          <VideoPlayer
            key={lesson.id}
            url={lesson.videoUrl}
            title={lesson.title}
            autoPlay={interacted}
            poster={<CourseCover hue={course.hue} pattern={course.pattern} thumbnail={course.thumbnail} />}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted">
              {lesson.moduleTitle} · {fmt(dict.watch.lessonOf, { a: index + 1, b: flat.length })}
            </p>
            <h1 className="display mt-1 text-2xl sm:text-3xl" style={{ letterSpacing: 0 }}>
              {lesson.title}
            </h1>
          </div>
          <Button variant="outline" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="lesson-list" className="hidden lg:inline-flex">
            {open ? <PanelRightClose className="size-[18px] rtl:-scale-x-100" aria-hidden /> : <ListVideo className="size-[18px]" aria-hidden />}
            {open ? dict.watch.hideList : dict.watch.showList}
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => go(index - 1)} disabled={index === 0}>
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            {dict.watch.prev}
          </Button>
          <Button variant={isDone ? "lime" : "primary"} onClick={complete} aria-pressed={isDone}>
            {isDone ? <CheckCircle2 className="size-5" aria-hidden /> : <Circle className="size-5" aria-hidden />}
            {isDone ? dict.watch.markUndone : dict.watch.markDone}
          </Button>
          <Button variant="outline" onClick={() => go(index + 1)} disabled={index === flat.length - 1}>
            {dict.watch.next}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Button>
          <Button variant="ghost" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="lesson-list" className="lg:hidden">
            <ListVideo className="size-[18px]" aria-hidden />
            {open ? dict.watch.hideList : dict.watch.showList}
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted">{dict.watch.autoNote}</p>
      </div>

      {open && (
        <aside id="lesson-list" aria-label={dict.watch.lessons} className="min-w-0">
          <div className="rounded-3xl border border-line bg-surface lg:sticky lg:top-24">
            <div className="border-b border-line p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-semibold">{dict.watch.lessons}</h2>
                <span className="text-sm text-muted tabular-nums">{fmt(dict.watch.progress, { p })}</span>
              </div>
              <ProgressBar value={p} />
            </div>
            <div className="max-h-[60vh] overflow-y-auto overscroll-contain p-2 lg:max-h-[calc(100dvh-16rem)]" data-lenis-prevent>
              {modules.map((m, mi) => (
                <section key={m.id} aria-label={m.title} className="mb-2">
                  <h3 className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted">
                    {mi + 1}. {m.title}
                  </h3>
                  <ul>
                    {m.lessons.map((l) => {
                      const i = flat.findIndex((x) => x.id === l.id);
                      const current = i === index;
                      const d = completed.includes(l.id);
                      return (
                        <li key={l.id}>
                          <button
                            ref={current ? activeRef : undefined}
                            onClick={() => go(i)}
                            aria-current={current ? "true" : undefined}
                            className={cn(
                              "flex min-h-14 w-full items-center gap-3 rounded-2xl px-3 py-2 text-start transition",
                              current ? "bg-fg text-bg" : "hover:bg-fg/6",
                            )}
                          >
                            {current ? (
                              <PlayCircle className="size-5 shrink-0" aria-hidden />
                            ) : d ? (
                              <CheckCircle2 className="size-5 shrink-0 text-accent" aria-label="✓" />
                            ) : (
                              <Circle className="size-5 shrink-0 text-muted" aria-hidden />
                            )}
                            <span className="min-w-0 flex-1">
                              <span className="line-clamp-2 text-sm font-medium">{l.title}</span>
                              <span className={cn("text-xs tabular-nums", current ? "opacity-70" : "text-muted")}>{formatDuration(l.duration, dict)}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
            <div className="border-t border-line p-4">
              <LocLink href={`/courses/${course.slug}`} className="text-sm font-semibold text-accent hover:underline">
                {dict.watch.backToCourse}
              </LocLink>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
