import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses } from "@/data/courses";
import { instructors } from "@/data/instructors";
import { totalHours } from "@/lib/courses";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { Container } from "@/components/ui/Primitives";
import { PageHeader } from "@/components/ui/PageParts";
import { Counter } from "@/components/animations/Counter";
import { ScrollIn, Stack, WordsScrub } from "@/components/animations/ScrollKit";
import { Avatar, CtaSection } from "@/components/sections/StaticSections";
import { ScrollMarquee } from "@/components/sections/ScrollSections";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMeta(lang, "/about", d.nav.about, d.about.lead);
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  const values = [
    { t: d.about.v1t, p: d.about.v1 },
    { t: d.about.v2t, p: d.about.v2 },
    { t: d.about.v3t, p: d.about.v3 },
  ];

  const stats = [
    { v: instructors.reduce((n, i) => n + i.students, 0), label: d.stats.learners, suffix: "+" },
    { v: courses.length, label: d.stats.courses, suffix: "" },
    { v: totalHours(), label: d.stats.hours, suffix: "+" },
    { v: Math.round((courses.reduce((n, c) => n + c.rating, 0) / courses.length) * 10) / 10, label: d.stats.rating, suffix: "", decimals: 1 },
  ];

  return (
    <>
      <PageHeader
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.nav.home, href: "/" }, { label: d.nav.about }]}
        eyebrow={d.about.eyebrow}
        title={d.about.title}
        lead={d.about.lead}
      />
      <Container className="space-y-28 pb-8 sm:space-y-36">
        <ScrollIn scale={0.9} y={80} className="grid gap-8 rounded-[2.5rem] bg-fg p-8 text-bg sm:p-14 lg:grid-cols-[1fr_2fr]">
          <h2 className="eyebrow !text-lime">{d.about.missionTitle}</h2>
          <WordsScrub text={d.about.mission} className="display text-[clamp(1.75rem,4vw,3rem)]" />
        </ScrollIn>

        <dl className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((s, i) => (
            <ScrollIn key={s.label} delay={i * 0.1} y={50} className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
              <dd className="display order-first text-[clamp(2.25rem,6vw,4.25rem)] text-accent">
                <Counter to={s.v} decimals={s.decimals} suffix={s.suffix} />
              </dd>
              <dt className="mt-2 text-sm text-muted sm:text-base">{s.label}</dt>
            </ScrollIn>
          ))}
        </dl>

        <section aria-labelledby="values">
          <h2 id="values" data-fx="heading" className="display mb-10 text-3xl sm:text-5xl">
            {d.about.valuesTitle}
          </h2>
          <Stack top={6} step={1}>
            {values.map((v, i) => (
              <div
                key={v.t}
                className={
                  "relative flex flex-col justify-between gap-10 overflow-hidden rounded-[2rem] p-7 shadow-card sm:p-12 md:min-h-[21rem] " +
                  ["border border-line bg-surface", "bg-accent text-accent-fg", "bg-[#173851] text-white"][i % 3]
                }
              >
                <span aria-hidden className="display pointer-events-none absolute -end-2 -top-6 text-[clamp(8rem,22vw,16rem)] leading-none opacity-15">
                  0{i + 1}
                </span>
                <span className="display relative text-5xl">0{i + 1}</span>
                <div className="relative max-w-2xl">
                  <h3 className="display text-3xl sm:text-5xl" style={{ letterSpacing: 0 }}>
                    {v.t}
                  </h3>
                  <p className="mt-4 text-lg opacity-80">{v.p}</p>
                </div>
              </div>
            ))}
          </Stack>
        </section>
      </Container>

      <ScrollMarquee words={values.map((v) => v.t)} />

      <Container className="space-y-24 pb-8 pt-16">
        <section aria-labelledby="team">
          <h2 id="team" data-fx="heading" className="display mb-10 text-3xl sm:text-5xl">
            {d.about.teamTitle}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((i, n) => (
              <ScrollIn key={i.id} delay={(n % 3) * 0.1} y={70} rotateX={-12}>
                <div className="glow-border group flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 transition duration-500 hover:-translate-y-1.5 hover:shadow-card">
                  <Avatar name={i.name[lang]} hue={i.hue} size="size-16" className="transition duration-500 group-hover:rotate-6 group-hover:scale-110" />
                  <div>
                    <h3 className="font-semibold">{i.name[lang]}</h3>
                    <p className="text-sm text-muted">{i.role[lang]}</p>
                  </div>
                </div>
              </ScrollIn>
            ))}
          </div>
        </section>
      </Container>
      <CtaSection dict={d} />
    </>
  );
}
