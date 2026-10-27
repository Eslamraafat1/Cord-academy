"use client";

import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { LocLink } from "./LocLink";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "outline" | "ghost" | "glass" | "lime";
type Size = "sm" | "md" | "lg";

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "relative inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-200 active:scale-[0.97] disabled:opacity-50",
    size === "sm" && "h-10 px-4 text-sm",
    size === "md" && "h-12 px-6 text-[0.95rem]",
    size === "lg" && "h-14 px-8 text-base",
    variant === "primary" && "bg-fg text-bg hover:bg-accent hover:text-accent-fg hover:shadow-[0_10px_40px_-8px_var(--glow)]",
    variant === "lime" && "bg-lime text-[#0a1824] hover:shadow-[0_10px_40px_-8px_var(--lime)] hover:brightness-105",
    variant === "outline" && "border border-line bg-transparent hover:border-fg hover:bg-fg/5",
    variant === "ghost" && "hover:bg-fg/8",
    variant === "glass" && "glass hover:bg-surface",
    className,
  );
}

interface Common {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
}

export function Button({ variant, size, magnetic, className, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  const el = <button type="button" className={buttonClasses(variant, size, className)} {...rest} />;
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

export function ButtonLink({
  variant,
  size,
  magnetic,
  className,
  external,
  ...rest
}: Common & { external?: boolean } & ComponentProps<typeof LocLink>) {
  const classes = buttonClasses(variant, size, className);
  const el = external ? (
    <a className={classes} target="_blank" rel="noopener noreferrer" {...(rest as object)} />
  ) : (
    <LocLink className={classes} {...rest} />
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
