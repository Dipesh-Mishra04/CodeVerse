import { Suspense } from "react";
import { TutorPageClient } from "./TutorPageClient";

export default function TutorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--cv-bg)] text-[var(--cv-text-muted)]">
          Loading tutor…
        </div>
      }
    >
      <TutorPageClient />
    </Suspense>
  );
}
