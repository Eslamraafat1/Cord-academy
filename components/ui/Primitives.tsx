import type { ReactNode } from "react";
import { Star, Code2, Palette, Database, Smartphone, Briefcase, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Category } from "@/types";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton", className)} />;
}

export function Rating({ value, count, className }: { value: number; count?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-semibold", className)}>
      <Star className="size-4 fill-accent text-accent" aria-hidden />
      <span className="tabular-nums">{value.toFixed(1)}</span>
      {count && <span className="font-normal text-muted">{count}</span>}
    </span>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/70 px-3 py-1 text-xs font-medium", className)}>
      {children}
    </span>
  );
}

const ICONS = { code: Code2, palette: Palette, database: Database, smartphone: Smartphone, briefcase: Briefcase, sparkles: Sparkles };
export function CategoryIcon({ icon, className }: { icon: Category["icon"]; className?: string }) {
  const I = ICONS[icon];
  return <I className={className} aria-hidden />;
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "start",
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: string;
  align?: "start" | "center";
  action?: ReactNode;
}) {
  return (
    <div data-fx="heading" className={cn("mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14", align === "center" && "justify-center text-center")}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="display text-[clamp(2rem,5vw,3.75rem)]">{title}</h2>
        {sub && <p className="mt-4 text-lg text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Container({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <div id={id} className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10", className)}>
      {children}
    </div>
  );
}

export function Logo({ className, name, nameClass }: { className?: string; name: string; nameClass?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-display text-lg font-bold tracking-tight", className)}>
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-fg text-bg">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
          <path d="M17 6.5A7 7 0 1 0 17 17.5" />
          <circle cx="17.5" cy="12" r="1.6" fill="var(--lime)" stroke="none" />
        </svg>
      </span>
      <span className={nameClass}>{name}</span>
    </span>
  );
}
