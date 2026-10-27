/**
 * Analytics integration point. Replace the body with GA4 / PostHog / Plausible, etc.
 * Currently pushes to window.dataLayer when present, and logs in development.
 */
export type AnalyticsEvent =
  | "video_open"
  | "video_complete_lesson"
  | "wishlist_toggle"
  | "course_share"
  | "search"
  | "contact_submit"
  | "newsletter_submit";

export function track(event: AnalyticsEvent, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer?.push({ event, ...params });
  if (process.env.NODE_ENV === "development") console.debug("[analytics]", event, params);
}
