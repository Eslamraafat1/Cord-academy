"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "../providers/I18nProvider";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** next/link that prefixes the current locale: <LocLink href="/courses"> -> /ar/courses */
export function LocLink({ href, ...rest }: Props) {
  const { href: loc } = useI18n();
  return <Link href={loc(href)} {...rest} />;
}
