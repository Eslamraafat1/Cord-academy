"use client";

import { useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, CheckCircle2, Heart, LayoutDashboard, Settings, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { fmt } from "@/lib/i18n/format";
import { useLocalStore, useProgress, useWishlist } from "@/lib/store";
import type { CourseView } from "@/types";
import { useI18n } from "../providers/I18nProvider";
import { useTheme } from "../providers/ThemeProvider";
import { useToast } from "../ui/Toast";
import { Button, ButtonLink } from "../ui/Button";
import { LocLink } from "../ui/LocLink";
import { CourseCard } from "../courses/CourseCard";
import { CourseCover } from "../courses/CourseCover";
import { ProgressBar } from "../sections/ContinueLearning";
import { LangSwitcher } from "../layout/LangSwitcher";

export function DashboardNav() {
  const { dict, href } = useI18n();
  const pathname = usePathname();
  const items = [
    { to: "/dashboard", label: dict.dashboard.overview, Icon: LayoutDashboard },
    { to: "/dashboard/courses", label: dict.dashboard.myCourses, Icon: BookOpen },
    { to: "/dashboard/wishlist", label: dict.dashboard.wishlist, Icon: Heart },
    { to: "/dashboard/settings", label: dict.dashboard.settings, Icon: Settings },
  ];
  return (
    <nav aria-label={dict.nav.dashboard} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:px-0 [&::-webkit-scrollbar]:hidden">
      {items.map(({ to, label, Icon }) => {
        const on = pathname === href(to);
        return (
          <LocLink
            key={to}
            href={to}
            aria-current={on ? "page" : undefined}
            className={cn(
              "flex h-12 shrink-0 items-center gap-3 rounded-2xl px-4 text-sm font-semibold transition",
              on ? "bg-fg text-bg" : "text-muted hover:bg-fg/6 hover:text-fg",
            )}
          >
            <Icon className="size-[18px]" aria-hidden />
            {label}
          </LocLink>
        );
      })}
    </nav>
  );
}

function useStarted(courses: CourseView[], lessonCounts: Record<string, number>) {
  const { done, percent } = useProgress();
  return courses
    .filter((c) => (done[c.id]?.length ?? 0) > 0)
    .map((c) => ({ course: c, p: percent(c.id, lessonCounts[c.id]), n: done[c.id].length }));
}

export function Overview({ courses, lessonCounts }: { courses: CourseView[]; lessonCounts: Record<string, number> }) {
  const { dict } = useI18n();
  const { ids } = useWishlist();
  const started = useStarted(courses, lessonCounts);
  const completedLessons = started.reduce((n, s) => n + s.n, 0);
  const stats = [
    { label: dict.dashboard.inProgress, v: started.filter((s) => s.p < 100).length, Icon: BookOpen },
    { label: dict.dashboard.completed, v: completedLessons, Icon: CheckCircle2 },
    { label: dict.dashboard.saved, v: ids.length, Icon: Heart },
  ];
  return (
    <div className="space-y-10">
      <p className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted">{dict.common.localOnly}</p>
      <dl className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, v, Icon }) => (
          <div key={label} className="rounded-3xl border border-line bg-surface p-6">
            <Icon className="mb-4 size-6 text-accent" aria-hidden />
            <dd className="display text-5xl tabular-nums">{v}</dd>
            <dt className="mt-1 text-sm text-muted">{label}</dt>
          </div>
        ))}
      </dl>
      <MyCourses courses={courses} lessonCounts={lessonCounts} compact />
    </div>
  );
}

export function MyCourses({ courses, lessonCounts, compact }: { courses: CourseView[]; lessonCounts: Record<string, number>; compact?: boolean }) {
  const { dict } = useI18n();
  const { last } = useProgress();
  const started = useStarted(courses, lessonCounts);

  if (started.length === 0)
    return (
      <Empty text={dict.dashboard.emptyCourses} cta={dict.dashboard.browse} />
    );
  return (
    <div className="space-y-4">
      {compact && <h2 className="display text-2xl">{dict.dashboard.myCourses}</h2>}
      {started.map(({ course: c, p }) => (
        <LocLink
          key={c.id}
          href={`/courses/${c.slug}/watch${last[c.id] ? `?lesson=${last[c.id]}` : ""}`}
          className="group flex items-center gap-4 rounded-3xl border border-line bg-surface p-3 pe-6 transition hover:border-fg"
        >
          <span className="relative size-20 shrink-0 overflow-hidden rounded-2xl sm:size-24">
            <CourseCover hue={c.hue} pattern={c.pattern} thumbnail={c.thumbnail} sizes="96px" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="line-clamp-1 font-semibold">{c.title}</span>
            <span className="text-sm text-muted">{fmt(dict.continue.complete, { p })}</span>
            <ProgressBar value={p} className="mt-2" />
          </span>
        </LocLink>
      ))}
    </div>
  );
}

