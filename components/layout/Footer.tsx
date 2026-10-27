import type { Dict } from "@/lib/i18n/en";
import { fmt } from "@/lib/i18n/format";
import { LocLink } from "../ui/LocLink";
import { Container, Logo } from "../ui/Primitives";
import { NewsletterForm } from "../sections/NewsletterForm";

// lucide v1 dropped brand icons, so these are tiny inline SVG paths (24×24).
// Destinations are the platforms' home pages — set real profile URLs here.
const SOCIAL = [
  {
    label: "X / Twitter",
    href: "https://x.com",
    d: "M18.9 2H22l-7.2 8.2L23 22h-6.6l-5.2-6.8L5.2 22H2l7.7-8.8L1.5 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com",
    d: "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2C.5 9 .5 12 .5 12s0 3 .5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.5-1.8.5-4.8.5-4.8s0-3-.5-4.8ZM9.7 15.5v-7l6 3.5-6 3.5Z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm7 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.5Z",
  },
  {
    label: "GitHub",
    href: "https://github.com",
    d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
];

export function Footer({ dict, year }: { dict: Dict; year: number }) {
  const cols = [
    {
      title: dict.footer.explore,
      links: [
        { label: dict.nav.courses, href: "/courses" },
        { label: dict.nav.paths, href: "/#paths" },
        { label: dict.nav.dashboard, href: "/dashboard" },
        { label: dict.nav.faq, href: "/faq" },
      ],
    },
    {
      title: dict.footer.company,
      links: [
        { label: dict.nav.about, href: "/about" },
        { label: dict.nav.contact, href: "/contact" },
        { label: dict.nav.login, href: "/login" },
        { label: dict.nav.register, href: "/register" },
      ],
    },
    {
      title: dict.footer.legal,
      links: [
        { label: dict.footer.privacy, href: "/privacy" },
        { label: dict.footer.terms, href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="relative mt-32 border-t border-line bg-bg2">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo name={dict.meta.name} />
            <p className="mt-4 text-muted">{dict.footer.blurb}</p>
            <NewsletterForm compact />
            <p className="mt-8 mb-3 text-sm font-semibold">{dict.footer.follow}</p>
            <ul className="flex gap-2">
              {SOCIAL.map(({ label, href, d }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-11 place-items-center rounded-full border border-line transition hover:border-fg hover:bg-fg hover:text-bg"
                  >
                    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
                      <path d={d} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {cols.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <h2 className="mb-4 text-sm font-semibold">{c.title}</h2>
                <ul className="space-y-3 text-sm text-muted">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <LocLink href={l.href} className="inline-block py-0.5 transition hover:text-fg">
                        {l.label}
                      </LocLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:justify-between">
          <p>{fmt(dict.footer.rights, { y: year })}</p>
          <p>{dict.footer.demoNote}</p>
        </div>
      </Container>
    </footer>
  );
}
