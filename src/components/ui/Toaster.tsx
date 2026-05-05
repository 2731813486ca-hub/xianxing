"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  toast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    (window as any).__toast = addToast;
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-slide-up rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-md ${
              t.type === "success"
                ? "border-emerald-600 bg-emerald-50/90 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/80 dark:text-emerald-200"
                : t.type === "error"
                ? "border-red-500 bg-red-50/90 text-red-700 dark:border-red-700 dark:bg-red-900/80 dark:text-red-200"
                : "border-border bg-card/80 text-foreground"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return { toast: (window as any).__toast || ((msg: string) => console.log(msg)) };
  }
  return context;
}

export function toast(message: string, type: Toast["type"] = "info") {
  if ((window as any).__toast) {
    (window as any).__toast(message, type);
  }
}
