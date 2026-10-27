"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollIn } from "../animations/ScrollKit";
import { LayoutGrid, List, Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { fmt } from "@/lib/i18n/format";
import { lockScroll } from "@/lib/lenis";
import { track } from "@/lib/analytics";
import type { CourseView, Level } from "@/types";
import { useI18n } from "../providers/I18nProvider";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Primitives";
import { CourseCard } from "./CourseCard";

export interface FilterOption {
  id: string;
  name: string;
}

const PAGE = 6;
const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];
const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[ً-ٰٟ]/g, "");
const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

type Sort = "newest" | "popular" | "rating";

/** Writes filters to the URL without a navigation (the page stays static; the URL stays shareable). */
function patchUrl(patch: Record<string, string | null>) {
  const u = new URL(window.location.href);
  for (const [k, v] of Object.entries(patch)) {
    if (!v) u.searchParams.delete(k);
    else u.searchParams.set(k, v);
  }
  window.history.replaceState(null, "", u.pathname + u.search + u.hash);
}

export function ExplorerSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
      <Skeleton className="hidden h-[32rem] lg:block" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-[1.75rem] border border-line bg-surface">
            <Skeleton className="aspect-[16/10] rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CourseExplorer({ courses, categories, instructors }: { courses: CourseView[]; categories: FilterOption[]; instructors: FilterOption[] }) {
  const { dict } = useI18n();
  const sp = useSearchParams();

  const cats = list(sp.get("cat"));
  const levels = list(sp.get("level"));
  const ins = sp.get("ins") ?? "";
  const price = sp.get("price") ?? "all";
  const minRating = Number(sp.get("rating") ?? 0) || 0;
  const sort = (["newest", "popular", "rating"].includes(sp.get("sort") ?? "") ? sp.get("sort") : "newest") as Sort;
  const view = sp.get("view") === "list" ? "list" : "grid";
  const q = sp.get("q") ?? "";

  const [text, setText] = useState(q);
  const [drawer, setDrawer] = useState(false);
  const [more, setMore] = useState<{ key: string; n: number }>({ key: "", n: PAGE });

  const filterKey = `${q}|${cats}|${levels}|${ins}|${price}|${minRating}|${sort}`;
  const shown = more.key === filterKey ? more.n : PAGE;

  const results = useMemo(() => {
    const n = norm(text.trim());
    const out = courses.filter((c) => {
      if (n && !norm(`${c.title} ${c.description} ${c.categoryName} ${c.instructorName}`).includes(n)) return false;
      if (cats.length && !cats.includes(c.categoryId)) return false;
      if (levels.length && !levels.includes(c.level)) return false;
      if (ins && c.instructorId !== ins) return false;
      if (price === "free" && c.price !== 0) return false;
      if (price === "paid" && c.price === 0) return false;
      if (minRating && c.rating < minRating) return false;
      return true;
    });
    return out.sort((a, b) =>
      sort === "popular" ? b.students - a.students : sort === "rating" ? b.rating - a.rating || b.reviews - a.reviews : b.publishedAt.localeCompare(a.publishedAt),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses, text, filterKey]);

  const activeCount = cats.length + levels.length + (ins ? 1 : 0) + (price !== "all" ? 1 : 0) + (minRating ? 1 : 0);

  useEffect(() => {
    if (!drawer) return;
    const unlock = lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    document.addEventListener("keydown", onKey);
    return () => {
      unlock();
      document.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  const toggleIn = (key: "cat" | "level", cur: string[], id: string) => patchUrl({ [key]: (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]).join(",") || null });
  const clearAll = () => {
    setText("");
    patchUrl({ q: null, cat: null, level: null, ins: null, price: null, rating: null });
  };

  const filters = (
    <div className="space-y-8">
      <Group title={dict.courses.category}>
        {categories.map((c) => (
          <Check key={c.id} checked={cats.includes(c.id)} onChange={() => toggleIn("cat", cats, c.id)}>
            {c.name}
          </Check>
        ))}
      </Group>
      <Group title={dict.courses.level}>
        {LEVELS.map((l) => (
          <Check key={l} checked={levels.includes(l)} onChange={() => toggleIn("level", levels, l)}>
            {dict.common.level[l]}
          </Check>
        ))}
      </Group>
      <Group title={dict.courses.instructor}>
        <select
          value={ins}
          onChange={(e) => patchUrl({ ins: e.target.value || null })}
          aria-label={dict.courses.instructor}
          className="h-12 w-full rounded-xl border border-line bg-surface px-3 text-sm"
        >
          <option value="">{dict.common.all}</option>
          {instructors.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
      </Group>
      <Group title={dict.courses.price}>
        {[
          ["all", dict.courses.priceAll],
          ["free", dict.courses.priceFree],
          ["paid", dict.courses.pricePaid],
        ].map(([v, label]) => (
          <Radio key={v} name="price" checked={price === v} onChange={() => patchUrl({ price: v === "all" ? null : v })}>
            {label}
          </Radio>
        ))}
      </Group>
      <Group title={dict.courses.rating}>
        {[0, 4, 4.5, 4.8].map((r) => (
          <Radio key={r} name="rating" checked={minRating === r} onChange={() => patchUrl({ rating: r ? String(r) : null })}>
            {r ? `${r}+ ★` : dict.courses.ratingAny}
          </Radio>
        ))}
      </Group>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-3xl border border-line bg-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-semibold">{dict.courses.filters}</h2>
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-sm font-medium text-accent hover:underline">
                {dict.common.reset}
              </button>
            )}
          </div>
          {filters}
        </div>
      </aside>

      <div>
        {/* toolbar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1 basis-64">
            <Search className="pointer-events-none absolute start-4 top-1/2 size-[18px] -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="search"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                patchUrl({ q: e.target.value.trim() || null });
              }}
              onBlur={() => text && track("search", { query: text })}
              placeholder={dict.courses.searchPlaceholder}
              aria-label={dict.courses.searchPlaceholder}
              className="h-12 w-full rounded-full border border-line bg-surface ps-11 pe-4 outline-none transition placeholder:text-muted focus:border-accent"
            />
          </div>
          <Button variant="outline" size="md" onClick={() => setDrawer(true)} className="lg:hidden" aria-haspopup="dialog">
            <SlidersHorizontal className="size-[18px]" aria-hidden />
            {dict.courses.openFilters}
            {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-accent text-[11px] text-accent-fg">{activeCount}</span>}
          </Button>
          <label className="flex items-center gap-2 text-sm text-muted">
            <span className="sr-only sm:not-sr-only">{dict.courses.sort}</span>
            <select
              value={sort}
              onChange={(e) => patchUrl({ sort: e.target.value === "newest" ? null : e.target.value })}
              className="h-12 rounded-full border border-line bg-surface px-4 text-sm text-fg"
            >
              <option value="newest">{dict.courses.sortNewest}</option>
              <option value="popular">{dict.courses.sortPopular}</option>
              <option value="rating">{dict.courses.sortRating}</option>
            </select>
          </label>
          <div className="hidden items-center rounded-full border border-line bg-surface p-1 sm:flex" role="group" aria-label="View">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => patchUrl({ view: v === "grid" ? null : v })}
                aria-pressed={view === v}
                aria-label={v === "grid" ? dict.courses.grid : dict.courses.list}
                className={cn("grid size-10 place-items-center rounded-full transition", view === v ? "bg-fg text-bg" : "text-muted hover:text-fg")}
              >
                {v === "grid" ? <LayoutGrid className="size-[18px]" aria-hidden /> : <List className="size-[18px]" aria-hidden />}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-5 text-sm text-muted" aria-live="polite">
          {results.length === 1 ? dict.courses.resultsOne : fmt(dict.courses.results, { n: results.length })}
        </p>

        {results.length === 0 ? (
          <div className="grid place-items-center rounded-[2rem] border border-dashed border-line py-20 text-center">
            <SearchX className="mb-4 size-12 text-muted" aria-hidden />
            <h3 className="display text-2xl">{dict.courses.emptyTitle}</h3>
            <p className="mt-2 max-w-sm text-muted">{dict.courses.emptyText}</p>
            <Button className="mt-6" onClick={clearAll}>
              {dict.courses.clear}
            </Button>
          </div>
        ) : (
          <>
            <motion.div layout className={cn("grid gap-5", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
              <AnimatePresence mode="popLayout" initial={false}>
                {results.slice(0, shown).map((c, i) => (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    className="[&>article]:h-full"
                  >
                    <ScrollIn className="h-full [&>article]:h-full" y={70} rotateX={-10} delay={(i % 3) * 0.08}>
                      <CourseCard course={c} variant={view === "list" ? "list" : "grid"} />
                    </ScrollIn>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            {results.length > shown && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-sm text-muted">{fmt(dict.courses.showing, { a: shown, b: results.length })}</p>
                <Button variant="outline" onClick={() => setMore({ key: filterKey, n: shown + PAGE })}>
                  {dict.courses.loadMore}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* mobile filter drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div className="fixed inset-0 z-[85] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} data-lenis-prevent>
            <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} aria-hidden />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={dict.courses.filters}
              className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[2rem] bg-bg shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
            >
              <div className="flex items-center justify-between px-6 pt-5">
                <h2 className="display text-xl">{dict.courses.filters}</h2>
                <button onClick={() => setDrawer(false)} aria-label={dict.a11y.close} className="grid size-11 place-items-center rounded-full border border-line">
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6">{filters}</div>
              <div className="flex gap-3 border-t border-line p-4">
                <Button variant="outline" onClick={clearAll} className="flex-1">
                  {dict.common.reset}
                </Button>
                <Button onClick={() => setDrawer(false)} className="flex-[2]">
                  {dict.courses.closeFilters} ({results.length})
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold">{title}</legend>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg text-sm hover:text-accent">
      <input type="checkbox" checked={checked} onChange={onChange} className="size-[18px] accent-[var(--accent)]" />
      {children}
    </label>
  );
}

function Radio({ name, checked, onChange, children }: { name: string; checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg text-sm hover:text-accent">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="size-[18px] accent-[var(--accent)]" />
      {children}
    </label>
  );
}
