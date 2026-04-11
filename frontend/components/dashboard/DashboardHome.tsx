"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  Flame,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { getDashboard } from "@/lib/api";
import { formatRelativeTime } from "@/lib/utils";
import { Badge, DifficultyBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { SubmissionStatus } from "@/types";

function statusStyle(s: SubmissionStatus) {
  if (s === "accepted") return "text-[var(--cv-success)] border-[var(--cv-success)]/40";
  if (s === "wrong_answer") return "text-[var(--cv-warning)] border-[var(--cv-warning)]/40";
  return "text-[var(--cv-error)] border-[var(--cv-error)]/40";
}

function Trend({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${up ? "text-[var(--cv-success)]" : "text-[var(--cv-error)]"}`}
    >
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {Math.abs(value)}%
    </span>
  );
}

export function DashboardHome({ displayName }: { displayName: string }) {
  const q = useQuery({ queryKey: ["dashboard"], queryFn: getDashboard });

  if (q.isLoading || !q.data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  const d = q.data;
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const goalMet = d.goal_progress >= d.goal_daily;

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-[var(--cv-text-muted)]">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {greeting}, {displayName || d.greeting_name}{" "}
          <span aria-hidden>👋</span>
        </h1>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-[var(--cv-success)]" />}
          label="Total solved"
          value={String(d.total_solved)}
          trend={<Trend value={d.trend.solved_vs_yesterday_pct} />}
        />
        <StatCard
          icon={<Flame className="h-5 w-5 text-orange-400" />}
          label="Current streak"
          value={`${d.current_streak} days`}
          trend={<Trend value={d.trend.streak_vs_yesterday_pct} />}
        />
        <StatCard
          icon={<Activity className="h-5 w-5 text-[var(--cv-accent)]" />}
          label="Accuracy"
          value={`${d.accuracy_percent}%`}
          trend={<Trend value={d.trend.accuracy_vs_yesterday_pct} />}
        />
        <StatCard
          icon={<Timer className="h-5 w-5 text-cyan-300" />}
          label="Time today"
          value={`${d.time_spent_today_minutes} min`}
          trend={<Trend value={d.trend.time_vs_yesterday_pct} />}
        />
      </section>

      <section className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-[var(--cv-accent)]" />
            <h2 className="text-base font-semibold">Daily goal</h2>
          </div>
          {goalMet ? (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--cv-success)]">
              <CheckCircle2 className="h-4 w-4" /> Goal achieved!
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-[var(--cv-text-secondary)]">
          Today: {d.goal_progress} / {d.goal_daily} problems
        </p>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[var(--cv-elevated)]">
          <div
            className={`h-full rounded-full transition-all ${goalMet ? "bg-[var(--cv-success)]" : "bg-[var(--cv-accent)]"}`}
            style={{
              width: `${Math.min(100, (d.goal_progress / Math.max(1, d.goal_daily)) * 100)}%`,
            }}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-5">
          <h2 className="text-base font-semibold">Activity heatmap</h2>
          <p className="mt-1 text-xs text-[var(--cv-text-muted)]">
            Last 52 weeks (demo data — connects to Supabase when backend lands)
          </p>
          <HeatmapStrip data={d.heatmap} />
        </section>

        <section className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-5">
          <h2 className="text-base font-semibold">Topic accuracy</h2>
          <div className="mt-4 h-72 w-full min-h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={d.radar.map((x) => ({ topic: x.topic, accuracy: x.accuracy }))}>
                <PolarGrid stroke="var(--cv-border)" />
                <PolarAngleAxis dataKey="topic" tick={{ fill: "var(--cv-text-muted)", fontSize: 11 }} />
                <Radar
                  name="Accuracy"
                  dataKey="accuracy"
                  stroke="var(--cv-accent)"
                  fill="var(--cv-accent)"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-5">
          <h2 className="text-base font-semibold">Weak topics</h2>
          <ul className="mt-4 space-y-3">
            {d.weakness_topics.map((t) => (
              <li
                key={t.slug}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--cv-border)] bg-[var(--cv-elevated)] px-4 py-3"
              >
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-[var(--cv-text-muted)]">
                    Accuracy {t.accuracy}%
                  </p>
                </div>
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/problems?topics=${t.slug}`}>Practice</Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-5">
          <h2 className="text-base font-semibold">Recommended</h2>
          <div className="mt-4 space-y-3">
            {d.recommended.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--cv-border)] bg-[var(--cv-elevated)] px-4 py-3"
              >
                <div>
                  <p className="font-medium">{p.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <DifficultyBadge d={p.difficulty} />
                    <Badge>{p.topic.name}</Badge>
                  </div>
                </div>
                <Button variant="primary" size="sm" asChild>
                  <Link href={`/problems/${p.slug}`}>Solve</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Recent submissions</h2>
          <Link
            href="/analytics"
            className="text-sm text-[var(--cv-accent)] hover:underline"
          >
            View analytics
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase text-[var(--cv-text-muted)]">
              <tr>
                <th className="pb-2">Problem</th>
                <th className="pb-2">Language</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cv-border)]">
              {d.recent_submissions.map((s) => (
                <tr key={s.id} className="text-[var(--cv-text-secondary)]">
                  <td className="py-3">
                    <Link
                      href={`/problems/${s.question_slug}`}
                      className="font-medium text-[var(--cv-text-primary)] hover:underline"
                    >
                      {s.question_title}
                    </Link>
                  </td>
                  <td className="py-3">{s.language}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs capitalize ${statusStyle(s.status)}`}
                    >
                      {s.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 text-xs">{formatRelativeTime(s.submitted_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--cv-border)] bg-gradient-to-br from-[var(--cv-surface)] to-[var(--cv-elevated)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Need help?</h2>
            <p className="mt-1 text-sm text-[var(--cv-text-secondary)]">
              Open the AI tutor with question context (streaming when backend is live).
            </p>
          </div>
          <Button variant="primary" asChild>
            <Link href="/tutor">Open tutor</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--cv-text-muted)]">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        <div className="rounded-lg border border-[var(--cv-border)] bg-[var(--cv-elevated)] p-2">
          {icon}
        </div>
      </div>
      <div className="mt-3 text-xs text-[var(--cv-text-muted)]">vs yesterday {trend}</div>
    </div>
  );
}

function HeatmapStrip({ data }: { data: { date: string; count: number }[] }) {
  const slice = data.slice(-120);
  const levelColor = (count: number) => {
    const l =
      count === 0 ? 0 : count <= 1 ? 1 : count <= 2 ? 2 : count <= 4 ? 3 : 4;
    return [
      "bg-[var(--cv-border)]/25",
      "bg-emerald-500/25",
      "bg-emerald-500/45",
      "bg-emerald-500/65",
      "bg-emerald-500/85",
    ][l];
  };
  return (
    <div className="mt-4 flex flex-wrap gap-1">
      {slice.map((d) => (
        <div
          key={d.date}
          title={`${d.date}: ${d.count} solved`}
          className={`h-3 w-3 rounded-sm ${levelColor(d.count)}`}
        />
      ))}
    </div>
  );
}
