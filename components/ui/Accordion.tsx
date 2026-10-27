"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

/** Accessible accordion (button + region, aria-expanded). One open at a time by default. */
export function Accordion({ items, multiple = false, defaultOpen, className }: { items: AccordionItem[]; multiple?: boolean; defaultOpen?: string; className?: string }) {
  const [open, setOpen] = useState<string[]>(defaultOpen ? [defaultOpen] : []);
  const base = useId();

  const toggle = (id: string) =>
    setOpen((p) => (p.includes(id) ? p.filter((x) => x !== id) : multiple ? [...p, id] : [id]));

  return (
    <div className={cn("divide-y divide-line rounded-3xl border border-line bg-surface/60", className)}>
      {items.map((it) => {
        const isOpen = open.includes(it.id);
        const panel = `${base}-${it.id}-panel`;
        const btn = `${base}-${it.id}-btn`;
        return (
          <div key={it.id}>
            <h3>
              <button
                id={btn}
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => toggle(it.id)}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-start font-semibold transition hover:text-accent sm:px-6"
              >
                <span>{it.title}</span>
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border border-line transition-transform duration-300",
                    isOpen && "rotate-45 bg-fg text-bg",
                  )}
                >
                  <Plus className="size-4" aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panel}
                  role="region"
                  aria-labelledby={btn}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-muted sm:px-6">{it.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
