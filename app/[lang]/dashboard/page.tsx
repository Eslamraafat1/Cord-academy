import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { dashboardData } from "@/lib/dashboard-data";
import { pageMeta } from "@/lib/meta";
import { Overview } from "@/components/dashboard/Dashboard";

export async function generateMetadata({ params }: PageProps<"/[lang]/dashboard">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMeta(lang, "/dashboard", getDictionary(lang).nav.dashboard, undefined, true);
}

export default async function DashboardPage({ params }: PageProps<"/[lang]/dashboard">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { views, lessonCounts } = dashboardData(lang);
  return <Overview courses={views} lessonCounts={lessonCounts} />;
}
