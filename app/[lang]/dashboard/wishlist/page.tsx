import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { dashboardData } from "@/lib/dashboard-data";
import { pageMeta } from "@/lib/meta";
import { WishlistView } from "@/components/dashboard/Dashboard";

export async function generateMetadata({ params }: PageProps<"/[lang]/dashboard/wishlist">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMeta(lang, "/dashboard/wishlist", getDictionary(lang).dashboard.wishlist, undefined, true);
}

export default async function WishlistPage({ params }: PageProps<"/[lang]/dashboard/wishlist">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <WishlistView courses={dashboardData(lang).views} />;
}
