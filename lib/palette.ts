/** Brand palette. Every generated colour in the UI (covers, avatars, dots) is derived from these two. */
export const ORANGE = "#c3622a";
export const NAVY = "#173851";

const SETS = [
  { from: "#0b1e2c", to: "#173851", a: "#c3622a", b: "#eba070", solid: "#c3622a" },
  { from: "#6b2f12", to: "#c3622a", a: "#173851", b: "#4f86ad", solid: "#173851" },
  { from: "#173851", to: "#8a4320", a: "#eba070", b: "#5b93bb", solid: "#4f86ad" },
] as const;

/** Maps a legacy numeric hue onto one of three navy/orange tones. */
export function tone(hue: number) {
  return SETS[Math.abs(Math.round(hue / 40)) % SETS.length];
}
