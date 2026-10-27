"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { fmt } from "@/lib/i18n/format";
import { login, register, requestPasswordReset, sendContactMessage } from "@/lib/api";
import { track } from "@/lib/analytics";
import { useI18n } from "../providers/I18nProvider";
import { Button } from "../ui/Button";
import { LocLink } from "../ui/LocLink";
import { useToast } from "../ui/Toast";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: (p: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      {children({ id, "aria-invalid": !!error, "aria-describedby": error ? `${id}-err` : undefined })}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (invalid: boolean) =>
  cn(
    "h-12 w-full rounded-2xl border bg-surface px-4 text-start outline-none transition placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/15",
    invalid ? "border-danger" : "border-line",
  );

/** Shown after a valid submit when no backend exists — honest about what happened. */
function Notice({ title, text }: { title: string; text: string }) {
  return (
    <div role="status" className="flex gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm">
      <Info className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-muted">{text}</p>
      </div>
    </div>
  );
}

export function ContactForm() {
  const { dict } = useI18n();
  const toast = useToast();
  const [v, setV] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof v, string>>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "demo">(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const err: typeof errors = {};
    if (!v.name.trim()) err.name = dict.common.required;
    if (!v.email.trim()) err.email = dict.common.required;
    else if (!EMAIL_RE.test(v.email.trim())) err.email = dict.common.invalidEmail;
    if (!v.subject.trim()) err.subject = dict.common.required;
    if (v.message.trim().length < 10) err.message = fmt(dict.common.minLength, { n: 10 });
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    track("contact_submit");
    const r = await sendContactMessage(v);
    setBusy(false);
    setSent(r.ok ? "ok" : "demo");
    toast(r.ok ? dict.toast.saved : dict.toast.demoAction, r.ok ? "success" : "info");
  }

  if (sent) {
    return (
      <div className="space-y-4">
        {sent === "ok" ? (
          <div role="status" className="flex items-center gap-3 rounded-2xl bg-accent/10 p-4">
            <CheckCircle2 className="size-6 text-accent" aria-hidden /> {dict.contact.successTitle}
          </div>
        ) : (
          <Notice title={dict.contact.successTitle} text={dict.contact.successText} />
        )}
        <Button variant="outline" onClick={() => { setSent(null); setV({ name: "", email: "", subject: "", message: "" }); }}>
          {dict.common.reset}
        </Button>
      </div>
    );
  }

  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={dict.contact.name} error={errors.name}>
          {(p) => <input {...p} autoComplete="name" value={v.name} onChange={set("name")} className={inputCls(!!errors.name)} />}
        </Field>
        <Field label={dict.contact.email} error={errors.email}>
          {(p) => <input {...p} type="email" dir="ltr" autoComplete="email" value={v.email} onChange={set("email")} className={inputCls(!!errors.email)} />}
        </Field>
      </div>
      <Field label={dict.contact.subject} error={errors.subject}>
        {(p) => <input {...p} value={v.subject} onChange={set("subject")} className={inputCls(!!errors.subject)} />}
      </Field>
      <Field label={dict.contact.message} error={errors.message}>
        {(p) => <textarea {...p} rows={6} value={v.message} onChange={set("message")} className={cn(inputCls(!!errors.message), "h-auto py-3")} />}
      </Field>
      <Button type="submit" size="lg" disabled={busy} magnetic>
        {busy && <Loader2 className="animate-spin-slow size-5" aria-hidden />}
        {busy ? dict.contact.sending : dict.contact.send}
      </Button>
    </form>
  );
}

export function AuthForm({ mode }: { mode: "login" | "register" | "forgot" }) {
  const { dict } = useI18n();
  const toast = useToast();
  const [v, setV] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof v, string>>>({});
  const [busy, setBusy] = useState(false);
  const [demo, setDemo] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const err: typeof errors = {};
    if (mode === "register" && !v.name.trim()) err.name = dict.common.required;
    if (!v.email.trim()) err.email = dict.common.required;
    else if (!EMAIL_RE.test(v.email.trim())) err.email = dict.common.invalidEmail;
    if (mode !== "forgot") {
      if (!v.password) err.password = dict.common.required;
      else if (mode === "register" && v.password.length < 8) err.password = fmt(dict.common.minLength, { n: 8 });
    }
    if (mode === "register" && v.confirm !== v.password) err.confirm = dict.auth.mismatch;
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    const r =
      mode === "login"
        ? await login({ email: v.email, password: v.password })
        : mode === "register"
          ? await register({ name: v.name, email: v.email, password: v.password })
          : await requestPasswordReset({ email: v.email });
    setBusy(false);
    if (!r.ok) {
      setDemo(true);
      toast(dict.toast.demoAction, "info");
    }
  }

  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((p) => ({ ...p, [k]: e.target.value }));
  const label = mode === "login" ? dict.auth.login : mode === "register" ? dict.auth.register : dict.auth.send;

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {mode === "register" && (
        <Field label={dict.auth.name} error={errors.name}>
          {(p) => <input {...p} autoComplete="name" value={v.name} onChange={set("name")} className={inputCls(!!errors.name)} />}
        </Field>
      )}
      <Field label={dict.auth.email} error={errors.email}>
        {(p) => <input {...p} type="email" dir="ltr" autoComplete="email" value={v.email} onChange={set("email")} className={inputCls(!!errors.email)} />}
      </Field>
      {mode !== "forgot" && (
        <Field label={dict.auth.password} error={errors.password}>
          {(p) => (
            <input {...p} type="password" dir="ltr" autoComplete={mode === "login" ? "current-password" : "new-password"} value={v.password} onChange={set("password")} className={inputCls(!!errors.password)} />
          )}
        </Field>
      )}
      {mode === "register" && (
        <Field label={dict.auth.confirm} error={errors.confirm}>
          {(p) => <input {...p} type="password" dir="ltr" autoComplete="new-password" value={v.confirm} onChange={set("confirm")} className={inputCls(!!errors.confirm)} />}
        </Field>
      )}
      {mode === "login" && (
        <div className="flex items-center justify-between text-sm">
          <label className="flex min-h-10 items-center gap-2">
            <input type="checkbox" className="size-4 accent-[var(--accent)]" /> {dict.auth.remember}
          </label>
          <LocLink href="/forgot-password" className="font-medium text-accent hover:underline">
            {dict.auth.forgot}
          </LocLink>
        </div>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy && <Loader2 className="animate-spin-slow size-5" aria-hidden />}
        {label}
      </Button>
      {demo && <Notice title={dict.common.comingSoon} text={dict.auth.notConnected} />}
    </form>
  );
}
