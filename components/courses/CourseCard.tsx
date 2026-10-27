"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Clock, Play, PlayCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCompact, formatDuration, fmt } from "@/lib/i18n/format";
import type { CourseView } from "@/types";
import { useI18n } from "../providers/I18nProvider";
import { LocLink } from "../ui/LocLink";
import { Pill, Rating } from "../ui/Primitives";
import { CourseCover } from "./CourseCover";
import { PlayTrigger, WishlistButton } from "./CourseActions";

const NEW_SINCE = "2026-10-01";

export function CourseCard({
  course,
  variant = "grid",
  priority,
  className,
}: {
  course: CourseView;
  variant?: "grid" | "list" | "feature" | "stack";
  priority?: boolean;
  className?: string;
}) {
  const { dict, lang } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 140, damping: 18 });
  const sy = useSpring(py, { stiffness: 140, damping: 18 });
  const coverX = useTransform(sx, (v) => v * -12);
  const coverY = useTransform(sy, (v) => v * -9);
  const tiltX = useTransform(sy, (v) => v * -3);
  const tiltY = useTransform(sx, (v) => v * 3);

  const isList = variant === "list";
  const isFeature = variant === "feature";
  const isStack = variant === "stack";
  const price = course.price === 0 ? dict.common.free : `${dict.common.currency}${course.price}`;

  return (
    <motion.article
      ref={ref}
      style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}
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
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "glow-border group relative flex overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-card",
        isStack ? "flex-col md:flex-row" : isList ? "flex-col sm:flex-row" : "flex-col",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden", isStack ? "aspect-video md:aspect-auto md:w-[46%] md:shrink-0" : isList ? "aspect-video sm:aspect-auto sm:w-72 sm:shrink-0 lg:w-80" : isFeature ? "aspect-[4/3]" : "aspect-[16/10]")}>
        <motion.div style={{ x: coverX, y: coverY }} className="absolute -inset-3 transition-transform duration-700 ease-out group-hover:scale-[1.08]">
          <CourseCover hue={course.hue} pattern={course.pattern} thumbnail={course.thumbnail} priority={priority} />
        </motion.div>
        <LocLink href={`/courses/${course.slug}`} aria-label={course.title} className="absolute inset-0 z-[1]" tabIndex={-1} />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        <div className="absolute start-3 top-3 z-[3] flex gap-1.5">
          {course.publishedAt >= NEW_SINCE && <span className="rounded-full bg-lime px-2.5 py-1 text-[11px] font-bold text-[#0a1824]">{dict.common.new}</span>}
          {course.trending && <span className="rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">{dict.common.trending}</span>}
        </div>
        <WishlistButton courseId={course.id} className="absolute end-3 top-3 z-[3]" />

        <PlayTrigger
          url={course.videoUrl}
          title={course.title}
          course={course}
          className="absolute inset-0 z-[3] m-auto grid size-14 place-items-center rounded-full bg-white/90 text-black shadow-xl transition duration-300 hover:scale-110 sm:scale-90 sm:opacity-0 sm:group-hover:scale-100 sm:group-hover:opacity-100 sm:focus-visible:scale-100 sm:focus-visible:opacity-100"
        >
          <Play className="size-5 translate-x-px fill-current" aria-hidden />
        </PlayTrigger>
      </div>

      <div className={cn("flex flex-1 flex-col gap-3 p-5 sm:p-6", isStack && "md:justify-center md:gap-4 md:p-10")}>
        <div className="flex flex-wrap items-center gap-2">
          <Pill>{course.categoryName}</Pill>
          <span className="text-xs font-medium text-muted">{dict.common.level[course.level]}</span>
        </div>
        <h3 className={cn("display text-balance", isStack ? "text-2xl md:text-4xl" : isFeature ? "text-2xl" : "text-xl")} style={{ letterSpacing: lang === "ar" ? 0 : "-0.02em" }}>
          <LocLink href={`/courses/${course.slug}`} className="after:absolute after:inset-0 after:z-0 after:content-[''] hover:text-accent focus-visible:outline-offset-4">
            <span className="relative z-[1]">{course.title}</span>
          </LocLink>
        </h3>
        {(isList || isFeature || isStack) && <p className={cn("text-sm text-muted", isStack ? "line-clamp-2 md:line-clamp-3 md:text-base" : "line-clamp-2")}>{course.description}</p>}
        <p className="text-sm text-muted">
          {dict.common.by} <span className="font-medium text-fg">{course.instructorName}</span>
        </p>

        <div className={cn("flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-4 text-sm", isStack ? "mt-2 md:mt-4" : "mt-auto")}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted">
            <Rating value={course.rating} count={fmt(dict.common.reviews, { n: formatCompact(course.reviews, lang) })} className="text-fg" />
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden />
              {formatDuration(course.durationMin, dict)}
            </span>
            <span className="inline-flex items-center gap-1">
              <PlayCircle className="size-3.5" aria-hidden />
              {fmt(dict.common.lessons, { n: course.lessonsCount })}
            </span>
          </div>
          <span className={cn("relative z-[1] text-base font-bold", course.price === 0 && "text-accent")}>{price}</span>
        </div>
      </div>
    </motion.article>
  );
}
