import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase.js";
import { one } from "../lib/relation.js";

export const profileRouter = Router();

profileRouter.get("/:username", async (req, res) => {
  const username = req.params.username;
  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("id, username, bio, college, github_url, linkedin_url")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  if (!profile) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const uid = profile.id as string;

  const { data: lb } = await supabaseAdmin
    .from("leaderboard")
    .select("total_solved, accuracy_percent, current_streak, rank")
    .eq("user_id", uid)
    .maybeSingle();

  const { data: subs } = await supabaseAdmin
    .from("submissions")
    .select(
      `
      status,
      submitted_at,
      questions ( difficulty, title, slug, topics ( name ) ),
      coding_languages ( name )
    `
    )
    .eq("user_id", uid)
    .order("submitted_at", { ascending: false })
    .limit(80);

  let easy = 0,
    medium = 0,
    hard = 0;
  const topicBarsMap = new Map<string, number>();

  for (const s of subs ?? []) {
    if (s.status !== "accepted") continue;
    const q = one<{
      difficulty: string;
      topics: unknown;
    }>(s.questions);
    if (!q) continue;
    if (q.difficulty === "easy") easy++;
    else if (q.difficulty === "medium") medium++;
    else if (q.difficulty === "hard") hard++;
    const t = q.topics ? one<{ name: string }>(q.topics) : null;
    const tn = t?.name;
    if (tn) topicBarsMap.set(tn, (topicBarsMap.get(tn) ?? 0) + 1);
  }

  const { data: ach } = await supabaseAdmin
    .from("achievements")
    .select("badge_name, badge_icon, earned_at")
    .eq("user_id", uid)
    .limit(20);

  const recent = (subs ?? []).slice(0, 5).map((s) => {
    const q = one<{ title: string; slug: string }>(s.questions);
    const lang = one<{ name: string }>(s.coding_languages);
    return {
      title: q?.title ?? "",
      slug: q?.slug ?? "",
      language: lang?.name ?? "",
      status: s.status as string,
      at: s.submitted_at as string,
    };
  });

  res.json({
    username: profile.username,
    bio: profile.bio,
    college: profile.college,
    github_url: profile.github_url,
    linkedin_url: profile.linkedin_url,
    solved: (lb?.total_solved as number) ?? 0,
    streak: (lb?.current_streak as number) ?? 0,
    accuracy: Number(lb?.accuracy_percent ?? 0),
    rank: (lb?.rank as number) ?? 0,
    distribution: { easy, medium, hard },
    topicBars: [...topicBarsMap.entries()].map(([name, count]) => ({
      name,
      count,
    })),
    achievements: (ach ?? []).map((a) => ({
      name: a.badge_name,
      icon: a.badge_icon,
      earned_at: a.earned_at,
    })),
    recent,
  });
});
