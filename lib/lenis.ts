import type Lenis from "lenis";

/** Shared reference so the video modal / drawers can pause smooth scrolling. */
let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** Lock page scroll (modal, drawer). Returns an unlock function. */
let locks = 0;
export function lockScroll() {
  locks++;
  if (locks === 1) {
    document.documentElement.style.overflow = "hidden";
    instance?.stop();
  }
  return () => {
    locks = Math.max(0, locks - 1);
    if (locks === 0) {
      document.documentElement.style.overflow = "";
      instance?.start();
    }
  };
}
