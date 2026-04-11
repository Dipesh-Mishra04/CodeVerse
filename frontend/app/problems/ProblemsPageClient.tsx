"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bookmark, CheckCircle2, CircleDot, Search } from "lucide-react";
import { listQuestions, listTopics } from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { DifficultyBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Difficulty, QuestionSummary } from "@/types";
import { cn } from "@/lib/utils";

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export function ProblemsPageClient() {
  const sp = useSearchParams();
  const [search, setSearch] = useState(sp.get("search") || "");
  const [topics, setTopics] = useState<string[]>(
    sp.get("topics")?.split(",").filter(Boolean) || []
  );
  const [diffs, setDiffs] = useState<string[]>(
    sp.get("difficulties")?.split(",").filter(Boolean) || []
  );
  const [status, setStatus] = useState(sp.get("status") || "all");
  const [premium, setPremium] = useState(sp.get("premium") || "all");
  const [page, setPage] = useState(Number(sp.get("page") || "1"));

  const topicsQuery = useQuery({ queryKey: ["topics"], queryFn: listTopics });

  const debouncedSearch = useDebouncedValue(search, 300);

  const listQuery = useQuery({
    queryKey: ["questions", debouncedSearch, topics, diffs, status, premium, page],
    queryFn: () =>
      listQuestions({
        search: debouncedSearch || undefined,
        topics: topics.length ? topics : undefined,
        difficulties: diffs.length ? diffs : undefined,
        status: status === "all" ? undefined : status,
        premium: premium === "all" ? undefined : premium,
        page,
        pageSize: 50,
      }),
  });

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (topics.length) params.set("topics", topics.join(","));
    if (diffs.length) params.set("difficulties", diffs.join(","));
    if (status !== "all") params.set("status", status);
    if (premium !== "all") params.set("premium", premium);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    const url = qs ? `/problems?${qs}` : "/problems";
    window.history.replaceState(null, "", url);
  }, [debouncedSearch, topics, diffs, status, premium, page]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  const items = listQuery.data?.items ?? [];
  const total = listQuery.data?.total ?? 0;

  const toggleTopic = (slug: string) => {
    setTopics((t) =>
      t.includes(slug) ? t.filter((x) => x !== slug) : [...t, slug]
    );
    setPage(1);
  };

  const toggleDiff = (d: Difficulty) => {
    setDiffs((x) =>
      x.includes(d) ? x.filter((y) => y !== d) : [...x, d]
    );
    setPage(1);
  };

  return (
    <AppShell>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6 rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-4 lg:sticky lg:top-24 lg:self-start">
          <div>
            <label className="text-xs font-medium uppercase text-[var(--cv-text-muted)]">
              Search
            </label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--cv-text-muted)]" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Filter by title…"
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-[var(--cv-text-muted)]">
              Topics
            </p>
            <div className="mt-3 max-h-56 space-y-2 overflow-y-auto text-sm">
              {topicsQuery.isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6" />
                ))}
              {topicsQuery.data?.map((t) => (
                <label
                  key={t.id}
                  className="flex cursor-pointer items-center gap-2 text-[var(--cv-text-secondary)]"
                >
                  <input
                    type="checkbox"
                    checked={topics.includes(t.slug)}
                    onChange={() => toggleTopic(t.slug)}
                    className="rounded border-[var(--cv-border)]"
                  />
                  <span>
                    {t.name}{" "}
                    <span className="text-[var(--cv-text-muted)]">
                      ({t.questionCount ?? 0})
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-[var(--cv-text-muted)]">
              Difficulty
            </p>
            <div className="mt-3 space-y-2">
              {difficulties.map((d) => (
                <label
                  key={d}
                  className="flex cursor-pointer items-center gap-2 text-sm capitalize text-[var(--cv-text-secondary)]"
                >
                  <input
                    type="checkbox"
                    checked={diffs.includes(d)}
                    onChange={() => toggleDiff(d)}
                    className="rounded border-[var(--cv-border)]"
                  />
                  <DifficultyBadge d={d} />
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-[var(--cv-text-muted)]">
              Status
            </p>
            <div className="mt-3 space-y-2 text-sm">
              {(["all", "solved", "attempted", "unsolved"] as const).map((s) => (
                <label
                  key={s}
                  className="flex cursor-pointer items-center gap-2 text-[var(--cv-text-secondary)]"
                >
                  <input
                    type="radio"
                    name="status"
                    checked={status === s}
                    onChange={() => {
                      setStatus(s);
                      setPage(1);
                    }}
                    className="border-[var(--cv-border)]"
                  />
                  <span className="capitalize">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-[var(--cv-text-muted)]">
              Premium
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                variant={premium === "free" ? "primary" : "secondary"}
                size="sm"
                onClick={() => {
                  setPremium("free");
                  setPage(1);
                }}
              >
                Free
              </Button>
              <Button
                variant={premium === "all" ? "primary" : "secondary"}
                size="sm"
                onClick={() => {
                  setPremium("all");
                  setPage(1);
                }}
              >
                All
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setTopics([]);
              setDiffs([]);
              setStatus("all");
              setPremium("all");
              setPage(1);
            }}
          >
            Clear filters
          </Button>
        </aside>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Problems</h1>
              <p className="mt-1 text-sm text-[var(--cv-text-secondary)]">
                {total} matching {total === 1 ? "problem" : "problems"}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)]">
            {listQuery.isLoading ? (
              <div className="divide-y divide-[var(--cv-border)]">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-[var(--cv-text-secondary)]">
                  No problems match your filters. Try adjusting them.
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => {
                    setSearch("");
                    setTopics([]);
                    setDiffs([]);
                    setStatus("all");
                    setPremium("all");
                    setPage(1);
                  }}
                >
                  Reset filters
                </Button>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[var(--cv-border)] text-xs uppercase text-[var(--cv-text-muted)]">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Difficulty</th>
                    <th className="px-4 py-3">Topic</th>
                    <th className="px-4 py-3">Tags</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--cv-border)]">
                  {items.map((row, idx) => (
                    <ProblemRow
                      key={row.id}
                      index={(page - 1) * 50 + idx + 1}
                      row={row}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {total > 50 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-[var(--cv-text-muted)]">
                Page {page}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page * 50 >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function ProblemRow({ row, index }: { row: QuestionSummary; index: number }) {
  const [bm, setBm] = useState(row.bookmarked);
  return (
    <tr className="hover:bg-[var(--cv-elevated)]/60">
      <td className="px-4 py-3 text-[var(--cv-text-muted)]">{index}</td>
      <td className="px-4 py-3">
        <StatusIcon status={row.status} />
      </td>
      <td className="px-4 py-3">
        <Link
          href={`/problems/${row.slug}`}
          className="font-medium text-[var(--cv-text-primary)] hover:underline"
        >
          {row.title}
        </Link>
        {row.is_premium ? (
          <span className="ml-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-200">
            Pro
          </span>
        ) : null}
      </td>
      <td className="px-4 py-3">
        <DifficultyBadge d={row.difficulty} />
      </td>
      <td className="px-4 py-3 text-[var(--cv-text-secondary)]">{row.topic.name}</td>
      <td className="px-4 py-3 text-xs text-[var(--cv-text-muted)]">
        {row.company_tags.slice(0, 2).join(", ")}
        {row.company_tags.length > 2 ? ` +${row.company_tags.length - 2}` : ""}
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          aria-label="Bookmark"
          onClick={() => setBm(!bm)}
          className={cn(
            "rounded-md p-1.5 transition-colors",
            bm ? "text-amber-300" : "text-[var(--cv-text-muted)] hover:text-[var(--cv-text-primary)]"
          )}
        >
          <Bookmark className={cn("h-4 w-4", bm && "fill-current")} />
        </button>
      </td>
    </tr>
  );
}

function StatusIcon({ status }: { status: QuestionSummary["status"] }) {
  if (status === "solved")
    return <CheckCircle2 className="h-4 w-4 text-[var(--cv-success)]" />;
  if (status === "attempted")
    return <CircleDot className="h-4 w-4 text-[var(--cv-warning)]" />;
  return <span className="inline-block h-2 w-2 rounded-full bg-[var(--cv-border)]" />;
}

function useDebouncedValue<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
