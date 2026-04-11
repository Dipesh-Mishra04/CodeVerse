import { Router } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../lib/supabase.js";
import type { AuthedRequest } from "../middleware/auth.js";
import { requireAuth } from "../middleware/auth.js";

export const executeRouter = Router();

const runBody = z.object({
  code: z.string(),
  language_id: z.string().uuid(),
  custom_input: z.string(),
});

executeRouter.post("/run", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = runBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const executor = process.env.EXECUTOR_SERVICE_URL;
  if (executor) {
    res.status(501).json({
      error: "Proxy to Flask executor not wired yet — set EXECUTOR_SERVICE_URL and implement forward.",
    });
    return;
  }

  const b = parsed.data;
  res.json({
    stdout: `Stub run (connect Flask executor). language_id=${b.language_id}, stdin bytes=${b.custom_input.length}`,
    stderr: "",
    execution_time_ms: 0,
    status: "ok",
  });
});

const submitBody = z.object({
  code: z.string(),
  language_id: z.string().uuid(),
  question_id: z.string().uuid(),
});

executeRouter.post("/submit", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = submitBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { code, language_id, question_id } = parsed.data;

  const { data: sub, error } = await supabaseAdmin
    .from("submissions")
    .insert({
      user_id: req.user!.id,
      question_id,
      language_id,
      code,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ job_id: sub.id as string });
});

executeRouter.get("/status/:jobId", requireAuth, async (req: AuthedRequest, res) => {
  const jobId = req.params.jobId;
  const { data: sub, error } = await supabaseAdmin
    .from("submissions")
    .select("id, status, passed_test_cases, total_test_cases, user_id")
    .eq("id", jobId)
    .maybeSingle();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  if (!sub || sub.user_id !== req.user!.id) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json({
    status: sub.status === "pending" ? "running" : "completed",
    passed: sub.passed_test_cases,
    total: sub.total_test_cases,
  });
});
