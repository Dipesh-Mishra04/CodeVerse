import { AppHeader } from "@/components/layout/AppHeader";

export function AppShell({
  children,
  fullWidth,
}: {
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[var(--cv-bg)] text-[var(--cv-text-primary)]">
      <AppHeader />
      <main
        className={
          fullWidth
            ? "pb-10 pt-4"
            : "mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6"
        }
      >
        {children}
      </main>
    </div>
  );
}