export function WishlistView({ courses }: { courses: CourseView[] }) {
  const { dict } = useI18n();
  const { ids } = useWishlist();
  const saved = courses.filter((c) => ids.includes(c.id));
  if (!saved.length) return <Empty text={dict.dashboard.emptyWishlist} cta={dict.dashboard.browse} />;
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {saved.map((c) => (
        <div key={c.id} className="[&>article]:h-full">
          <CourseCard course={c} />
        </div>
      ))}
    </div>
  );
}

function Empty({ text, cta }: { text: string; cta: string }) {
  return (
    <div className="grid place-items-center gap-5 rounded-[2rem] border border-dashed border-line py-16 text-center">
      <p className="max-w-sm text-muted">{text}</p>
      <ButtonLink href="/courses">{cta}</ButtonLink>
    </div>
  );
}

const EMPTY_PROFILE = { name: "", email: "", bio: "" };

export function SettingsView() {
  const { dict } = useI18n();
  const toast = useToast();
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useLocalStore("ca:profile", EMPTY_PROFILE);
  const [draft, setDraft] = useState<typeof EMPTY_PROFILE | null>(null);
  const form = draft ?? saved;

  function submit(e: FormEvent) {
    e.preventDefault();
    setSaved(form);
    setDraft(null);
    toast(dict.toast.saved);
  }

  function clearData() {
    for (const k of ["ca:wishlist", "ca:recent", "ca:progress", "ca:last-lesson", "ca:profile"]) {
      try {
        localStorage.removeItem(k);
      } catch {}
    }
    // notify the stores in this tab; they re-read on next render
    window.dispatchEvent(new StorageEvent("storage", { key: null }));
    toast(dict.dashboard.clearConfirm);
    window.location.reload();
  }

  const field = "h-12 w-full rounded-2xl border border-line bg-surface px-4 outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15";

  return (
    <div className="max-w-2xl space-y-8">
      <p className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted">{dict.common.localOnly}</p>

      <form onSubmit={submit} className="space-y-5 rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="display text-2xl">{dict.dashboard.profile}</h2>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">{dict.dashboard.displayName}</span>
          <input className={field} value={form.name} onChange={(e) => setDraft({ ...form, name: e.target.value })} autoComplete="name" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">{dict.dashboard.emailAddr}</span>
          <input type="email" dir="ltr" className={cn(field, "text-start")} value={form.email} onChange={(e) => setDraft({ ...form, email: e.target.value })} autoComplete="email" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">{dict.dashboard.bio}</span>
          <textarea rows={4} className={cn(field, "h-auto py-3")} value={form.bio} onChange={(e) => setDraft({ ...form, bio: e.target.value })} />
        </label>
        <Button type="submit">{dict.common.save}</Button>
      </form>

      <section className="space-y-5 rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="display text-2xl">{dict.dashboard.prefs}</h2>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-medium">{dict.dashboard.prefTheme}</span>
          <div className="flex gap-2" role="group" aria-label={dict.dashboard.prefTheme}>
            {(["light", "dark"] as const).map((t) => (
              <Button key={t} variant={theme === t ? "primary" : "outline"} size="sm" aria-pressed={theme === t} onClick={() => setTheme(t)}>
                {t === "light" ? "☀︎ Light" : "☾ Dark"}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-medium">{dict.dashboard.prefLang}</span>
          <LangSwitcher />
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-accent2/40 bg-surface p-6 sm:p-8">
        <h2 className="display text-2xl">{dict.dashboard.danger}</h2>
        <Button variant="outline" onClick={clearData}>
          <Trash2 className="size-[18px]" aria-hidden />
          {dict.dashboard.clearData}
        </Button>
      </section>
    </div>
  );
}
