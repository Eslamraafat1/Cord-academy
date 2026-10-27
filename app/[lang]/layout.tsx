import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Readex_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import "../globals.css";
import { dirOf, getDictionary, isLocale, locales } from "@/lib/i18n";
import { COPYRIGHT_YEAR, SITE_URL } from "@/lib/site";
import { allViews } from "@/lib/courses";
import { Providers } from "@/components/providers/Providers";
import { THEME_SCRIPT } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageFx } from "@/components/animations/PageFx";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const readex = Readex_Pro({ subsets: ["arabic", "latin"], variable: "--font-readex", display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${d.meta.name} — ${d.meta.tagline}`, template: `%s · ${d.meta.name}` },
    description: d.meta.description,
    applicationName: d.meta.name,
    alternates: { canonical: `/${lang}`, languages: { ar: "/ar", en: "/en", "x-default": "/ar" } },
    openGraph: {
      type: "website",
      siteName: d.meta.name,
      title: d.meta.name,
      description: d.meta.description,
      locale: lang === "ar" ? "ar_AR" : "en_US",
      alternateLocale: lang === "ar" ? ["en_US"] : ["ar_AR"],
    },
    twitter: { card: "summary_large_image", title: d.meta.name, description: d.meta.description },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1824" },
  ],
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const search = allViews(lang).map((c) => ({
    slug: c.slug,
    title: c.title,
    meta: `${c.categoryName} · ${c.instructorName}`,
  }));

  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} ${readex.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="antialiased">
        <Providers lang={lang} dict={dict} search={search}>
          <a
            href="#main"
            className="fixed start-4 top-4 z-[200] -translate-y-24 rounded-full bg-fg px-5 py-3 text-sm font-semibold text-bg transition focus:translate-y-0"
          >
            {dict.a11y.skip}
          </a>
          <Suspense fallback={<div className="h-20" />}>
            <Navbar />
          </Suspense>
          <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
            {children}
          </main>
          <Footer dict={dict} year={COPYRIGHT_YEAR} />
          <PageFx />
        </Providers>
      </body>
    </html>
  );
}
