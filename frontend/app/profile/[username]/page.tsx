"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Github, Linkedin, Trophy } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { getPublicProfile } from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { getUserName } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const q = useQuery({
    queryKey: ["profile", username],
    queryFn: () => getPublicProfile(username),
  });
  const [me, setMe] = useState<string | null>(null);

  useEffect(() => {
    void getUserName().then(setMe);
  }, []);

  const pieData = q.data
    ? [
        { name: "Easy", value: q.data.distribution.easy, fill: "var(--cv-diff-easy)" },
        {
          name: "Medium",
          value: q.data.distribution.medium,
          fill: "var(--cv-diff-medium)",
        },
        { name: "Hard", value: q.data.distribution.hard, fill: "var(--cv-diff-hard)" },
      ]
    : [];

  return (
    <AppShell>
      {q.isLoading || !q.data ? (
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      ) : (
        <>
          <div className="relative overflow-hidden rounded-2xl border border-[var(--cv-border)] bg-gradient-to-br from-[var(--cv-accent)]/20 via-[var(--cv-surface)] to-[var(--cv-surface)] p-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--cv-border)] bg-[var(--cv-elevated)] text-2xl font-bold">
                    {q.data.username.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold">{q.data.username}</h1>
                    <p className="mt-1 text-sm text-[var(--cv-text-secondary)]">
                      {q.data.college ?? "—"}
                    </p>
                    <p className="mt-2 max-w-xl text-sm text-[var(--cv-text-secondary)]">
                      {q.data.bio ?? ""}
                    </p>
                    <div className="mt-3 flex gap-3">
                      {q.data.github_url ? (
                        <a
                          href={q.data.github_url}
                          className="text-[var(--cv-text-muted)] hover:text-[var(--cv-text-primary)]"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      ) : null}
                      {q.data.linkedin_url ? (
                        <a
                          href={q.data.linkedin_url}
                          className="text-[var(--cv-text-muted)] hover:text-[var(--cv-text-primary)]"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Stat label="Solved" value={String(q.data.solved)} />
                <Stat label="Streak" value={`${q.data.streak}d`} />
                <Stat label="Accuracy" value={`${q.data.accuracy}%`} />
                <Stat label="Rank" value={`#${q.data.rank}`} />
              </div>
            </div>
          </div>

          <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-2">
            <section className="min-w-0 rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-4">
              <h2 className="text-base font-semibold">Solved distribution</h2>
              <div className="mt-4 h-64 min-h-64 min-w-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                      {pieData.map((e, i) => (
                        <Cell key={i} fill={e.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="min-w-0 rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-4">
              <h2 className="text-base font-semibold">Topics</h2>
              <div className="mt-4 h-64 min-h-64 min-w-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={q.data.topicBars}>
                    <CartesianGrid stroke="var(--cv-border)" strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--cv-text-muted)" }} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--cv-text-muted)" }} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--cv-elevated)",
                        border: "1px solid var(--cv-border)",
                      }}
                    />
                    <Bar dataKey="count" fill="var(--cv-accent)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <section className="mt-8 rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-4">
            <h2 className="mb-4 text-base font-semibold">Achievements</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {q.data.achievements.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center gap-3 rounded-lg border border-[var(--cv-border)] bg-[var(--cv-elevated)] p-3"
                >
                  <Trophy className="h-5 w-5 text-amber-300" />
                  <div>
                    <p className="font-medium">{a.name}</p>
                    <p className="text-xs text-[var(--cv-text-muted)]">{a.earned_at}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-4">
            <h2 className="mb-4 text-base font-semibold">Recent submissions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-[var(--cv-text-muted)]">
                  <tr>
                    <th className="py-2">Problem</th>
                    <th className="py-2">Language</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--cv-border)]">
                  {q.data.recent.map((r) => (
                    <tr key={r.slug + r.at}>
                      <td className="py-2">
                        <Link href={`/problems/${r.slug}`} className="hover:underline">
                          {r.title}
                        </Link>
                      </td>
                      <td className="py-2">{r.language}</td>
                      <td className="py-2 capitalize">{r.status.replaceAll("_", " ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {me && me === username ? (
            <div className="mt-8 flex justify-end">
              <Button variant="secondary" asChild>
                <Link href="/settings">Edit profile</Link>
              </Button>
            </div>
          ) : null}
        </>
      )}
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-bg)]/40 px-4 py-3 text-center">
      <p className="text-xs text-[var(--cv-text-muted)]">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
