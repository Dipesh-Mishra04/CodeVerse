import { Router } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../lib/supabase.js";
import type { AuthedRequest } from "../middleware/auth.js";
import { requireAuth } from "../middleware/auth.js";

export const executeRouter = Router();

const runBody = z.object({
  code: z.string(),
  language_id: z.string().min(1),
  custom_input: z.string().default(""),
});

type ExecutionProvider = "piston" | "judge0";

type ResolvedLanguage = {
  id: string;
  name: string;
  slug: string;
  version: string;
};

type RunResult = {
  stdout: string;
  stderr: string;
  execution_time_ms: number;
  status: "ok" | "error";
};

const DEFAULT_PROVIDER: ExecutionProvider = "piston";
const DEFAULT_PISTON_URL = "https://emkc.org/api/v2/piston/execute";
const DEFAULT_JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";

const fallbackLanguages: Record<string, ResolvedLanguage> = {
  py: { id: "py", name: "Python", slug: "python", version: "3.10.0" },
  python: { id: "python", name: "Python", slug: "python", version: "3.10.0" },
  js: { id: "js", name: "JavaScript", slug: "javascript", version: "18.15.0" },
  javascript: {
    id: "javascript",
    name: "JavaScript",
    slug: "javascript",
    version: "18.15.0",
  },
  ts: { id: "ts", name: "TypeScript", slug: "typescript", version: "5.0.3" },
  typescript: {
    id: "typescript",
    name: "TypeScript",
    slug: "typescript",
    version: "5.0.3",
  },
  java: { id: "java", name: "Java", slug: "java", version: "15.0.2" },
  cpp: { id: "cpp", name: "C++", slug: "cpp", version: "10.2.0" },
  c: { id: "c", name: "C", slug: "c", version: "10.2.0" },
  go: { id: "go", name: "Go", slug: "go", version: "1.16.2" },
};

function getExecutionProvider(): ExecutionProvider {
  const raw = process.env.CODE_EXECUTION_PROVIDER?.trim().toLowerCase();
  return raw === "judge0" ? "judge0" : DEFAULT_PROVIDER;
}

function parseOptionalJson(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] => typeof entry[0] === "string" && typeof entry[1] === "string"
      )
    );
  } catch {
    return {};
  }
}

async function resolveLanguage(languageId: string): Promise<ResolvedLanguage | null> {
  const { data, error } = await supabaseAdmin
    .from("coding_languages")
    .select("id, name, slug, version")
    .eq("id", languageId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    return {
      id: data.id as string,
      name: data.name as string,
      slug: (data.slug as string).toLowerCase(),
      version: String(data.version ?? "").trim(),
    };
  }

  const fallback = fallbackLanguages[languageId.toLowerCase()];
  return fallback ?? null;
}

function getPistonRuntime(language: ResolvedLanguage): { language: string; version: string } {
  const languageMap = {
    python: "python",
    javascript: "javascript",
    typescript: "typescript",
    java: "java",
    cpp: "cpp",
    c: "c",
    go: "go",
  } as const;
  const versionOverrides = parseOptionalJson(process.env.PISTON_VERSION_MAP);
  const normalizedSlug = language.slug.toLowerCase();
  const runtimeLanguage =
    languageMap[normalizedSlug as keyof typeof languageMap] ?? normalizedSlug;
  const runtimeVersion =
    versionOverrides[normalizedSlug] ||
    language.version ||
    fallbackLanguages[normalizedSlug]?.version ||
    "*";

  return {
    language: runtimeLanguage,
    version: runtimeVersion,
  };
}

function getJudge0LanguageId(language: ResolvedLanguage): number | null {
  const configuredMap = parseOptionalJson(process.env.JUDGE0_LANGUAGE_MAP);
  const rawValue = configuredMap[language.slug.toLowerCase()];
  if (!rawValue) return null;
  const parsed = Number(rawValue);
  return Number.isInteger(parsed) ? parsed : null;
}

