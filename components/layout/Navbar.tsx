"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { lockScroll } from "@/lib/lenis";
import { useI18n } from "../providers/I18nProvider";
import { LocLink } from "../ui/LocLink";
import { ButtonLink } from "../ui/Button";
import { Logo } from "../ui/Primitives";
import { ThemeToggle } from "./ThemeToggle";
import { LangSwitcher } from "./LangSwitcher";

export function openPalette() {
  window.dispatchEvent(new Event("open-palette"));
}

export function Navbar() {
  const { lang, dict, href } = useI18n();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 240 && !menu);
  });

  useEffect(() => {
    if (!menu) return;
    const unlock = lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("keydown", onKey);
    return () => {
      unlock();
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const links = [
    { label: dict.nav.home, path: "/" },
    { label: dict.nav.courses, path: "/courses" },
    { label: dict.nav.paths, path: "/#paths" },
    { label: dict.nav.about, path: "/about" },
    { label: dict.nav.contact, path: "/contact" },
  ];
  // the burger sits at the inline-end edge, which is the left side in RTL
  const origin = lang === "ar" ? "2.5rem" : "calc(100% - 2.5rem)";
  const isActive = (p: string) => (p.includes("#") ? false : pathname === href(p));

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
      >
        <div
          className={cn(
            "mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 rounded-full ps-5 pe-2.5 transition-all duration-300",
            scrolled ? "glass shadow-card" : "border border-transparent",
          )}
        >
          <LocLink href="/" aria-label={dict.meta.name} className="shrink-0">
            <Logo name={dict.meta.name} nameClass="hidden min-[400px]:inline" />
          </LocLink>

          <nav aria-label={dict.a11y.mainNav} className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <LocLink
                key={l.path}
                href={l.path}
                aria-current={isActive(l.path) ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:text-fg",
                  isActive(l.path) && "text-fg",
                )}
              >
                {isActive(l.path) && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-fg/8" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                {l.label}
              </LocLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openPalette}
              aria-label={dict.a11y.search}
              className="group hidden h-11 items-center gap-2 rounded-full border border-line bg-surface/60 px-4 text-sm text-muted transition hover:border-fg hover:text-fg md:flex"
            >
              <Search className="size-[18px]" aria-hidden />
              <span className="hidden xl:inline">{dict.nav.search}</span>
              <kbd className="ltr-iso rounded-md border border-line px-1.5 py-0.5 text-[10px] font-semibold">{dict.palette.shortcut}</kbd>
            </button>
            <button
              type="button"
              onClick={openPalette}
              aria-label={dict.a11y.search}
              className="grid size-11 place-items-center rounded-full border border-line bg-surface/60 md:hidden"
            >
              <Search className="size-[18px]" aria-hidden />
            </button>
            <div className="hidden sm:block">
              <LangSwitcher />
            </div>
            <ThemeToggle />
            <ButtonLink href="/register" size="sm" magnetic className="hidden lg:inline-flex">
              {dict.nav.register}
            </ButtonLink>
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-label={dict.a11y.openMenu}
              aria-expanded={menu}
              className="grid size-11 place-items-center rounded-full bg-fg text-bg lg:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            key="menu"
            role="dialog"
            aria-modal="true"
            aria-label={dict.a11y.mainNav}
            data-lenis-prevent
            className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-bg px-6 pb-8 pt-4 lg:hidden"
            initial={{ clipPath: `circle(0% at ${origin} 2.5rem)` }}
            animate={{ clipPath: `circle(150% at ${origin} 2.5rem)` }}
            exit={{ clipPath: `circle(0% at ${origin} 2.5rem)` }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex h-16 items-center justify-between">
              <Logo name={dict.meta.name} />
              <button
                type="button"
                onClick={() => setMenu(false)}
                aria-label={dict.a11y.closeMenu}
                autoFocus
                className="grid size-11 place-items-center rounded-full border border-line"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <nav aria-label={dict.a11y.mainNav} className="mt-8 flex flex-1 flex-col gap-1">
              {[...links, { label: dict.nav.dashboard, path: "/dashboard" }, { label: dict.nav.faq, path: "/faq" }].map((l, i) => (
                <motion.div key={l.path} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                  <LocLink
                    href={l.path}
                    onClick={() => setMenu(false)}
                    className="display block border-b border-line py-4 text-[clamp(1.75rem,8vw,2.5rem)] transition hover:text-accent"
                  >
                    {l.label}
                  </LocLink>
                </motion.div>
              ))}
            </nav>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LangSwitcher />
              <ButtonLink href="/register" onClick={() => setMenu(false)} className="flex-1">
                {dict.nav.register}
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
