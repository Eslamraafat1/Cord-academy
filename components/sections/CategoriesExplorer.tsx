"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { fmt } from "@/lib/i18n/format";
import type { CourseView } from "@/types";
import { useI18n } from "../providers/I18nProvider";
import { CategoryIcon, Container, SectionHeading } from "../ui/Primitives";
import { CourseCard } from "../courses/CourseCard";
import type { Category } from "@/types";

export interface CategoryView {
  id: string;
  name: string;
  icon: Category["icon"];
  hue: number;
}

/** Category filter chips; the course list re-flows with a shared-layout transition. */
export function CategoriesExplorer({ categories, courses }: { categories: CategoryView[]; courses: CourseView[] }) {
  const { dict } = useI18n();
  const [active, setActive] = useState<string>("all");
  const list = (active === "all" ? courses : courses.filter((c) => c.categoryId === active)).slice(0, 6);
  const count = (id: string) => courses.filter((c) => c.categoryId === id).length;

  return (
    <section className="bg-bg2 py-24 sm:py-28">
      <Container>
        <SectionHeading eyebrow={dict.categories.eyebrow} title={dict.categories.title} sub={dict.categories.sub} />

        <div role="tablist" aria-label={dict.categories.title} className="-mx-4 mb-10 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
          {[{ id: "all", name: dict.common.all, icon: null, hue: 265 }, ...categories].map((c) => {
            const on = active === c.id;
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={on}
                aria-controls="category-panel"
                onClick={() => setActive(c.id)}
                className={cn(
                  "relative flex h-12 shrink-0 items-center gap-2.5 rounded-full border px-5 text-sm font-semibold transition-colors",
                  on ? "border-transparent text-bg" : "border-line bg-surface hover:border-fg",
                )}
              >
                {on && <motion.span layoutId="cat-pill" className="absolute inset-0 -z-0 rounded-full bg-fg" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative z-10 flex items-center gap-2.5">
                  {c.icon && <CategoryIcon icon={c.icon} className="size-[18px]" />}
                  {c.name}
                  {c.id !== "all" && <span className={cn("text-xs font-normal", on ? "opacity-70" : "text-muted")}>{count(c.id)}</span>}
                </span>
              </button>
            );
          })}
        </div>

        <div id="category-panel" role="tabpanel" aria-live="polite">
          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="[&>article]:h-full"
                >
                  <CourseCard course={c} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {list.length === 0 && <p className="py-16 text-center text-muted">{dict.categories.empty}</p>}
          {active !== "all" && list.length > 0 && <p className="sr-only">{fmt(dict.categories.courses, { n: list.length })}</p>}
        </div>
      </Container>
    </section>
  );
}
