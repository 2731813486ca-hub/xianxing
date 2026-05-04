"use client";

import { useEffect, type ReactNode } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="font-serif text-xl font-semibold text-foreground">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="text-muted transition-colors hover:text-foreground"
            aria-label="关闭"
          >
            <FiX size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
