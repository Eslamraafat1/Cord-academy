import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MapPin } from "lucide-react";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { Container } from "@/components/ui/Primitives";
import { PageHeader } from "@/components/ui/PageParts";
import { ContactForm } from "@/components/forms/Forms";
import { faqs } from "@/data/content";
import { ScrollIn } from "@/components/animations/ScrollKit";
import { FaqSection } from "@/components/sections/StaticSections";
import { ScrollMarquee } from "@/components/sections/ScrollSections";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMeta(lang, "/contact", d.nav.contact, d.contact.sub);
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);

  return (
    <>
      <PageHeader
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.nav.home, href: "/" }, { label: d.nav.contact }]}
        eyebrow={d.contact.eyebrow}
        title={d.contact.title}
        lead={d.contact.sub}
      />
      <Container className="grid gap-12 pb-8 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <ScrollIn x={-90} y={30} className="glow-border rounded-[2rem] border border-line bg-surface p-6 shadow-card focus-within:border-accent sm:p-10">
          <ContactForm />
        </ScrollIn>
        <aside className="space-y-4">
          <ScrollIn x={90} y={20} className="glow-border group flex gap-4 rounded-3xl border border-line bg-surface p-6 transition duration-500 hover:-translate-y-1 hover:shadow-card">
            <Mail className="size-6 shrink-0 text-accent transition duration-500 group-hover:-rotate-12 group-hover:scale-125" aria-hidden />
            <div>
              <h2 className="font-semibold">{d.contact.emailUs}</h2>
              <a href="mailto:hello@cord-academy.example" className="ltr-iso text-muted hover:text-fg">
                hello@cord-academy.example
              </a>
            </div>
          </ScrollIn>
          <ScrollIn x={90} y={20} delay={0.15} className="glow-border group flex gap-4 rounded-3xl border border-line bg-surface p-6 transition duration-500 hover:-translate-y-1 hover:shadow-card">
            <MapPin className="size-6 shrink-0 text-accent transition duration-500 group-hover:-translate-y-1 group-hover:scale-125" aria-hidden />
            <div>
              <h2 className="font-semibold">{d.contact.location}</h2>
              <p className="text-muted">{d.contact.locationValue}</p>
            </div>
          </ScrollIn>
          <p className="px-2 text-xs text-muted">{d.common.demo}</p>
        </aside>
      </Container>
      <div className="mt-16 sm:mt-24">
        <ScrollMarquee words={[d.contact.title, d.contact.emailUs, d.nav.contact]} />
      </div>
      <FaqSection dict={d} lang={lang} items={faqs.slice(0, 5)} />
    </>
  );
}
