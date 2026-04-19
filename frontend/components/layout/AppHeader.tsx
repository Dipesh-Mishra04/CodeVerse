"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/problems", label: "Problems" },
  { href: "/tutor", label: "Tutor" },
  { href: "/analytics", label: "Analytics" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/settings", label: "Settings" },
];

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cv-border)] bg-[var(--cv-bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-lg font-bold tracking-tight text-[var(--cv-accent)]"
          >
            CodeVerse
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === l.href || pathname.startsWith(l.href + "/")
                    ? "bg-white/5 text-[var(--cv-text-primary)]"
                    : "text-[var(--cv-text-secondary)] hover:text-[var(--cv-text-primary)]"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="hidden rounded-full border border-[var(--cv-border)] p-2 text-[var(--cv-text-muted)] md:inline-flex"
            title="Notifications (coming soon)"
          >
            <Bell className="h-4 w-4" />
          </span>
          <Link
            href="/problems"
            className="hidden rounded-md bg-[var(--cv-accent)] px-3 py-2 text-sm font-semibold text-[#0d1117] hover:bg-[var(--cv-accent-hover)] md:inline-block"
          >
            Practice
          </Link>
          <button
            type="button"
            className="inline-flex rounded-md border border-[var(--cv-border)] p-2 text-[var(--cv-text-primary)] md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-[var(--cv-border)] bg-[var(--cv-bg)] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-[var(--cv-text-secondary)] hover:bg-white/5 hover:text-[var(--cv-text-primary)]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/problems"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-[var(--cv-accent)] px-3 py-2 text-center text-sm font-semibold text-[#0d1117]"
            >
              Practice
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
