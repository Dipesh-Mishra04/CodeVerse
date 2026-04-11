import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types";

const difficultyStyles: Record<Difficulty, string> = {
  easy: "bg-[var(--cv-diff-easy)]/15 text-[var(--cv-diff-easy)] border-[var(--cv-diff-easy)]/35",
  medium: "bg-[var(--cv-diff-medium)]/15 text-[var(--cv-diff-medium)] border-[var(--cv-diff-medium)]/35",
  hard: "bg-[var(--cv-diff-hard)]/15 text-[var(--cv-diff-hard)] border-[var(--cv-diff-hard)]/35",
};

export function DifficultyBadge({ d }: { d: Difficulty }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        difficultyStyles[d]
      )}
    >
      {d}
    </span>
  );
}

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--cv-border)] bg-[var(--cv-elevated)] px-2 py-0.5 text-xs text-[var(--cv-text-secondary)]",
        className
      )}
    >
      {children}
    </span>
  );
}
