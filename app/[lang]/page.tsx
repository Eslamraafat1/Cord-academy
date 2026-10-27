import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses, courseLessons } from "@/data/courses";
import { categories, instructors } from "@/data/instructors";
import { faqs, paths, testimonials } from "@/data/content";
import { getDictionary, isLocale } from "@/lib/i18n";
import { allViews, recentViews, toView, totalHours } from "@/lib/courses";
import { Hero } from "@/components/sections/Hero";
import { CategoriesExplorer } from "@/components/sections/CategoriesExplorer";
import { ContinueLearning } from "@/components/sections/ContinueLearning";
import { RecentCourses } from "@/components/sections/CourseSections";
import { Manifesto, PinnedTrending, ScrollMarquee, StackedFeatured } from "@/components/sections/ScrollSections";
import { LearningPaths } from "@/components/sections/LearningPaths";
import { CtaSection, FaqSection, InstructorSpotlight, StatsSection, TestimonialsSection } from "@/components/sections/StaticSections";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return { title: { absolute: `${d.meta.name} — ${d.meta.tagline}` }, alternates: { canonical: `/${lang}`, languages: { ar: "/ar", en: "/en" } } };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const views = allViews(lang);
  const featured = views.filter((c) => c.featured);
  const trending = views.filter((c) => c.trending);
  const recent = recentViews(lang, 4);
  const lessonCounts = Object.fromEntries(courses.map((c) => [c.id, courseLessons(c).length]));
  const courseCounts = Object.fromEntries(instructors.map((i) => [i.id, courses.filter((c) => c.instructor === i.id).length]));
  const avgRating = Math.round((courses.reduce((n, c) => n + c.rating, 0) / courses.length) * 10) / 10;
  const learners = instructors.reduce((n, i) => n + i.students, 0);

  const pathViews = paths.map((p) => ({
    id: p.id,
    title: p.title[lang],
    description: p.description[lang],
    hue: p.hue,
    courses: p.courses.map((slug) => toView(courses.find((c) => c.slug === slug)!, lang)),
  }));

  return (
    <>
      <Hero stats={{ courses: courses.length, rating: avgRating }} />
      <ScrollMarquee words={categories.map((c) => c.name[lang])} />
      <Manifesto />
      <StackedFeatured courses={featured.slice(0, 4)} />
      <CategoriesExplorer categories={categories.map((c) => ({ id: c.id, name: c.name[lang], icon: c.icon, hue: c.hue }))} courses={views} />
      <PinnedTrending courses={trending} />
      <RecentCourses dict={dict} courses={recent} />
      <ContinueLearning courses={views} lessonCounts={lessonCounts} />
      <LearningPaths paths={pathViews} />
      <InstructorSpotlight dict={dict} lang={lang} instructors={instructors} courseCounts={courseCounts} />
      <StatsSection dict={dict} stats={{ learners, courses: courses.length, hours: totalHours(), rating: avgRating }} />
      <TestimonialsSection dict={dict} lang={lang} items={testimonials} />
      <FaqSection dict={dict} lang={lang} items={faqs} />
      <CtaSection dict={dict} />
    </>
  );
}
