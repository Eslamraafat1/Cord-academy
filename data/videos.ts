/**
 * ──────────────────────────────────────────────────────────────
 *  DEMO VIDEO LINKS — change any video from this single file.
 *  Paste a normal YouTube / Vimeo page URL or a direct .mp4 link;
 *  lib/video.ts converts it into the right embed automatically.
 *  These are public sample videos, not real course content.
 * ──────────────────────────────────────────────────────────────
 */
export const DEMO_VIDEOS = {
  yt1: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  yt2: "https://youtu.be/YE7VzlLtp-4",
  yt3: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  vimeo1: "https://vimeo.com/76979871",
  mp4Bunny: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  mp4Elephants: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  mp4Sintel: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  mp4Tears: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  mp4Flower: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
} as const;

const ROTATION = Object.values(DEMO_VIDEOS);

/** Deterministic demo video for lesson N of a course (replace with real URLs in data/courses.ts). */
export function demoVideo(seed: number): string {
  return ROTATION[seed % ROTATION.length];
}
