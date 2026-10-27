import type { Metadata } from "next";
import { tone } from "@/lib/palette";
import { Parallax, ScrollIn, SplitText, Tilt } from "@/components/animations/ScrollKit";
import { notFound } from "next/navigation";
import { Check, Clock, Globe, Layers, Play, Star, BarChart3 } from "lucide-react";
import { courses, courseDuration, courseLessons, getCourseBySlug } from "@/data/courses";
import { instructors } from "@/data/instructors";
import { reviews } from "@/data/content";
import { fmt, formatCompact, formatDate, formatDuration, locales } from "@/lib/i18n/format";
import { getDictionary, isLocale } from "@/lib/i18n";
import { allViews, toView } from "@/lib/courses";
import { SITE_URL } from "@/lib/site";
import { Container, Rating } from "@/components/ui/Primitives";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CourseCover } from "@/components/courses/CourseCover";
import { CourseCard } from "@/components/courses/CourseCard";
import { PlayTrigger } from "@/components/courses/CourseActions";
import { Curriculum, DetailActions, EnrollButton, RecentTracker } from "@/components/courses/CourseDetailParts";
import { Avatar } from "@/components/sections/StaticSections";

export function generateStaticParams() {
  return locales.flatMap((lang) => courses.map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/courses/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = getCourseBySlug(slug);
  if (!isLocale(lang) || !c) return {};
  const title = c.title[lang];
  return {
    title,
    description: c.description[lang],
    alternates: { canonical: `/${lang}/courses/${slug}`, languages: Object.fromEntries(locales.map((l) => [l, `/${l}/courses/${slug}`])) },
    openGraph: { type: "website", title, description: c.description[lang], url: `/${lang}/courses/${slug}` },
  };
}

export default async function CoursePage({ params }: PageProps<"/[lang]/courses/[slug]">) {
  const { lang, slug } = await params;
  const course = getCourseBySlug(slug);
  if (!isLocale(lang) || !course) notFound();
  const dict = getDictionary(lang);

  const view = toView(course, lang);
  const instructor = instructors.find((i) => i.id === course.instructor)!;
  const lessons = courseLessons(course);
  const modules = course.modules.map((m) => ({
    id: m.id,
    title: m.title[lang],
    lessons: m.lessons.map((l) => ({ id: l.id, title: l.title[lang], duration: l.duration, videoUrl: l.videoUrl, preview: !!l.preview })),
  }));
  const related = allViews(lang).filter((c) => c.categoryId === course.category && c.id !== course.id).concat(allViews(lang).filter((c) => c.categoryId !== course.category && c.id !== course.id)).slice(0, 3);
  const price = course.price === 0 ? dict.common.free : `${dict.common.currency}${course.price}`;

  const facts = [
    { Icon: BarChart3, label: dict.course.level, value: dict.common.level[course.level] },
    { Icon: Clock, label: dict.course.duration, value: formatDuration(courseDuration(course), dict) },
    { Icon: Layers, label: dict.watch.lessons, value: String(lessons.length) },
    { Icon: Globe, label: dict.course.language, value: dict.course.languageValue },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: view.title,
    description: view.description,
    provider: { "@type": "Organization", name: dict.meta.name, url: SITE_URL },
    aggregateRating: { "@type": "AggregateRating", ratingValue: course.rating, reviewCount: course.reviews },
  };

  return (
    <article>
      <RecentTracker courseId={course.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />

      {/* hero */}
      <header className="relative isolate overflow-hidden pb-14 pt-32 sm:pt-40">
        <Parallax speed={0.3} className="absolute inset-0 -z-10"><div aria-hidden className="size-full opacity-60 blur-3xl" style={{ background: `radial-gradient(60% 60% at 80% 0%, ${tone(course.hue).a}66, transparent), radial-gradient(40% 50% at 0% 40%, ${tone(course.hue).b}40, transparent)` }} /></Parallax>
        <Container>
          <Breadcrumbs
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.nav.home, href: "/" }, { label: dict.nav.courses, href: "/courses" }, { label: view.title }]}
          />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div>
              <p className="eyebrow mb-4">{view.categoryName}</p>
              <SplitText as="h1" text={view.title} className="display text-[clamp(2.25rem,6vw,4.75rem)]" />
              <p className="mt-5 max-w-2xl text-lg text-muted">{view.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <Rating value={course.rating} count={fmt(dict.common.reviews, { n: formatCompact(course.reviews, lang) })} />
                <span className="text-muted">{fmt(dict.common.students, { n: formatCompact(course.students, lang) })}</span>
                <span className="text-muted">
                  {dict.common.by} <span className="font-semibold text-fg">{view.instructorName}</span>
                </span>
              </div>
              <div className="mt-8">
                <DetailActions course={view} firstLessonId={lessons[0].id} totalLessons={lessons.length} />
              </div>
            </div>

            <Tilt className="relative">
              <div className="relative aspect-video overflow-hidden rounded-[2rem] border border-line shadow-card">
                <CourseCover hue={course.hue} pattern={course.pattern} thumbnail={course.thumbnail} priority sizes="(min-width:1024px) 45vw, 100vw" />
                <PlayTrigger
                  url={course.videoUrl}
                  title={view.title}
                  course={view}
                  className="group absolute inset-0 grid place-items-center bg-black/10 transition hover:bg-black/25"
                >
                  <span className="grid size-20 place-items-center rounded-full bg-white text-black shadow-2xl transition group-hover:scale-110">
                    <Play className="size-8 translate-x-0.5 fill-current" aria-hidden />
                  </span>
                  <span className="sr-only">{dict.course.playTrailer}</span>
                </PlayTrigger>
              </div>
            </Tilt>
          </div>
        </Container>
      </header>

      <Container className="grid gap-12 pb-8 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div className="min-w-0 space-y-16">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-4">
            {facts.map(({ Icon, label, value }, i) => (
              <ScrollIn key={label} y={30} scale={0.9} delay={i * 0.08} className="bg-surface p-5">
                <Icon className="mb-3 size-5 text-accent" aria-hidden />
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="mt-0.5 font-semibold">{value}</dd>
              </ScrollIn>
            ))}
          </dl>

          <section aria-labelledby="curriculum">
            <h2 id="curriculum" data-fx="heading" className="display mb-2 text-3xl">
              {dict.course.curriculum}
            </h2>
            <p className="mb-6 text-muted">
              {fmt(dict.course.modulesLessons, { m: modules.length, l: lessons.length, d: formatDuration(courseDuration(course), dict) })}
            </p>
            <ScrollIn y={50}>
              <Curriculum course={view} modules={modules} />
            </ScrollIn>
          </section>

          <section aria-labelledby="instructor">
            <h2 id="instructor" data-fx="heading" className="display mb-6 text-3xl">
              {dict.course.instructor}
            </h2>
            <ScrollIn x={-90} y={20} className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-6 sm:flex-row sm:items-center">
              <Avatar name={instructor.name[lang]} hue={instructor.hue} size="size-24" className="text-3xl" />
              <div>
                <h3 className="display text-2xl" style={{ letterSpacing: 0 }}>
                  {instructor.name[lang]}
                </h3>
                <p className="text-sm font-medium text-accent">{instructor.role[lang]}</p>
                <p className="mt-3 text-muted">{instructor.bio[lang]}</p>
                <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                  <Rating value={instructor.rating} />
                  <span>{fmt(dict.common.students, { n: formatCompact(instructor.students, lang) })}</span>
                </p>
              </div>
            </ScrollIn>
          </section>

          <section aria-labelledby="reviews">
            <h2 id="reviews" data-fx="heading" className="display mb-6 text-3xl">
              {dict.course.reviews}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {reviews.map((r, ri) => (
                <li key={r.id}>
                  <ScrollIn x={ri % 2 ? 70 : -70} y={30} className="h-full rounded-3xl border border-line bg-surface p-6">
                  <div className="flex items-center gap-3">
                    <Avatar name={r.name[lang]} hue={(r.name.en.charCodeAt(0) * 7) % 360} size="size-10" className="text-sm" />
                    <div>
                      <p className="text-sm font-semibold">{r.name[lang]}</p>
                      <time dateTime={r.date} className="text-xs text-muted">
                        {formatDate(r.date, lang)}
                      </time>
                    </div>
                    <span className="ms-auto flex" role="img" aria-label={`${r.rating} / 5`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`size-3.5 ${i < r.rating ? "fill-accent text-accent" : "text-line"}`} aria-hidden />
                      ))}
                    </span>
                  </div>
                  <p className="mt-4 text-muted">{r.text[lang]}</p>
                  </ScrollIn>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">{dict.common.demo}</p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <ScrollIn x={80} y={20} className="rounded-[2rem] border border-line bg-surface p-6 shadow-card">
            <p className="display text-4xl">{price}</p>
            <div className="mt-5">
              <EnrollButton courseId={course.id} label={dict.course.enroll} />
            </div>
            <p className="mt-3 text-xs text-muted">{dict.course.enrollNote}</p>
            <h3 className="mb-3 mt-7 text-sm font-semibold">{dict.course.includes}</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              {[dict.course.inc1, dict.course.inc2, dict.course.inc3, dict.course.inc4].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line pt-4 text-xs text-muted">
              {dict.course.lastUpdated}: <time dateTime={course.publishedAt}>{formatDate(course.publishedAt, lang)}</time>
            </p>
          </ScrollIn>
        </aside>
      </Container>

      <Container className="pt-20">
        <h2 data-fx="heading" className="display mb-8 text-3xl sm:text-4xl">{dict.course.related}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((c, ri) => (
            <ScrollIn key={c.id} delay={ri * 0.1} rotateX={-10} className="[&>article]:h-full">
              <CourseCard course={c} />
            </ScrollIn>
          ))}
        </div>
      </Container>
    </article>
  );
}
