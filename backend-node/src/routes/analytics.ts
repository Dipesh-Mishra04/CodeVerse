import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase.js";
import { one } from "../lib/relation.js";
import type { AuthedRequest } from "../middleware/auth.js";
import { requireAuth } from "../middleware/auth.js";

export const analyticsRouter = Router();

analyticsRouter.get("/dashboard", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.user!.id;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("username, daily_goal")
    .eq("id", userId)
    .maybeSingle();

  const { data: lb } = await supabaseAdmin
    .from("leaderboard")
    .select("total_solved, accuracy_percent, current_streak, rank")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: streakRow } = await supabaseAdmin
    .from("streaks")
    .select("current_streak, longest_streak")
    .eq("user_id", userId)
    .maybeSingle();

  const { count: solvedCount } = await supabaseAdmin
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "accepted");

  const { count: totalSubs } = await supabaseAdmin
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const accepted = solvedCount ?? 0;
  const total = totalSubs ?? 0;
  const accuracy =
    total > 0 ? Math.round((accepted / total) * 1000) / 10 : 0;

  const today = new Date().toISOString().slice(0, 10);
  const { data: dayAct } = await supabaseAdmin
    .from("daily_activity")
    .select("time_spent_minutes, questions_solved")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  const goal = (profile?.daily_goal as number) ?? 2;
  const goalProgress = (dayAct?.questions_solved as number) ?? 0;

  const { data: recent } = await supabaseAdmin
    .from("submissions")
    .select(
      `
      id,
      status,
      submitted_at,
      questions ( title, slug ),
      coding_languages ( name )
    `
    )
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false })
    .limit(10);

  const recent_submissions = (recent ?? []).map((r) => {
    const q = one<{ title: string; slug: string }>(r.questions);
    const lang = one<{ name: string }>(r.coding_languages);
    return {
      id: r.id as string,
      question_slug: q?.slug ?? "",
      question_title: q?.title ?? "",
      language: lang?.name ?? "—",
      status: r.status as string,
      submitted_at: r.submitted_at as string,
    };
  });

  const { data: activity } = await supabaseAdmin
    .from("daily_activity")
    .select("date, questions_solved")
    .eq("user_id", userId)
    .order("date", { ascending: true })
    .limit(365);

  const heatmap = (activity ?? []).map((a) => ({
    date: a.date as string,
    count: (a.questions_solved as number) ?? 0,
  }));

  res.json({
    greeting_name: (profile?.username as string) ?? "Coder",
    total_solved: (lb?.total_solved as number) ?? accepted,
    current_streak:
      (streakRow?.current_streak as number) ??
      (lb?.current_streak as number) ??
      0,
    accuracy_percent: Number(lb?.accuracy_percent ?? accuracy),
    time_spent_today_minutes: (dayAct?.time_spent_minutes as number) ?? 0,
    goal_daily: goal,
    goal_progress: goalProgress,
    trend: {
      solved_vs_yesterday_pct: 0,
      streak_vs_yesterday_pct: 0,
      accuracy_vs_yesterday_pct: 0,
      time_vs_yesterday_pct: 0,
    },
    weakness_topics: [],
    recent_submissions,
    recommended: [],
    heatmap,
    radar: [],
  });
});

analyticsRouter.get("/progress", requireAuth, async (req: AuthedRequest, res) => {
  const range = (req.query.range as string) || "7d";
  const days =
    range === "7d" ? 7 : range === "30d" ? 30 : range === "3m" ? 90 : 120;

  const { data: rows } = await supabaseAdmin
    .from("daily_activity")
    .select("date, questions_solved, submissions_made")
    .eq("user_id", req.user!.id)
    .order("date", { ascending: false })
    .limit(days);

  const byDate = new Map<string, { sol: number; sub: number }>();
  for (const r of rows ?? []) {
    byDate.set(r.date as string, {
      sol: (r.questions_solved as number) ?? 0,
      sub: (r.submissions_made as number) ?? 0,
    });
  }

  const dates: string[] = [];
  const solved: number[] = [];
  const submissions: number[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dates.push(key);
    const v = byDate.get(key);
    solved.push(v?.sol ?? 0);
    submissions.push(v?.sub ?? 0);
  }

  res.json({ dates, solved, submissions });
});

analyticsRouter.get("/topics", requireAuth, async (req: AuthedRequest, res) => {
  const { data: subs } = await supabaseAdmin
    .from("submissions")
    .select(
      `
      status,
      questions ( difficulty, topics ( name ) )
    `
    )
    .eq("user_id", req.user!.id);

  const map = new Map<
    string,
    { topic: string; easy: number; medium: number; hard: number }
  >();

  for (const s of subs ?? []) {
    const q = one<{
      difficulty: string;
      topics: unknown;
    }>(s.questions);
    if (!q) continue;
    const t = q.topics ? one<{ name: string }>(q.topics) : null;
    if (!t?.name || s.status !== "accepted") continue;
    const name = t.name;
    const row = map.get(name) ?? {
      topic: name,
      easy: 0,
      medium: 0,
      hard: 0,
    };
    if (q.difficulty === "easy") row.easy += 1;
    else if (q.difficulty === "medium") row.medium += 1;
    else if (q.difficulty === "hard") row.hard += 1;
    map.set(name, row);
  }

  res.json([...map.values()]);
});
