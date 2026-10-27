"use client";

import { useState, type ReactNode } from "react";
import { Check, Heart, Play, Share2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { useWishlist } from "@/lib/store";
import type { CourseView } from "@/types";
import { useI18n } from "../providers/I18nProvider";
import { useToast } from "../ui/Toast";
import { useVideo } from "../video/VideoProvider";

export function WishlistButton({ courseId, className, withLabel }: { courseId: string; className?: string; withLabel?: boolean }) {
  const { dict } = useI18n();
  const toast = useToast();
  const { has, toggle } = useWishlist();
  const saved = has(courseId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? dict.course.wishlistRemove : dict.course.wishlistAdd}
      onClick={(e) => {
        e.preventDefault();
        toggle(courseId);
        track("wishlist_toggle", { courseId, saved: !saved });
        toast(saved ? dict.toast.wishRemoved : dict.toast.wishAdded);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition",
        withLabel ? "h-12 border border-line bg-surface/70 px-5 text-sm font-semibold hover:border-fg" : "glass size-11 hover:bg-surface",
        className,
      )}
    >
      <Heart key={String(saved)} className={cn("size-[18px]", saved ? "animate-pop fill-accent text-accent" : "")} aria-hidden />
      {withLabel && (saved ? dict.course.wishlistRemove : dict.course.wishlistAdd)}
    </button>
  );
}

export function ShareButton({ title, className }: { title: string; className?: string }) {
  const { dict } = useI18n();
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    track("course_share", { title });
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled → fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast(dict.toast.linkCopied);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast(dict.toast.copyFailed, "error");
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={cn("inline-flex h-12 items-center gap-2 rounded-full border border-line bg-surface/70 px-5 text-sm font-semibold transition hover:border-fg", className)}
    >
      {copied ? <Check className="size-[18px]" aria-hidden /> : <Share2 className="size-[18px]" aria-hidden />}
      {dict.course.share}
    </button>
  );
}

/** Opens the video modal with a given URL. Wraps any visual child. */
export function PlayTrigger({
  url,
  title,
  course,
  className,
  label,
  children,
}: {
  url: string;
  title: string;
  course?: Pick<CourseView, "hue" | "pattern" | "thumbnail">;
  className?: string;
  label?: string;
  children?: ReactNode;
}) {
  const { dict } = useI18n();
  const open = useVideo();
  return (
    <button
      type="button"
      aria-label={label ?? `${dict.a11y.play}: ${title}`}
      onClick={() => open({ url, title, hue: course?.hue, pattern: course?.pattern, thumbnail: course?.thumbnail })}
      className={className}
    >
      {children ?? <Play className="size-5 fill-current" aria-hidden />}
    </button>
  );
}
