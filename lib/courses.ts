import { categories, instructors } from "@/data/instructors";
import { courseDuration, courseLessons, courses } from "@/data/courses";
import type { Course, CourseView, Locale } from "@/types";

export function toView(c: Course, l: Locale): CourseView {
  const cat = categories.find((x) => x.id === c.category);
  const ins = instructors.find((x) => x.id === c.instructor);
  return {
    id: c.id,
    slug: c.slug,
    title: c.title[l],
    description: c.description[l],
    thumbnail: c.thumbnail,
    hue: c.hue,
    pattern: c.pattern,
    videoUrl: c.videoUrl,
    provider: c.provider,
    categoryId: c.category,
    categoryName: cat?.name[l] ?? c.category,
    instructorId: c.instructor,
    instructorName: ins?.name[l] ?? c.instructor,
    level: c.level,
    rating: c.rating,
    reviews: c.reviews,
    students: c.students,
    price: c.price,
    publishedAt: c.publishedAt,
    durationMin: courseDuration(c),
    lessonsCount: courseLessons(c).length,
    featured: !!c.featured,
    trending: !!c.trending,
  };
}

export const allViews = (l: Locale) => courses.map((c) => toView(c, l));

export const recentViews = (l: Locale, n = 4) =>
  [...allViews(l)].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, n);

export const totalHours = () => Math.round(courses.reduce((n, c) => n + courseDuration(c), 0) / 60);
