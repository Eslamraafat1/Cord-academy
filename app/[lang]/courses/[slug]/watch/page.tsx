import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { courses, getCourseBySlug } from "@/data/courses";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { toView } from "@/lib/courses";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Skeleton } from "@/components/ui/Primitives";
import { WatchPlayer } from "@/components/video/WatchPlayer";

export function generateStaticParams() {
  return locales.flatMap((lang) => courses.map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/courses/[slug]/watch">): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = getCourseBySlug(slug);
  if (!isLocale(lang) || !c) return {};
  return { title: c.title[lang], robots: { index: false } };
}

export default async function WatchPage({ params }: PageProps<"/[lang]/courses/[slug]/watch">) {
  const { lang, slug } = await params;
  const course = getCourseBySlug(slug);
  if (!isLocale(lang) || !course) notFound();
  const dict = getDictionary(lang);
  const view = toView(course, lang);

  const modules = course.modules.map((m) => ({
    id: m.id,
    title: m.title[lang],
    lessons: m.lessons.map((l) => ({ id: l.id, title: l.title[lang], duration: l.duration, videoUrl: l.videoUrl, preview: !!l.preview })),
  }));

  return (
    <div className="mx-auto w-full max-w-[96rem] px-4 pb-10 pt-28 sm:px-6 lg:px-10">
      <div className="mb-6">
        <Breadcrumbs
          label={dict.a11y.breadcrumb}
          items={[{ label: dict.nav.home, href: "/" }, { label: dict.nav.courses, href: "/courses" }, { label: view.title, href: `/courses/${slug}` }, { label: dict.course.watchCourse }]}
        />
      </div>
      <Suspense
        fallback={
          <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
            <Skeleton className="aspect-video w-full rounded-3xl" />
            <Skeleton className="h-96 rounded-3xl" />
          </div>
        }
      >
        <WatchPlayer course={view} modules={modules} />
      </Suspense>
    </div>
  );
}
