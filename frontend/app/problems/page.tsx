import { Suspense } from "react";
import { ProblemsPageClient } from "./ProblemsPageClient";

export default function ProblemsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--cv-bg)] text-[var(--cv-text-muted)]">
          Loading problems…
        </div>
      }
    >
      <ProblemsPageClient />
    </Suspense>
  );
}
