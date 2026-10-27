import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { categories, instructors } from "@/data/instructors";
import { getDictionary, isLocale } from "@/lib/i18n";
import { allViews } from "@/lib/courses";
import { CourseExplorer, ExplorerSkeleton } from "@/components/courses/CourseExplorer";
import { Container } from "@/components/ui/Primitives";
import { SplitText, Parallax } from "@/components/animations/ScrollKit";
import { ScrollMarquee } from "@/components/sections/ScrollSections";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export async function generateMetadata({ params }: PageProps<"/[lang]/courses">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return {
    title: d.courses.title,
    description: d.courses.sub,
    alternates: { canonical: `/${lang}/courses`, languages: { ar: "/ar/courses", en: "/en/courses" } },
    openGraph: { title: d.courses.title, description: d.courses.sub },
  };
}

export default async function CoursesPage({ params }: PageProps<"/[lang]/courses">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <div className="relative isolate overflow-hidden">
        <Parallax speed={0.4} className="absolute -top-24 end-[-8%] -z-10">
          <div aria-hidden className="animate-drift size-[30rem] rounded-full bg-accent/25 blur-[110px]" />
        </Parallax>
        <Parallax speed={-0.3} className="absolute top-40 start-[-10%] -z-10">
          <div aria-hidden className="animate-drift size-80 rounded-full bg-accent2/20 blur-[100px] [animation-delay:-6s]" />
        </Parallax>
        <Container className="pt-32 sm:pt-40">
          <Breadcrumbs label={dict.a11y.breadcrumb} items={[{ label: dict.nav.home, href: "/" }, { label: dict.courses.title }]} />
          <header className="mb-4 mt-6 max-w-4xl">
            <SplitText as="h1" text={dict.courses.title} className="display text-[clamp(2.5rem,7vw,5.5rem)]" />
            <p className="mt-4 max-w-2xl text-lg text-muted">{dict.courses.sub}</p>
          </header>
        </Container>
        <ScrollMarquee compact words={categories.map((c) => c.name[lang])} />
      </div>
      <Container className="pb-8">
      {/* useSearchParams needs a Suspense boundary; the shell stays static */}
      <Suspense fallback={<ExplorerSkeleton />}>
        <CourseExplorer
          courses={allViews(lang)}
          categories={categories.map((c) => ({ id: c.id, name: c.name[lang] }))}
          instructors={instructors.map((i) => ({ id: i.id, name: i.name[lang] }))}
        />
      </Suspense>
      </Container>
    </>
  );
}
