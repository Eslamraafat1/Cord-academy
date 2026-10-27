import { ArrowRight, Quote, Star } from "lucide-react";
import type { Dict } from "@/lib/i18n/en";
import { fmt, formatCompact } from "@/lib/i18n/format";
import type { Faq, Instructor, Locale, Testimonial } from "@/types";
import { tone } from "@/lib/palette";
import { Container, Rating, SectionHeading } from "../ui/Primitives";
import { Reveal } from "../animations/Reveal";
import { Counter } from "../animations/Counter";
import { ButtonLink } from "../ui/Button";
import { Accordion } from "../ui/Accordion";
import { NewsletterForm } from "./NewsletterForm";
import { LocLink } from "../ui/LocLink";

export function Avatar({ name, hue, size = "size-16", className = "" }: { name: string; hue: number; size?: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      aria-hidden
      className={`${size} ${className} grid shrink-0 place-items-center rounded-full text-lg font-bold text-white`}
      style={{ background: `linear-gradient(135deg, ${tone(hue).to}, ${tone(hue).solid})` }}
    >
      {initials}
    </span>
  );
}

export function InstructorSpotlight({ dict, lang, instructors, courseCounts }: { dict: Dict; lang: Locale; instructors: Instructor[]; courseCounts: Record<string, number> }) {
  return (
    <section className="bg-bg2 py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={dict.instructors.eyebrow} title={dict.instructors.title} sub={dict.instructors.sub} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {instructors.map((ins, i) => (
            <div key={ins.id} data-fx="card" className={i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}>
              <article className="glow-border group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface p-6 transition hover:-translate-y-1">
                <div
                  aria-hidden
                  className="absolute -end-10 -top-10 size-40 rounded-full opacity-30 blur-2xl transition group-hover:opacity-60"
                  style={{ background: tone(ins.hue).a }}
                />
                <Avatar name={ins.name[lang]} hue={ins.hue} size="size-20" className="relative text-2xl" />
                <h3 className="display relative mt-5 text-xl" style={{ letterSpacing: 0 }}>
                  {ins.name[lang]}
                </h3>
                <p className="relative text-sm font-medium text-accent">{ins.role[lang]}</p>
                <p className="relative mt-3 flex-1 text-sm text-muted">{ins.bio[lang]}</p>
                <div className="relative mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-4 text-sm text-muted">
                  <Rating value={ins.rating} />
                  <span>{fmt(dict.common.students, { n: formatCompact(ins.students, lang) })}</span>
                  <span>{fmt(dict.instructors.courses, { n: courseCounts[ins.id] ?? 0 })}</span>
                </div>
              </article>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function StatsSection({ dict, stats }: { dict: Dict; stats: { learners: number; courses: number; hours: number; rating: number } }) {
  const items = [
    { v: stats.learners, label: dict.stats.learners, suffix: "+" },
    { v: stats.courses, label: dict.stats.courses, suffix: "" },
    { v: stats.hours, label: dict.stats.hours, suffix: "+" },
    { v: stats.rating, label: dict.stats.rating, suffix: "", decimals: 1 },
  ];
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] border border-line bg-line lg:grid-cols-4">
          {items.map((s) => (
            <Reveal key={s.label} className="bg-surface p-6 sm:p-10">
              <dd className="display order-first text-[clamp(2.25rem,6vw,4.5rem)]">
                <Counter to={s.v} decimals={s.decimals} suffix={s.suffix} />
              </dd>
              <dt className="mt-2 text-sm text-muted sm:text-base">{s.label}</dt>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}

function TestimonialCard({ t, lang }: { t: Testimonial; lang: Locale }) {
  return (
    <figure className="w-[20rem] shrink-0 rounded-3xl border border-line bg-surface p-6 sm:w-[24rem]">
      <Quote className="mb-3 size-6 text-accent" aria-hidden />
      <blockquote className="text-base leading-relaxed">{t.quote[lang]}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <Avatar name={t.name[lang]} hue={t.hue} size="size-11" className="text-sm" />
        <span>
          <span className="block text-sm font-semibold">{t.name[lang]}</span>
          <span className="block text-xs text-muted">{t.role[lang]}</span>
        </span>
        <span className="ms-auto flex" aria-label="5 / 5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="size-3.5 fill-accent text-accent" aria-hidden />
          ))}
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection({ dict, lang, items }: { dict: Dict; lang: Locale; items: Testimonial[] }) {
  return (
    <section className="overflow-hidden py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={dict.testimonials.eyebrow} title={dict.testimonials.title} />
      </Container>
      {/* the track is forced LTR so the loop math works; each card restores the page direction */}
      <div className="marquee relative" dir="ltr">
        <div className="flex w-max gap-6 animate-marquee">
          {[...items, ...items].map((t, i) => (
            <div key={i} aria-hidden={i >= items.length ? true : undefined} dir={lang === "ar" ? "rtl" : "ltr"} className="flex">
              <TestimonialCard t={t} lang={lang} />
            </div>
          ))}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent sm:w-40" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent sm:w-40" />
      </div>
    </section>
  );
}

export function FaqSection({ dict, lang, items }: { dict: Dict; lang: Locale; items: Faq[] }) {
  return (
    <section className="py-24 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <p className="eyebrow mb-3">{dict.faq.eyebrow}</p>
          <h2 className="display text-[clamp(2rem,5vw,3.75rem)]">{dict.faq.title}</h2>
          <p className="mt-4 text-lg text-muted">{dict.faq.sub}</p>
          <ButtonLink href="/contact" variant="outline" className="mt-8">
            {dict.faq.contact}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </ButtonLink>
        </div>
        <Reveal>
          <Accordion items={items.map((f) => ({ id: f.id, title: f.q[lang], content: <p>{f.a[lang]}</p> }))} defaultOpen={items[0]?.id} />
        </Reveal>
      </Container>
    </section>
  );
}

export function CtaSection({ dict }: { dict: Dict }) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal className="grain relative isolate overflow-hidden rounded-[2.5rem] bg-[#173851] px-6 py-16 text-white sm:px-14 sm:py-24">
          <div aria-hidden className="animate-drift absolute -start-20 -top-20 -z-10 size-96 rounded-full bg-[#c3622a]/60 blur-[90px]" />
          <div aria-hidden className="animate-drift absolute -bottom-24 end-0 -z-10 size-96 rounded-full bg-[#c3622a]/50 blur-[100px] [animation-delay:-7s]" />
          <div aria-hidden className="animate-drift absolute start-1/2 top-1/3 -z-10 size-60 rounded-full bg-[#e9956a]/25 blur-[90px] [animation-delay:-3s]" />
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="display text-[clamp(2.25rem,6.5vw,5rem)]">{dict.cta.title}</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">{dict.cta.sub}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/register" variant="lime" size="lg" magnetic>
                {dict.cta.primary}
                <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
              </ButtonLink>
              <LocLink href="/courses" className="inline-flex h-14 items-center rounded-full border border-white/25 px-8 font-semibold transition hover:bg-white/10">
                {dict.cta.secondary}
              </LocLink>
            </div>
            <div className="mx-auto mt-10 max-w-md text-start text-white [&_input]:text-white [&_label]:text-white/80 [&>form]:mt-0 [&_div]:border-white/20 [&_div]:bg-white/10">
              <NewsletterForm />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
