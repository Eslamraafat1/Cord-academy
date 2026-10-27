import type { VideoProvider } from "@/types";

export type ParsedVideo =
  | { ok: true; provider: VideoProvider; src: string; originalUrl: string }
  | { ok: false; reason: "empty" | "invalid" | "unsupported"; originalUrl: string };

const YT_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
]);
const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);
const FILE_RE = /\.(mp4|webm|ogv|ogg|mov|m4v)$/i;
const YT_ID = /^[\w-]{11}$/;

function youtubeId(u: URL): string | null {
  let id: string | null = null;
  if (u.hostname === "youtu.be") {
    id = u.pathname.split("/")[1] ?? null;
  } else if (u.pathname === "/watch") {
    id = u.searchParams.get("v");
  } else {
    const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
    id = m?.[1] ?? null;
  }
  return id && YT_ID.test(id) ? id : null;
}

function vimeoParts(u: URL): { id: string; hash: string | null } | null {
  const parts = u.pathname.split("/").filter(Boolean);
  const idx = parts.findIndex((p) => /^\d+$/.test(p));
  if (idx === -1) return null;
  const hashPart = parts[idx + 1];
  const hash = u.searchParams.get("h") ?? (hashPart && /^[a-f0-9]+$/i.test(hashPart) ? hashPart : null);
  return { id: parts[idx], hash };
}

/**
 * Turns any supported public video URL into something safe to render.
 * Regular YouTube/Vimeo page URLs are converted to their embed URLs;
 * only http(s) URLs are accepted. Private / restricted videos still
 * depend on the provider's own permissions (embedding may be refused).
 */
export function parseVideoUrl(raw: string | null | undefined): ParsedVideo {
  const originalUrl = (raw ?? "").trim();
  if (!originalUrl) return { ok: false, reason: "empty", originalUrl };

  let u: URL;
  try {
    u = new URL(originalUrl);
  } catch {
    return { ok: false, reason: "invalid", originalUrl };
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") {
    return { ok: false, reason: "invalid", originalUrl };
  }

  const host = u.hostname.toLowerCase();

  if (YT_HOSTS.has(host)) {
    const id = youtubeId(u);
    if (!id) return { ok: false, reason: "invalid", originalUrl };
    const start = u.searchParams.get("t") ?? u.searchParams.get("start");
    const qs = new URLSearchParams({ rel: "0", modestbranding: "1", playsinline: "1" });
    if (start && /^\d+s?$/.test(start)) qs.set("start", start.replace("s", ""));
    return {
      ok: true,
      provider: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${id}?${qs.toString()}`,
      originalUrl,
    };
  }

  if (VIMEO_HOSTS.has(host)) {
    const v = vimeoParts(u);
    if (!v) return { ok: false, reason: "invalid", originalUrl };
    const qs = new URLSearchParams({ dnt: "1", title: "0", byline: "0", portrait: "0" });
    if (v.hash) qs.set("h", v.hash);
    return {
      ok: true,
      provider: "vimeo",
      src: `https://player.vimeo.com/video/${v.id}?${qs.toString()}`,
      originalUrl,
    };
  }

  if (FILE_RE.test(u.pathname)) {
    return { ok: true, provider: "html5", src: u.toString(), originalUrl };
  }

  return { ok: false, reason: "unsupported", originalUrl };
}

export function detectProvider(url: string): VideoProvider {
  const p = parseVideoUrl(url);
  return p.ok ? p.provider : "html5";
}

/** Adds the autoplay flag the way each provider expects it. */
export function withAutoplay(video: Extract<ParsedVideo, { ok: true }>): string {
  if (video.provider === "html5") return video.src;
  const u = new URL(video.src);
  u.searchParams.set("autoplay", "1");
  return u.toString();
}
