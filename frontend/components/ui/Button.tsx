"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--cv-accent)] text-[#0d1117] hover:bg-[var(--cv-accent-hover)] shadow-sm",
  secondary:
    "border border-[var(--cv-border)] bg-[var(--cv-surface)] text-[var(--cv-text-primary)] hover:border-[var(--cv-accent)]/50",
  ghost: "text-[var(--cv-text-secondary)] hover:bg-white/5 hover:text-[var(--cv-text-primary)]",
  danger: "bg-[var(--cv-error)]/15 text-[var(--cv-error)] border border-[var(--cv-error)]/40 hover:bg-[var(--cv-error)]/25",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}) {
  const sizes = {
    sm: "h-8 px-3 text-xs rounded-md",
    md: "h-10 px-4 text-sm rounded-md",
    lg: "h-12 px-6 text-base rounded-lg",
  };
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      type={asChild ? undefined : "button"}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--cv-accent)] focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
