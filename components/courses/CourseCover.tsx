import Image from "next/image";
import { cn } from "@/lib/cn";
import { tone } from "@/lib/palette";

interface Props {
  hue: number;
  pattern: 0 | 1 | 2 | 3;
  title?: string;
  thumbnail?: string;
  className?: string;
  /** next/image `sizes` for a remote thumbnail */
  sizes?: string;
  priority?: boolean;
}

/**
 * Generative cover art — no image downloads, theme-independent.
 * Provide `thumbnail` on a course (host whitelisted in next.config.ts) to use a real image instead.
 */
export function CourseCover({ hue, pattern, thumbnail, className, sizes = "(max-width: 768px) 100vw, 33vw", priority }: Props) {
  const t = tone(hue);
  const a = t.a;
  const b = t.b;

  return (
    <div
      aria-hidden
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${t.from} 0%, ${t.to} 100%)` }}
    >
      {thumbnail ? (
        <Image src={thumbnail} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
          <defs>
            <radialGradient id={`g1-${hue}-${pattern}`} cx="75%" cy="20%" r="70%">
              <stop offset="0" stopColor={b} stopOpacity="0.95" />
              <stop offset="1" stopColor={a} stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`g2-${hue}-${pattern}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={a} />
              <stop offset="1" stopColor={b} />
            </linearGradient>
          </defs>
          <rect width="400" height="260" fill={`url(#g1-${hue}-${pattern})`} />
          {pattern === 0 &&
            [40, 80, 120, 160, 200].map((r, i) => (
              <circle key={r} cx="300" cy="70" r={r} fill="none" stroke="white" strokeOpacity={0.35 - i * 0.05} strokeWidth="1.5" />
            ))}
          {pattern === 1 &&
            Array.from({ length: 14 }, (_, i) => (
              <line key={i} x1={-40 + i * 40} y1="280" x2={120 + i * 40} y2="-20" stroke="white" strokeOpacity="0.22" strokeWidth="1.5" />
            ))}
          {pattern === 2 && (
            <>
              <circle cx="290" cy="90" r="90" fill={`url(#g2-${hue}-${pattern})`} opacity="0.9" />
              <circle cx="110" cy="200" r="60" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="2" />
              <rect x="40" y="40" width="70" height="70" rx="18" fill="white" opacity="0.14" transform="rotate(18 75 75)" />
            </>
          )}
          {pattern === 3 &&
            Array.from({ length: 8 * 5 }, (_, i) => (
              <circle key={i} cx={230 + (i % 8) * 22} cy={30 + Math.floor(i / 8) * 22} r={i % 3 === 0 ? 4 : 2.2} fill="white" opacity={i % 3 === 0 ? 0.8 : 0.4} />
            ))}
          <path d="M0 260 C 100 190, 220 250, 400 170 L400 260 Z" fill="black" opacity="0.22" />
        </svg>
      )}
    </div>
  );
}
