"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { Medal } from "lucide-react";
import {
  getLeaderboardCollege,
  getLeaderboardGlobal,
  getLeaderboardTopic,
  listTopics,
} from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"global" | "topic" | "college">("global");
  const [topicId, setTopicId] = useState("t1");
  const [page, setPage] = useState(1);

  const topics = useQuery({ queryKey: ["topics"], queryFn: listTopics });
  const global = useQuery({
    queryKey: ["lb-global", page],
    queryFn: () => getLeaderboardGlobal(page),
    refetchInterval: 5 * 60 * 1000,
  });
  const byTopic = useQuery({
    queryKey: ["lb-topic", topicId],
    queryFn: () => getLeaderboardTopic(topicId),
    enabled: tab === "topic",
  });
  const college = useQuery({
    queryKey: ["lb-college"],
    queryFn: getLeaderboardCollege,
    enabled: tab === "college",
  });

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Leaderboard</h1>
          <p className="mt-1 text-sm text-[var(--cv-text-secondary)]">
            Global rankings refresh every 5 minutes (demo data).
          </p>
        </div>
        <div className="flex gap-2">
          {(["global", "topic", "college"] as const).map((t) => (
            <Button
              key={t}
              size="sm"
              variant={tab === t ? "primary" : "secondary"}
              onClick={() => setTab(t)}
              className="capitalize"
            >
              {t === "topic" ? "By topic" : t}
            </Button>
          ))}
        </div>
      </div>

      {tab === "topic" && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-[var(--cv-text-muted)]">Topic:</span>
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="h-9 rounded-md border border-[var(--cv-border)] bg-[var(--cv-surface)] px-2 text-sm"
          >
            {topics.data?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {tab === "global" && (
        <div className="overflow-hidden rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--cv-border)] text-xs uppercase text-[var(--cv-text-muted)]">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">College</th>
                <th className="px-4 py-3">Solved</th>
                <th className="px-4 py-3">Accuracy</th>
                <th className="px-4 py-3">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cv-border)]">
              {global.isLoading &&
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3" colSpan={6}>
                      <Skeleton className="h-6" />
                    </td>
                  </tr>
                ))}
              {global.data?.items.map((u) => (
                <tr key={u.user_id} className="hover:bg-[var(--cv-elevated)]/50">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      {u.rank <= 3 ? (
                        <Medal
                          className={
                            u.rank === 1
                              ? "text-amber-300"
                              : u.rank === 2
                                ? "text-neutral-300"
                                : "text-amber-700"
                          }
                        />
                      ) : null}
                      {u.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/profile/${u.username}`}
                      className="font-medium hover:underline"
                    >
                      {u.username}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--cv-text-secondary)]">
                    {u.college ?? "—"}
                  </td>
                  <td className="px-4 py-3">{u.total_solved}</td>
                  <td className="px-4 py-3">{u.accuracy_percent.toFixed(1)}%</td>
                  <td className="px-4 py-3">{u.current_streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-center gap-2 border-t border-[var(--cv-border)] p-3">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!global.data || page * 25 >= global.data.total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {tab === "topic" && (
        <div className="overflow-hidden rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--cv-border)] text-xs uppercase text-[var(--cv-text-muted)]">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Solved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cv-border)]">
              {byTopic.data?.items.map((u) => (
                <tr key={u.user_id}>
                  <td className="px-4 py-3">{u.rank}</td>
                  <td className="px-4 py-3">{u.username}</td>
                  <td className="px-4 py-3">{u.total_solved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "college" && (
        <div className="overflow-hidden rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--cv-border)] text-xs uppercase text-[var(--cv-text-muted)]">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">College</th>
                <th className="px-4 py-3">Members</th>
                <th className="px-4 py-3">Combined solved</th>
                <th className="px-4 py-3">Avg accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cv-border)]">
              {college.data?.map((r) => (
                <tr key={r.college}>
                  <td className="px-4 py-3">{r.rank}</td>
                  <td className="px-4 py-3 font-medium">{r.college}</td>
                  <td className="px-4 py-3">{r.members}</td>
                  <td className="px-4 py-3">{r.combined_solved}</td>
                  <td className="px-4 py-3">{r.avg_accuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
