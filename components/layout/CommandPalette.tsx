"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, FileText, GraduationCap, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { lockScroll } from "@/lib/lenis";
import { track } from "@/lib/analytics";
import { useI18n } from "../providers/I18nProvider";

export interface SearchEntry {
  slug: string;
  title: string;
  meta: string;
}

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[ً-ٰٟ]/g, "");

export function CommandPalette({ courses }: { courses: SearchEntry[] }) {
  const { dict, href } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const pages = useMemo(
    () => [
      { id: "p-home", label: dict.nav.home, to: "/" },
      { id: "p-courses", label: dict.nav.courses, to: "/courses" },
      { id: "p-dash", label: dict.nav.dashboard, to: "/dashboard" },
      { id: "p-wish", label: dict.dashboard.wishlist, to: "/dashboard/wishlist" },
      { id: "p-about", label: dict.nav.about, to: "/about" },
      { id: "p-contact", label: dict.nav.contact, to: "/contact" },
      { id: "p-faq", label: dict.nav.faq, to: "/faq" },
    ],
    [dict],
  );

  const results = useMemo(() => {
    const n = norm(q.trim());
    const match = (s: string) => !n || norm(s).includes(n);
    return [
      ...pages.filter((p) => match(p.label)).map((p) => ({ id: p.id, label: p.label, meta: "", to: p.to, kind: "page" as const })),
      ...courses
        .filter((c) => match(`${c.title} ${c.meta}`))
        .map((c) => ({ id: `c-${c.slug}`, label: c.title, meta: c.meta, to: `/courses/${c.slug}`, kind: "course" as const })),
    ];
  }, [q, pages, courses]);

  // open / close triggers
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    const prev = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => {
      unlock();
      prev?.focus?.();
    };
  }, [open]);

  function close() {
    setOpen(false);
    setQ("");
    setActive(0);
  }
  function go(i: number) {
    const r = results[i];
    if (!r) return;
    track("search", { query: q, to: r.to });
    close();
    router.push(href(r.to));
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(active);
    }
  }

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onKeyDown={onKeyDown}
          data-lenis-prevent
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={dict.palette.title}
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <Search className="size-5 text-muted" aria-hidden />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[active] ? `opt-${results[active].id}` : undefined}
                aria-label={dict.palette.title}
                placeholder={dict.palette.placeholder}
                className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted"
              />
            </div>
            <ul id="palette-list" ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-4 py-8 text-center text-muted">{dict.palette.none}</li>}
              {results.map((r, i) => (
                <li
                  key={r.id}
                  id={`opt-${r.id}`}
                  role="option"
                  aria-selected={i === active}
                  data-index={i}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(i)}
                  className={cn("flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5", i === active && "bg-fg/8")}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-bg2">
                    {r.kind === "course" ? <GraduationCap className="size-4" aria-hidden /> : <FileText className="size-4" aria-hidden />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{r.label}</span>
                    {r.meta && <span className="block truncate text-xs text-muted">{r.meta}</span>}
                  </span>
                  {i === active && <CornerDownLeft className="size-4 text-muted" aria-hidden />}
                </li>
              ))}
            </ul>
            <p className="hidden border-t border-line px-5 py-3 text-xs text-muted sm:block">{dict.palette.hint}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
