"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAnalyticsProgress, getAnalyticsTopics } from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

const ranges = ["7d", "30d", "3m", "all"] as const;

export default function AnalyticsPage() {
  const [range, setRange] = useState<(typeof ranges)[number]>("30d");
  const progress = useQuery({
    queryKey: ["analytics-progress", range],
    queryFn: () => getAnalyticsProgress(range),
  });
  const topics = useQuery({
    queryKey: ["analytics-topics"],
    queryFn: getAnalyticsTopics,
  });

  const lineData =
    progress.data?.dates.map((d, i) => ({
      date: d.slice(5),
      solved: progress.data.solved[i],
      submissions: progress.data.submissions[i],
    })) ?? [];

  const barData =
    topics.data?.map((t) => ({
      name: t.topic,
      easy: t.easy,
      medium: t.medium,
      hard: t.hard,
    })) ?? [];

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Performance analytics</h1>
          <p className="mt-1 text-sm text-[var(--cv-text-secondary)]">
            Demo series — will bind to Supabase aggregates via Node API.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ranges.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={range === r ? "primary" : "secondary"}
              onClick={() => setRange(r)}
            >
              {r === "7d"
                ? "7 days"
                : r === "30d"
                  ? "30 days"
                  : r === "3m"
                    ? "3 months"
                    : "All time"}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-4">
          <h2 className="text-base font-semibold">Daily activity</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid stroke="var(--cv-border)" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "var(--cv-text-muted)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--cv-text-muted)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--cv-elevated)",
                    border: "1px solid var(--cv-border)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="solved" stroke="var(--cv-success)" dot={false} />
                <Line
                  type="monotone"
                  dataKey="submissions"
                  stroke="var(--cv-accent)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-4">
          <h2 className="text-base font-semibold">Topic breakdown</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid stroke="var(--cv-border)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "var(--cv-text-muted)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--cv-text-muted)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--cv-elevated)",
                    border: "1px solid var(--cv-border)",
                  }}
                />
                <Legend />
                <Bar dataKey="easy" stackId="a" fill="var(--cv-diff-easy)" />
                <Bar dataKey="medium" stackId="a" fill="var(--cv-diff-medium)" />
                <Bar dataKey="hard" stackId="a" fill="var(--cv-diff-hard)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
