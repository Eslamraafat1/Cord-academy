import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { AuthShell } from "@/components/ui/PageParts";
import { AuthForm } from "@/components/forms/Forms";
import { LocLink } from "@/components/ui/LocLink";

export async function generateMetadata({ params }: PageProps<"/[lang]/forgot-password">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMeta(lang, "/forgot-password", getDictionary(lang).auth.forgotTitle, undefined, true);
}

export default async function ForgotPage({ params }: PageProps<"/[lang]/forgot-password">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  return (
    <AuthShell
      title={d.auth.forgotTitle}
      sub={d.auth.forgotSub}
      footer={
        <LocLink href="/login" className="font-semibold text-accent hover:underline">
          {d.auth.backToLogin}
        </LocLink>
      }
    >
      <AuthForm mode="forgot" />
    </AuthShell>
  );
}
