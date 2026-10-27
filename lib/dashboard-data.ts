import { courses, courseLessons } from "@/data/courses";
import { allViews } from "@/lib/courses";
import type { Locale } from "@/types";

export function dashboardData(lang: Locale) {
  return {
    views: allViews(lang),
    lessonCounts: Object.fromEntries(courses.map((c) => [c.id, courseLessons(c).length])),
  };
}
