import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase.js";

export const leaderboardRouter = Router();

leaderboardRouter.get("/global", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = 25;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: rows, error, count } = await supabaseAdmin
    .from("leaderboard")
    .select("user_id, total_solved, accuracy_percent, current_streak, rank", {
      count: "exact",
    })
    .order("total_solved", { ascending: false })
    .range(from, to);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const userIds = (rows ?? []).map((r) => r.user_id as string);
  const { data: profs } = await supabaseAdmin
    .from("profiles")
    .select("id, username, college, avatar_url")
    .in("id", userIds);

  const pmap = new Map((profs ?? []).map((p) => [p.id, p]));

  const items = (rows ?? []).map((r, i) => {
    const p = pmap.get(r.user_id as string);
    return {
      rank: (r.rank as number) ?? from + i + 1,
      user_id: r.user_id,
      username: p?.username ?? "unknown",
      avatar_url: p?.avatar_url ?? null,
      college: p?.college ?? null,
      total_solved: (r.total_solved as number) ?? 0,
      accuracy_percent: Number(r.accuracy_percent ?? 0),
      current_streak: (r.current_streak as number) ?? 0,
    };
  });

  res.json({ items, total: count ?? items.length });
});

leaderboardRouter.get("/topic/:topicId", async (req, res) => {
  const { topicId } = req.params;
  const { data: rows } = await supabaseAdmin
    .from("leaderboard")
    .select("user_id, total_solved, accuracy_percent, current_streak, rank")
    .order("total_solved", { ascending: false })
    .limit(15);

  const userIds = (rows ?? []).map((r) => r.user_id as string);
  const { data: profs } = await supabaseAdmin
    .from("profiles")
    .select("id, username, college, avatar_url")
    .in("id", userIds);
  const pmap = new Map((profs ?? []).map((p) => [p.id, p]));

  const items = (rows ?? []).map((r, i) => {
    const p = pmap.get(r.user_id as string);
    return {
      rank: i + 1,
      user_id: r.user_id,
      username: p?.username ?? "unknown",
      avatar_url: p?.avatar_url ?? null,
      college: p?.college ?? null,
      total_solved: (r.total_solved as number) ?? 0,
      accuracy_percent: Number(r.accuracy_percent ?? 0),
      current_streak: (r.current_streak as number) ?? 0,
    };
  });

  res.json({ items, topicId });
});

leaderboardRouter.get("/college", async (_req, res) => {
  const { data: lbs } = await supabaseAdmin
    .from("leaderboard")
    .select("user_id, total_solved");

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, college");

  const collegeByUser = new Map(
    (profiles ?? []).map((p) => [p.id as string, p.college as string | null])
  );

  const byCollege = new Map<
    string,
    { members: Set<string>; combined_solved: number }
  >();

  for (const row of lbs ?? []) {
    const uid = row.user_id as string;
    const col = collegeByUser.get(uid);
    if (!col) continue;
    const cur = byCollege.get(col) ?? {
      members: new Set<string>(),
      combined_solved: 0,
    };
    cur.members.add(uid);
    cur.combined_solved += (row.total_solved as number) ?? 0;
    byCollege.set(col, cur);
  }

  const rows = [...byCollege.entries()]
    .sort((a, b) => b[1].combined_solved - a[1].combined_solved)
    .map(([college, v], idx) => ({
      rank: idx + 1,
      college,
      members: v.members.size,
      combined_solved: v.combined_solved,
      avg_accuracy: 0,
    }));

  res.json(rows);
});
