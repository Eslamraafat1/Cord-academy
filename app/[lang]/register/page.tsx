import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { AuthShell } from "@/components/ui/PageParts";
import { AuthForm } from "@/components/forms/Forms";
import { LocLink } from "@/components/ui/LocLink";

export async function generateMetadata({ params }: PageProps<"/[lang]/register">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMeta(lang, "/register", getDictionary(lang).auth.registerTitle, undefined, true);
}

export default async function RegisterPage({ params }: PageProps<"/[lang]/register">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  return (
    <AuthShell
      title={d.auth.registerTitle}
      sub={d.auth.registerSub}
      footer={
        <>
          {d.auth.haveAccount}{" "}
          <LocLink href="/login" className="font-semibold text-accent hover:underline">
            {d.auth.login}
          </LocLink>
        </>
      }
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
