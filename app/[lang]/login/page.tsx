import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { AuthShell } from "@/components/ui/PageParts";
import { AuthForm } from "@/components/forms/Forms";
import { LocLink } from "@/components/ui/LocLink";

export async function generateMetadata({ params }: PageProps<"/[lang]/login">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMeta(lang, "/login", getDictionary(lang).auth.loginTitle, undefined, true);
}

export default async function LoginPage({ params }: PageProps<"/[lang]/login">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  return (
    <AuthShell
      title={d.auth.loginTitle}
      sub={d.auth.loginSub}
      footer={
        <>
          {d.auth.noAccount}{" "}
          <LocLink href="/register" className="font-semibold text-accent hover:underline">
            {d.nav.register}
          </LocLink>
        </>
      }
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
