import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { faqs } from "@/data/content";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { Container } from "@/components/ui/Primitives";
import { PageHeader } from "@/components/ui/PageParts";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMeta(lang, "/faq", d.faqPage.title, d.faqPage.sub);
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);

  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q[lang], acceptedAnswer: { "@type": "Answer", text: f.a[lang] } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <PageHeader
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.nav.home, href: "/" }, { label: d.nav.faq }]}
        eyebrow={d.faq.eyebrow}
        title={d.faqPage.title}
        lead={d.faqPage.sub}
      />
      <Container className="max-w-3xl pb-8">
        <Accordion items={faqs.map((f) => ({ id: f.id, title: f.q[lang], content: <p>{f.a[lang]}</p> }))} defaultOpen={faqs[0].id} />
        <div className="mt-10 text-center">
          <ButtonLink href="/contact" variant="outline">
            {d.faq.contact}
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
