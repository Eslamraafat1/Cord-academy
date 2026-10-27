import { ChevronRight } from "lucide-react";
import { LocLink } from "./LocLink";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label} className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {c.href ? (
              <LocLink href={c.href} className="rounded transition hover:text-fg">
                {c.label}
              </LocLink>
            ) : (
              <span aria-current="page" className="font-medium text-fg">
                {c.label}
              </span>
            )}
            {i < items.length - 1 && <ChevronRight className="size-3.5 rtl:rotate-180" aria-hidden />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
