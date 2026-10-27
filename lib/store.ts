"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed store (SSR-safe via useSyncExternalStore).
 * Data lives only in the visitor's browser — there is no backend yet.
 * Swap these hooks for API calls once an account system exists.
 */
type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function subscribeKey(key: string, cb: Listener) {
  let set = listeners.get(key);
  if (!set) listeners.set(key, (set = new Set()));
  set.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === key) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    set!.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function read<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return fallback;
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: T = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode / quota): keep in-memory only */
    cache.set(key, { raw: JSON.stringify(value), value });
  }
  listeners.get(key)?.forEach((l) => l());
}

export function useLocalStore<T>(key: string, fallback: T) {
  const value = useSyncExternalStore(
    useCallback((cb) => subscribeKey(key, cb), [key]),
    () => read(key, fallback),
    () => fallback,
  );
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = read(key, fallback);
      write(key, typeof next === "function" ? (next as (p: T) => T)(prev) : next);
    },
    [key, fallback],
  );
  return [value, set] as const;
}

const EMPTY_IDS: string[] = [];
const EMPTY_PROGRESS: Record<string, string[]> = {};
const EMPTY_LAST: Record<string, string> = {};

export function useWishlist() {
  const [ids, setIds] = useLocalStore<string[]>("ca:wishlist", EMPTY_IDS);
  const toggle = useCallback(
    (id: string) =>
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setIds],
  );
  return { ids, has: (id: string) => ids.includes(id), toggle };
}

export function useRecentlyViewed() {
  const [ids, setIds] = useLocalStore<string[]>("ca:recent", EMPTY_IDS);
  const push = useCallback(
    (id: string) => setIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8)),
    [setIds],
  );
  return { ids, push };
}

export function useProgress() {
  const [done, setDone] = useLocalStore<Record<string, string[]>>("ca:progress", EMPTY_PROGRESS);
  const [last, setLast] = useLocalStore<Record<string, string>>("ca:last-lesson", EMPTY_LAST);

  const toggleLesson = useCallback(
    (courseId: string, lessonId: string) =>
      setDone((prev) => {
        const cur = prev[courseId] ?? [];
        const next = cur.includes(lessonId) ? cur.filter((x) => x !== lessonId) : [...cur, lessonId];
        return { ...prev, [courseId]: next };
      }),
    [setDone],
  );
  const setLastLesson = useCallback(
    (courseId: string, lessonId: string) => setLast((prev) => (prev[courseId] === lessonId ? prev : { ...prev, [courseId]: lessonId })),
    [setLast],
  );
  const percent = (courseId: string, total: number) =>
    total ? Math.round(((done[courseId]?.length ?? 0) / total) * 100) : 0;

  return { done, last, toggleLesson, setLastLesson, percent };
}
