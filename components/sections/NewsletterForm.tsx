"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { subscribeNewsletter } from "@/lib/api";
import { track } from "@/lib/analytics";
import { useI18n } from "../providers/I18nProvider";
import { useToast } from "../ui/Toast";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Newsletter UI. Validates locally; the API call is a stub (lib/api.ts). */
export function NewsletterForm({ compact }: { compact?: boolean }) {
  const { dict } = useI18n();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError(email.trim() ? dict.common.invalidEmail : dict.common.required);
      return;
    }
    setError("");
    track("newsletter_submit");
    const res = await subscribeNewsletter({ email: email.trim() });
    toast(res.ok ? dict.toast.saved : dict.toast.demoAction, res.ok ? "success" : "info");
    if (res.ok) setEmail("");
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("mt-6", compact ? "max-w-sm" : "max-w-md")}>
      <label htmlFor={compact ? "nl-footer" : "nl-cta"} className="mb-2 block text-sm font-semibold">
        {dict.cta.newsletter}
      </label>
      <div className="flex items-center gap-2 rounded-full border border-line bg-surface p-1.5 focus-within:border-accent">
        <input
          id={compact ? "nl-footer" : "nl-cta"}
          type="email"
          dir="ltr"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.cta.emailPlaceholder}
          aria-invalid={!!error}
          aria-describedby={error ? "nl-err" : undefined}
          className="h-10 min-w-0 flex-1 bg-transparent px-4 text-start outline-none placeholder:text-muted"
        />
        <button type="submit" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-fg px-4 text-sm font-semibold text-bg transition hover:bg-accent hover:text-accent-fg">
          {dict.cta.subscribe}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
        </button>
      </div>
      {error && (
        <p id="nl-err" role="alert" className="mt-2 ps-4 text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
