import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase.js";

export const topicsRouter = Router();

topicsRouter.get("/", async (_req, res) => {
  const { data: topics, error: tErr } = await supabaseAdmin
    .from("topics")
    .select("id, name, slug, icon, description, display_order")
    .order("display_order", { ascending: true });

  if (tErr) {
    res.status(500).json({ error: tErr.message });
    return;
  }

  const { data: counts, error: cErr } = await supabaseAdmin
    .from("questions")
    .select("topic_id")
    .eq("is_published", true);

  if (cErr) {
    res.status(500).json({ error: cErr.message });
    return;
  }

  const byTopic = new Map<string, number>();
  for (const row of counts ?? []) {
    const tid = row.topic_id as string | null;
    if (!tid) continue;
    byTopic.set(tid, (byTopic.get(tid) ?? 0) + 1);
  }

  const items = (topics ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    icon: t.icon,
    description: t.description,
    questionCount: byTopic.get(t.id) ?? 0,
  }));

  res.json(items);
});
