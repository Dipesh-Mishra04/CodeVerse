"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-[var(--cv-border)] bg-[var(--cv-surface)] px-3 text-sm text-[var(--cv-text-primary)] placeholder:text-[var(--cv-text-muted)] focus:border-[var(--cv-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--cv-accent)]",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[96px] w-full rounded-md border border-[var(--cv-border)] bg-[var(--cv-surface)] px-3 py-2 text-sm text-[var(--cv-text-primary)] placeholder:text-[var(--cv-text-muted)] focus:border-[var(--cv-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--cv-accent)]",
        className
      )}
      {...props}
    />
  );
}
