"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

/* ═══════════════════════════════════════════
   Toast Notification System
   Lightweight, no extra dependencies.
   ═══════════════════════════════════════════ */

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 4s
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 200);
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container — fixed bottom-right */}
      <div
        className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-3 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border min-w-[320px] max-w-[420px] ${
              t.exiting ? "animate-toast-out" : "animate-toast-in"
            } ${
              t.type === "success"
                ? "bg-emerald-950/90 border-emerald-800/50 text-emerald-100"
                : t.type === "error"
                ? "bg-red-950/90 border-red-800/50 text-red-100"
                : "bg-stone-900/95 border-stone-700/50 text-stone-100"
            }`}
            role="alert"
          >
            <span className="flex-shrink-0">
              {t.type === "success" && (
                <CheckCircle2 className="size-5 text-emerald-400" />
              )}
              {t.type === "error" && (
                <AlertCircle className="size-5 text-red-400" />
              )}
              {t.type === "info" && (
                <Info className="size-5 text-amber-400" />
              )}
            </span>
            <p className="text-sm font-medium flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="flex-shrink-0 p-0.5 rounded hover:bg-white/10 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="size-4 opacity-60" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
