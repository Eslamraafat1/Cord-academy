"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/providers/I18nProvider";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  const { dict } = useI18n();
  return (
    <section className="relative isolate grid min-h-[100svh] place-items-center overflow-hidden px-4 pt-24 text-center">
      <div aria-hidden className="animate-drift absolute start-[15%] top-[20%] -z-10 size-72 rounded-full bg-accent/30 blur-[90px]" />
      <div aria-hidden className="animate-drift absolute bottom-[10%] end-[15%] -z-10 size-72 rounded-full bg-accent2/25 blur-[90px] [animation-delay:-9s]" />

      <div>
        <div dir="ltr" className="relative inline-flex items-center justify-center gap-2 sm:gap-4" aria-hidden>
          {["4", "0", "4"].map((d, i) => (
            <motion.span
              key={i}
              className={i === 1 ? "display grid size-[clamp(6rem,22vw,14rem)] place-items-center rounded-full bg-gradient-to-br from-accent via-accent2 to-lime text-[clamp(4rem,15vw,9rem)] text-[#0a1824]" : "display gradient-text text-[clamp(6rem,26vw,16rem)] leading-none"}
              animate={{ y: [0, i === 1 ? -22 : 12, 0], rotate: i === 1 ? [0, 360] : 0 }}
              transition={{ y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 24, repeat: Infinity, ease: "linear" } }}
            >
              {d}
            </motion.span>
          ))}
        </div>
        <h1 className="display mt-4 text-[clamp(1.75rem,4vw,3rem)]">
          <span className="sr-only">{dict.notFound.code} — </span>
          {dict.notFound.title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">{dict.notFound.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" size="lg" magnetic>
            {dict.notFound.cta}
          </ButtonLink>
          <ButtonLink href="/courses" size="lg" variant="outline">
            {dict.notFound.cta2}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
