import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { dashboardData } from "@/lib/dashboard-data";
import { pageMeta } from "@/lib/meta";
import { MyCourses } from "@/components/dashboard/Dashboard";

export async function generateMetadata({ params }: PageProps<"/[lang]/dashboard/courses">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMeta(lang, "/dashboard/courses", getDictionary(lang).dashboard.myCourses, undefined, true);
}

export default async function MyCoursesPage({ params }: PageProps<"/[lang]/dashboard/courses">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { views, lessonCounts } = dashboardData(lang);
  return <MyCourses courses={views} lessonCounts={lessonCounts} />;
}
