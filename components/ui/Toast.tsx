"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, AlertTriangle } from "lucide-react";
import { useI18n } from "../providers/I18nProvider";

type Kind = "success" | "info" | "error";
interface ToastItem {
  id: number;
  kind: Kind;
  message: string;
}
const Ctx = createContext<(message: string, kind?: Kind) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const id = useRef(0);
  const { dict } = useI18n();

  const dismiss = useCallback((i: number) => setItems((p) => p.filter((t) => t.id !== i)), []);
  const push = useCallback(
    (message: string, kind: Kind = "success") => {
      const n = ++id.current;
      setItems((p) => [...p.slice(-2), { id: n, kind, message }]);
      setTimeout(() => dismiss(n), 3800);
    },
    [dismiss],
  );
  const value = useMemo(() => push, [push]);

  const Icon = { success: CheckCircle2, info: Info, error: AlertTriangle };

  return (
    <Ctx.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex flex-col items-center gap-2 px-4"
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        <AnimatePresence>
          {items.map((t) => {
            const I = Icon[t.kind];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                className="glass pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl px-4 py-3 text-sm shadow-card"
              >
                <I className={t.kind === "error" ? "size-5 text-danger" : "size-5 text-accent"} aria-hidden />
                <span>{t.message}</span>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label={dict.a11y.close}
                  className="ms-1 rounded-full p-1 text-muted transition hover:bg-line hover:text-fg"
                >
                  <X className="size-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
