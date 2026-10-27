import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { fmt, formatDate } from "@/lib/i18n/format";
import { pageMeta } from "@/lib/meta";
import { PageHeader } from "@/components/ui/PageParts";
import { Container } from "@/components/ui/Primitives";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMeta(lang, "/privacy", getDictionary(lang).legal.privacyTitle);
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  const p = d.legal.p;
  return (
    <>
      <PageHeader
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.nav.home, href: "/" }, { label: d.legal.privacyTitle }]}
        title={d.legal.privacyTitle}
        lead={fmt(d.legal.updated, { d: formatDate("2026-10-26", lang) })}
      />
      <Container className="max-w-3xl space-y-8 pb-8">
        <p className="rounded-2xl border border-line bg-surface p-4 text-sm text-muted">{d.legal.notice}</p>
        {[[p.s1t, p.s1], [p.s2t, p.s2], [p.s3t, p.s3], [p.s4t, p.s4]].map(([t, b]) => (
          <section key={t}>
            <h2 className="display mb-3 text-2xl" style={{ letterSpacing: 0 }}>{t}</h2>
            <p className="text-muted">{b}</p>
          </section>
        ))}
      </Container>
    </>
  );
}
