import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["ar", "en"];
const DEFAULT = "ar";

function preferred(req: NextRequest) {
  const saved = req.cookies.get("lang")?.value;
  if (saved && LOCALES.includes(saved)) return saved;
  const accept = (req.headers.get("accept-language") ?? "").toLowerCase();
  for (const part of accept.split(",")) {
    const tag = part.trim().split(";")[0].split("-")[0];
    if (LOCALES.includes(tag)) return tag;
  }
  return DEFAULT;
}

/** Sends `/courses` → `/ar/courses` (or `/en/...`) using the saved cookie, then Accept-Language. */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  const url = req.nextUrl.clone();
  url.pathname = `/${preferred(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // skip Next internals, API routes and any path containing a file extension (favicon, sitemap.xml, robots.txt…)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
