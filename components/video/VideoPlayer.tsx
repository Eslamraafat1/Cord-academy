"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { parseVideoUrl, withAutoplay } from "@/lib/video";
import { useI18n } from "../providers/I18nProvider";

interface Props {
  url: string;
  title: string;
  /** Shown behind the spinner until the provider is ready */
  poster?: ReactNode;
  autoPlay?: boolean;
}

/**
 * Responsive 16:9 player. Chooses a YouTube/Vimeo embed or native <video>
 * from the URL. Unmounting it (e.g. closing the modal) stops playback.
 * Remount with a `key` when the URL changes.
 */
export function VideoPlayer({ url, title, poster, autoPlay = true }: Props) {
  const { dict } = useI18n();
  const parsed = useMemo(() => parseVideoUrl(url), [url]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const errorText = !parsed.ok
    ? parsed.reason === "empty"
      ? dict.video.errorEmpty
      : parsed.reason === "unsupported"
        ? dict.video.errorUnsupported
        : dict.video.errorInvalid
    : failed
      ? dict.video.errorBlocked
      : null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[inherit] bg-black">
      {errorText ? (
        <div role="alert" className="absolute inset-0 grid place-items-center p-6 text-center text-white">
          <div className="max-w-md">
            <AlertTriangle className="mx-auto mb-3 size-8 text-accent" aria-hidden />
            <p className="font-semibold">{dict.video.errorTitle}</p>
            <p className="mt-1 text-sm text-white/70">{errorText}</p>
            {url && /^https?:\/\//i.test(url) && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm transition hover:bg-white/25"
              >
                {dict.video.openOriginal} <ExternalLink className="size-4" aria-hidden />
              </a>
            )}
          </div>
        </div>
      ) : (
        <>
          {!ready && (
            <div className="absolute inset-0" aria-live="polite">
              {poster}
              <div className="absolute inset-0 grid place-items-center bg-black/30 text-white">
                <div className="flex flex-col items-center gap-3">
                  <span className="animate-spin-slow size-10 rounded-full border-[3px] border-white/30 border-t-white" />
                  <span className="text-sm text-white/85">{dict.video.loading}</span>
                </div>
              </div>
            </div>
          )}
          {parsed.ok && parsed.provider === "html5" ? (
            <video
              key={parsed.src}
              src={parsed.src}
              title={title}
              controls
              playsInline
              preload="metadata"
              autoPlay={autoPlay}
              className="absolute inset-0 size-full bg-black object-contain"
              onLoadedData={() => setReady(true)}
              onError={() => setFailed(true)}
            />
          ) : parsed.ok ? (
            <iframe
              title={title}
              src={autoPlay ? withAutoplay(parsed) : parsed.src}
              className="absolute inset-0 size-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setReady(true)}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
