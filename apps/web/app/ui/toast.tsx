"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type ToastTone = "info" | "success" | "warning" | "error";

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  pushToast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneClass: Record<ToastTone, string> = {
  info: "border-[#8083ff]/40 bg-[#16181d] text-[#c0c1ff]",
  success: "border-[#10b981]/40 bg-[#0f1f18] text-[#6ee7b7]",
  warning: "border-[#f59e0b]/40 bg-[#1a160c] text-[#fde68a]",
  error: "border-[#ef4444]/40 bg-[#1a1010] text-[#fca5a5]",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const pushToast = useCallback((message: string, tone: ToastTone = "info") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setItems((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 z-[60] flex flex-col items-center gap-2 px-4 cv-toast-safe"
      >
        {items.map((item) => (
          <div
            key={item.id}
            role={item.tone === "error" ? "alert" : "status"}
            className={`pointer-events-auto max-w-md rounded-xl border px-4 py-3 text-sm shadow-lg ${toneClass[item.tone]}`}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      pushToast: (message: string) => {
        if (typeof window !== "undefined") {
          console.info("[toast]", message);
        }
      },
    };
  }
  return ctx;
}
