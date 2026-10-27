import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { getDictionary, isLocale } from "@/lib/i18n";
import { Container, Skeleton } from "@/components/ui/Primitives";
import { DashboardNav } from "@/components/dashboard/Dashboard";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function DashboardLayout({ children, params }: LayoutProps<"/[lang]/dashboard">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  return (
    <Container className="pb-8 pt-32 sm:pt-36">
      <header className="mb-10">
        <p className="eyebrow mb-2">{d.dashboard.hello}</p>
        <h1 className="display text-[clamp(2.25rem,6vw,4.5rem)]">{d.dashboard.title}</h1>
        <p className="mt-3 text-muted">{d.dashboard.sub}</p>
      </header>
      <div className="grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-14">
        <Suspense fallback={<Skeleton className="h-12 w-full lg:h-52" />}>
          <DashboardNav />
        </Suspense>
        <div className="min-w-0">{children as ReactNode}</div>
      </div>
    </Container>
  );
}