async function runViaPiston(language: ResolvedLanguage, code: string, stdin: string): Promise<RunResult> {
  const endpoint = process.env.PISTON_URL?.trim() || DEFAULT_PISTON_URL;
  const runtime = getPistonRuntime(language);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: runtime.language,
      version: runtime.version,
      files: [{ content: code }],
      stdin,
      compile_timeout: Number(process.env.PISTON_COMPILE_TIMEOUT_MS ?? 10_000),
      run_timeout: Number(process.env.PISTON_RUN_TIMEOUT_MS ?? 5_000),
      compile_memory_limit: Number(process.env.PISTON_COMPILE_MEMORY_LIMIT_BYTES ?? -1),
      run_memory_limit: Number(process.env.PISTON_RUN_MEMORY_LIMIT_BYTES ?? -1),
    }),
  });

  if (!response.ok) {
    throw new Error(`Piston request failed with ${response.status}`);
  }

  const payload = (await response.json()) as {
    compile?: { stdout?: string; stderr?: string; output?: string; code?: number };
    run?: { stdout?: string; stderr?: string; output?: string; code?: number; signal?: string | null };
  };
  const compileStderr =
    payload.compile?.stderr || payload.compile?.output || "";
  const runStdout = payload.run?.stdout || "";
  const runStderr = payload.run?.stderr || payload.run?.output || "";
  const stderr = [compileStderr, runStderr].filter(Boolean).join("\n");
  const isError = Boolean(
    compileStderr ||
      runStderr ||
      (payload.run?.code !== undefined && payload.run.code !== 0) ||
      payload.run?.signal
  );

  return {
    stdout: runStdout,
    stderr,
    execution_time_ms: 0,
    status: isError ? "error" : "ok",
  };
}

async function runViaJudge0(language: ResolvedLanguage, code: string, stdin: string): Promise<RunResult> {
  const languageId = getJudge0LanguageId(language);
  if (!languageId) {
    throw new Error(
      `Judge0 is enabled, but no language mapping was configured for "${language.slug}".`
    );
  }

  const endpoint = `${process.env.JUDGE0_URL?.trim() || DEFAULT_JUDGE0_URL}/submissions?base64_encoded=false&wait=true`;
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  const apiKey = process.env.JUDGE0_API_KEY?.trim();
  const rapidApiHost = process.env.JUDGE0_RAPIDAPI_HOST?.trim();
  if (apiKey) headers.set("X-RapidAPI-Key", apiKey);
  if (rapidApiHost) headers.set("X-RapidAPI-Host", rapidApiHost);

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      language_id: languageId,
      source_code: code,
      stdin,
      cpu_time_limit: Number(process.env.JUDGE0_CPU_TIME_LIMIT_SECONDS ?? 2),
      memory_limit: Number(process.env.JUDGE0_MEMORY_LIMIT_KB ?? 262144),
    }),
  });

  if (!response.ok) {
    throw new Error(`Judge0 request failed with ${response.status}`);
  }

  const payload = (await response.json()) as {
    stdout?: string | null;
    stderr?: string | null;
    compile_output?: string | null;
    message?: string | null;
    time?: string | number | null;
    status?: { id?: number; description?: string };
  };
  const stderr = [
    payload.stderr,
    payload.compile_output,
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");
  const executionTimeMs =
    payload.time == null ? 0 : Math.round(Number(payload.time) * 1000);
  const statusId = payload.status?.id ?? 0;

  return {
    stdout: payload.stdout ?? "",
    stderr,
    execution_time_ms: Number.isFinite(executionTimeMs) ? executionTimeMs : 0,
    status: statusId === 3 ? "ok" : "error",
  };
}

executeRouter.post("/run", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = runBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const language = await resolveLanguage(parsed.data.language_id);
    if (!language) {
      res.status(400).json({ error: "Unknown language_id" });
      return;
    }

    const provider = getExecutionProvider();
    const result =
      provider === "judge0"
        ? await runViaJudge0(language, parsed.data.code, parsed.data.custom_input)
        : await runViaPiston(language, parsed.data.code, parsed.data.custom_input);

    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Code execution failed";
    res.status(502).json({ error: message });
  }
});

const submitBody = z.object({
  code: z.string(),
  language_id: z.string().min(1),
  question_id: z.string().min(1),
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
