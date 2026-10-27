import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { SettingsView } from "@/components/dashboard/Dashboard";

export async function generateMetadata({ params }: PageProps<"/[lang]/dashboard/settings">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMeta(lang, "/dashboard/settings", getDictionary(lang).dashboard.settings, undefined, true);
}

export default async function SettingsPage({ params }: PageProps<"/[lang]/dashboard/settings">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <SettingsView />;
}
