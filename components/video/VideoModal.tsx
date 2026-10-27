"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { lockScroll } from "@/lib/lenis";
import { CourseCover } from "../courses/CourseCover";
import { useI18n } from "../providers/I18nProvider";
import { VideoPlayer } from "./VideoPlayer";
import type { OpenVideoInput } from "./VideoProvider";

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, video[controls], [tabindex]:not([tabindex="-1"])';

function Modal({ video, onClose }: { video: OpenVideoInput; onClose: () => void }) {
  const { dict } = useI18n();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // scroll lock + focus management
  useEffect(() => {
    const unlock = lockScroll();
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => {
      unlock();
      previous?.focus?.();
    };
  }, []);

  // Escape + focus trap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const els = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const poster = <CourseCover hue={video.hue ?? 265} pattern={video.pattern ?? 0} thumbnail={video.thumbnail} />;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      data-lenis-prevent
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} aria-hidden />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={video.title}
        className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden bg-[#173851] text-white shadow-2xl sm:rounded-3xl max-sm:h-full max-sm:justify-center"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <h2 className="truncate text-sm font-semibold sm:text-base">{video.title}</h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={dict.video.close}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:outline-white"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <VideoPlayer key={video.url} url={video.url} title={video.title} poster={poster} />
      </motion.div>
    </motion.div>
  );
}

/** Lives inside the lazily-loaded chunk so AnimatePresence and the modal mount/unmount together. */
export default function VideoModalHost({ video, onClose }: { video: OpenVideoInput | null; onClose: () => void }) {
  return <AnimatePresence>{video && <Modal key={video.url} video={video} onClose={onClose} />}</AnimatePresence>;
}
