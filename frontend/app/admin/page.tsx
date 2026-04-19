"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "questions", label: "Questions" },
  { id: "tests", label: "Test cases" },
  { id: "users", label: "Users" },
  { id: "subs", label: "Submissions" },
  { id: "reports", label: "Reports" },
  { id: "lb", label: "Leaderboard" },
] as const;

export default function AdminPage() {
  return (
    <AppShell>
      <div className="mb-6 flex items-center gap-3">
        <Shield className="h-7 w-7 text-[var(--cv-accent)]" />
        <div>
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-sm text-[var(--cv-text-secondary)]">
            Role checks + CRUD will be enforced by the Express API (service role +
            RLS).
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1 rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-3">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              className="flex w-full rounded-md px-3 py-2 text-left text-sm text-[var(--cv-text-secondary)] hover:bg-[var(--cv-elevated)] hover:text-[var(--cv-text-primary)]"
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="space-y-4">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Users", v: "1,240" },
              { k: "Questions", v: "320" },
              { k: "Submissions today", v: "4,182" },
              { k: "Error rate", v: "0.4%" },
            ].map((x) => (
              <div
                key={x.k}
                className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-4"
              >
                <p className="text-xs text-[var(--cv-text-muted)]">{x.k}</p>
                <p className="mt-2 text-2xl font-semibold">{x.v}</p>
              </div>
            ))}
          </section>

          <section className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-6">
            <h2 className="text-base font-semibold">Questions manager (stub)</h2>
            <p className="mt-2 text-sm text-[var(--cv-text-secondary)]">
              Create/edit/publish flows will POST to{" "}
              <code className="rounded bg-[var(--cv-elevated)] px-1">/api/admin/questions</code>{" "}
              on the Node server.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="primary">Create question</Button>
              <Button variant="secondary" asChild>
                <Link href="/problems">View public list</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
