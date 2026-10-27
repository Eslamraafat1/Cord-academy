"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { dict } = useI18n();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto grid min-h-[70svh] max-w-xl place-items-center px-4 pt-32 text-center">
      <div>
        <AlertTriangle className="mx-auto mb-6 size-14 text-danger" aria-hidden />
        <h1 className="display text-4xl">{dict.error.title}</h1>
        <p className="mt-4 text-muted">{dict.error.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => retry()}>{dict.error.retry}</Button>
          <ButtonLink href="/" variant="outline">
            {dict.common.backHome}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
