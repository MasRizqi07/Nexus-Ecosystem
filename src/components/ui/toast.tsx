"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, "id">) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, message, description }: Omit<ToastItem, "id">) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, type, message, description }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, description?: string) => {
      toast({ type: "success", message, description });
    },
    [toast]
  );

  const error = useCallback(
    (message: string, description?: string) => {
      toast({ type: "error", message, description });
    },
    [toast]
  );

  const info = useCallback(
    (message: string, description?: string) => {
      toast({ type: "info", message, description });
    },
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const isSuccess = t.type === "success";
          const isError = t.type === "error";

          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border transition-all animate-in slide-in-from-bottom-5 duration-200",
                isSuccess &&
                  "bg-nexus-surface/95 border-emerald-500/40 text-emerald-100 shadow-emerald-500/10",
                isError &&
                  "bg-nexus-surface/95 border-rose-500/40 text-rose-100 shadow-rose-500/10",
                !isSuccess &&
                  !isError &&
                  "bg-nexus-surface/95 border-nexus-cyan/40 text-cyan-100 shadow-nexus-cyan/10"
              )}
            >
              {isSuccess && (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              {isError && (
                <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              {!isSuccess && !isError && (
                <Info className="h-5 w-5 text-nexus-cyan shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight text-foreground">
                  {t.message}
                </p>
                {t.description && (
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-muted-foreground hover:text-foreground shrink-0 p-0.5"
                aria-label="Dismiss toast"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
