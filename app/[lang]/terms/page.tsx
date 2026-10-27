import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { fmt, formatDate } from "@/lib/i18n/format";
import { pageMeta } from "@/lib/meta";
import { PageHeader } from "@/components/ui/PageParts";
import { Container } from "@/components/ui/Primitives";

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMeta(lang, "/terms", getDictionary(lang).legal.termsTitle);
}

export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  const t = d.legal.t;
  return (
    <>
      <PageHeader
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.nav.home, href: "/" }, { label: d.legal.termsTitle }]}
        title={d.legal.termsTitle}
        lead={fmt(d.legal.updated, { d: formatDate("2026-10-26", lang) })}
      />
      <Container className="max-w-3xl space-y-8 pb-8">
        <p className="rounded-2xl border border-line bg-surface p-4 text-sm text-muted">{d.legal.notice}</p>
        {[[t.s1t, t.s1], [t.s2t, t.s2], [t.s3t, t.s3], [t.s4t, t.s4]].map(([h, b]) => (
          <section key={h}>
            <h2 className="display mb-3 text-2xl" style={{ letterSpacing: 0 }}>{h}</h2>
            <p className="text-muted">{b}</p>
          </section>
        ))}
      </Container>
    </>
  );
}
