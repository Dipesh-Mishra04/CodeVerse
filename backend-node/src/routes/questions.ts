import { Router } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../lib/supabase.js";
import { one } from "../lib/relation.js";
import type { AuthedRequest } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/auth.js";

export const questionsRouter = Router();

const listQuery = z.object({
  search: z.string().optional(),
  topics: z.string().optional(),
  difficulties: z.string().optional(),
  status: z.string().optional(),
  premium: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(50),
});

questionsRouter.get("/", optionalAuth, async (req: AuthedRequest, res) => {
  const parsed = listQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const q = parsed.data;
  const pageSize = q.pageSize;
  const from = (q.page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from("questions")
    .select(
      "id, title, slug, difficulty, is_premium, topic_id, company_tags, topics(id, name, slug)",
      { count: "exact" }
    )
    .eq("is_published", true);

  if (q.search?.trim()) {
    query = query.ilike("title", `%${q.search.trim()}%`);
  }

  if (q.difficulties) {
    const diffs = q.difficulties.split(",").filter(Boolean);
    if (diffs.length) {
      query = query.in(
        "difficulty",
        diffs as ("easy" | "medium" | "hard")[]
      );
    }
  }

  if (q.premium === "free") {
    query = query.eq("is_premium", false);
  }

  if (q.topics) {
    const slugs = q.topics.split(",").filter(Boolean);
    if (slugs.length) {
      const { data: topicRows } = await supabaseAdmin
        .from("topics")
        .select("id")
        .in("slug", slugs);
      const ids = (topicRows ?? []).map((t) => t.id);
      if (ids.length === 0) {
        res.json({ items: [], total: 0, page: q.page });
        return;
      }
      query = query.in("topic_id", ids);
    }
  }

  query = query.order("title", { ascending: true }).range(from, to);

  const { data: rows, error, count } = await query;

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const questionIds = (rows ?? []).map((r) => r.id);
  const userId = req.user?.id;

  let statusByQ = new Map<string, "solved" | "attempted" | "unsolved">();
  let bookmarkSet = new Set<string>();

  if (userId && questionIds.length) {
    const { data: subs } = await supabaseAdmin
      .from("submissions")
      .select("question_id, status, submitted_at")
      .eq("user_id", userId)
      .in("question_id", questionIds)
      .order("submitted_at", { ascending: false });

    const best = new Map<string, string>();
    for (const s of subs ?? []) {
      const qid = s.question_id as string;
      if (!best.has(qid)) best.set(qid, s.status as string);
    }
    for (const qid of questionIds) {
      const st = best.get(qid);
      if (!st) statusByQ.set(qid, "unsolved");
      else if (st === "accepted") statusByQ.set(qid, "solved");
      else statusByQ.set(qid, "attempted");
    }

    const { data: bms } = await supabaseAdmin
      .from("bookmarks")
      .select("question_id")
      .eq("user_id", userId)
      .in("question_id", questionIds);
    for (const b of bms ?? []) {
      bookmarkSet.add(b.question_id as string);
    }
  } else {
    for (const qid of questionIds) statusByQ.set(qid, "unsolved");
  }

  let items = (rows ?? []).map((row) => {
    const topic = one<{ id: string; name: string; slug: string }>(row.topics);
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      difficulty: row.difficulty,
      topic: topic
        ? { id: topic.id, name: topic.name, slug: topic.slug }
        : { id: "", name: "General", slug: "general" },
      company_tags: (row.company_tags as string[]) ?? [],
      is_premium: row.is_premium,
      status: statusByQ.get(row.id) ?? "unsolved",
      bookmarked: bookmarkSet.has(row.id),
    };
  });

  if (q.status && q.status !== "all") {
    items = items.filter((it) => it.status === q.status);
  }

  res.json({
    items,
    total: count ?? items.length,
    page: q.page,
  });
});

questionsRouter.get("/:slug", optionalAuth, async (req: AuthedRequest, res) => {
  const slug = req.params.slug;
  if (!slug) {
    res.status(400).json({ error: "Missing slug" });
    return;
  }

  const { data: qrow, error } = await supabaseAdmin
    .from("questions")
    .select(
      "id, title, slug, difficulty, description, topic_id, company_tags, constraints, input_format, output_format, sample_input, sample_output, editorial, is_premium, topics(id, name, slug)"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  if (!qrow) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const topic = one<{ id: string; name: string; slug: string }>(qrow.topics);

  let userSolved = false;
  if (req.user?.id) {
    const { data: ac } = await supabaseAdmin
      .from("submissions")
      .select("id")
      .eq("user_id", req.user.id)
      .eq("question_id", qrow.id)
      .eq("status", "accepted")
      .limit(1)
      .maybeSingle();
    userSolved = !!ac;
  }

  res.json({
    id: qrow.id,
    title: qrow.title,
    slug: qrow.slug,
    difficulty: qrow.difficulty,
    description: qrow.description,
    topic: topic
      ? { id: topic.id, name: topic.name, slug: topic.slug }
      : { id: "", name: "General", slug: "general" },
    company_tags: (qrow.company_tags as string[]) ?? [],
    constraints: qrow.constraints,
    input_format: qrow.input_format,
    output_format: qrow.output_format,
    sample_input: qrow.sample_input,
    sample_output: qrow.sample_output,
    editorial: userSolved ? qrow.editorial : null,
    is_premium: qrow.is_premium,
    related_topic_slugs: topic ? [topic.slug] : [],
    user_solved: userSolved,
  });
});
