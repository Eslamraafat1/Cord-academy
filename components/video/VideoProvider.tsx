"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { track } from "@/lib/analytics";

export interface OpenVideoInput {
  url: string;
  title: string;
  hue?: number;
  pattern?: 0 | 1 | 2 | 3;
  thumbnail?: string;
}

// The modal (and therefore every player) is only downloaded the first time a video is opened.
const VideoModal = dynamic(() => import("./VideoModal"), { ssr: false });

const Ctx = createContext<(v: OpenVideoInput) => void>(() => {});
export const useVideo = () => useContext(Ctx);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<OpenVideoInput | null>(null);
  const [loaded, setLoaded] = useState(false);

  const open = useCallback((v: OpenVideoInput) => {
    track("video_open", { title: v.title });
    setLoaded(true);
    setCurrent(v);
  }, []);
  const close = useCallback(() => setCurrent(null), []);
  const value = useMemo(() => open, [open]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {loaded && <VideoModal video={current} onClose={close} />}
    </Ctx.Provider>
  );
}
