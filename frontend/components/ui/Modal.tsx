"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-xl border border-[var(--cv-border)] bg-[var(--cv-elevated)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]",
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="text-lg font-semibold text-[var(--cv-text-primary)]">
              {title}
            </h2>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[var(--cv-text-muted)] hover:bg-white/5 hover:text-[var(--cv-text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
