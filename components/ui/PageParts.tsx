import type { ReactNode } from "react";
import { Container } from "./Primitives";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Parallax, SplitText } from "../animations/ScrollKit";

/** Standard inner-page header with breadcrumb, eyebrow, display title and lead. */
export function PageHeader({
  crumbs,
  crumbLabel,
  eyebrow,
  title,
  lead,
  children,
}: {
  crumbs: Crumb[];
  crumbLabel: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
      <Parallax speed={0.35} className="absolute -top-32 end-[-10%] -z-10">
        <div aria-hidden className="animate-drift size-[28rem] rounded-full bg-accent/25 blur-[100px]" />
      </Parallax>
      <Parallax speed={-0.25} className="absolute -bottom-24 start-[-8%] -z-10">
        <div aria-hidden className="animate-drift size-80 rounded-full bg-accent2/20 blur-[100px] [animation-delay:-7s]" />
      </Parallax>
      <Container>
        <Breadcrumbs label={crumbLabel} items={crumbs} />
        <div className="mt-8 max-w-4xl">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <SplitText as="h1" text={title} className="display text-[clamp(2.5rem,7vw,5.5rem)]" />
          {lead && <p className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">{lead}</p>}
          {children}
        </div>
      </Container>
    </header>
  );
}

/** Centered card layout for login / register / forgot-password. */
export function AuthShell({ title, sub, children, footer }: { title: string; sub: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="relative isolate grid min-h-[100svh] place-items-center px-4 pb-16 pt-32">
      <div aria-hidden className="animate-drift absolute start-[10%] top-[15%] -z-10 size-80 rounded-full bg-accent/25 blur-[100px]" />
      <div aria-hidden className="animate-drift absolute bottom-[10%] end-[10%] -z-10 size-72 rounded-full bg-accent2/20 blur-[100px] [animation-delay:-8s]" />
      <div className="glass w-full max-w-md rounded-[2rem] p-7 shadow-card sm:p-10">
        <h1 className="display text-4xl">{title}</h1>
        <p className="mb-8 mt-2 text-muted">{sub}</p>
        {children}
        <div className="mt-8 text-center text-sm text-muted">{footer}</div>
      </div>
    </div>
  );
}
