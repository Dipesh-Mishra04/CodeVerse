import { Router } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../lib/supabase.js";
import { one } from "../lib/relation.js";
import type { AuthedRequest } from "../middleware/auth.js";
import { requireAuth } from "../middleware/auth.js";

export const tutorRouter = Router();

tutorRouter.use(requireAuth);

tutorRouter.get("/sessions", async (req: AuthedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from("tutor_sessions")
    .select(
      `
      id,
      title,
      updated_at,
      questions ( title, slug )
    `
    )
    .eq("user_id", req.user!.id)
    .order("updated_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const items = (data ?? []).map((row) => {
    const q = one<{ title: string; slug: string }>(row.questions);
    return {
      id: row.id,
      title: (row.title as string) ?? "Chat",
      question_title: q?.title ?? null,
      question_slug: q?.slug ?? null,
      updated_at: row.updated_at,
    };
  });

  res.json(items);
});

const createSession = z.object({
  question_id: z.string().uuid().optional(),
});

tutorRouter.post("/sessions", async (req: AuthedRequest, res) => {
  const parsed = createSession.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from("tutor_sessions")
    .insert({
      user_id: req.user!.id,
      question_id: parsed.data.question_id ?? null,
      title: "New session",
    })
    .select(
      `
      id,
      title,
      updated_at,
      questions ( title, slug )
    `
    )
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const q = one<{ title: string; slug: string }>(data?.questions);
  res.json({
    id: data?.id,
    title: data?.title,
    question_title: q?.title ?? null,
    question_slug: q?.slug ?? null,
    updated_at: data?.updated_at,
  });
});

tutorRouter.get("/sessions/:id/messages", async (req: AuthedRequest, res) => {
  const sessionId = req.params.id;

  const { data: session } = await supabaseAdmin
    .from("tutor_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", req.user!.id)
    .maybeSingle();

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from("tutor_messages")
    .select("id, role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data ?? []);
});

const postMessage = z.object({
  content: z.string().min(1).max(2000),
});

tutorRouter.post("/sessions/:id/messages", async (req: AuthedRequest, res) => {
  const sessionId = req.params.id;
  const parsed = postMessage.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { data: session } = await supabaseAdmin
    .from("tutor_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", req.user!.id)
    .maybeSingle();

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const { error: uErr } = await supabaseAdmin
    .from("tutor_messages")
    .insert({
      session_id: sessionId,
      role: "user",
      content: parsed.data.content,
    });

  if (uErr) {
    res.status(500).json({ error: uErr.message });
    return;
  }

  const reply =
    "Tutor streaming is not connected yet. Wire the Flask + OpenAI service to replace this stub.";

  await supabaseAdmin.from("tutor_messages").insert({
    session_id: sessionId,
    role: "assistant",
    content: reply,
  });

  await supabaseAdmin
    .from("tutor_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  res.json({ ok: true, reply });
});
