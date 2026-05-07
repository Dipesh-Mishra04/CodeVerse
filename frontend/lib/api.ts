import type {
  DashboardStats,
  LeaderboardEntry,
  QuestionDetail,
  QuestionSummary,
  Topic,
  TutorMessage,
  TutorSession,
} from "@/types";
import { supabase } from "./supabaseClient";

/** Same-origin `/api/*` (Next rewrite → backend) or absolute `NEXT_PUBLIC_API_URL`. */
function apiUrl(path: string): string {
  const origin = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  if (origin) return `${origin}${path}`;
  return path;
}

type ApiFetchInit = RequestInit & { auth?: boolean };

async function apiFetch(path: string, init?: ApiFetchInit): Promise<Response> {
  const { auth: sendAuth = true, ...rest } = init ?? {};
  const headers = new Headers(rest.headers);
  if (sendAuth) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers.set("Authorization", `Bearer ${session.access_token}`);
    }
  }
  if (rest.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(apiUrl(path), { ...rest, headers });
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function listQuestions(params: {
  search?: string;
  topics?: string[];
  difficulties?: string[];
  status?: string;
  premium?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: QuestionSummary[]; total: number; page: number }> {
  const sp = new URLSearchParams();
  if (params.search) sp.set("search", params.search);
  if (params.topics?.length) sp.set("topics", params.topics.join(","));
  if (params.difficulties?.length)
    sp.set("difficulties", params.difficulties.join(","));
  if (params.status) sp.set("status", params.status);
  if (params.premium) sp.set("premium", params.premium);
  if (params.page) sp.set("page", String(params.page));
  if (params.pageSize) sp.set("pageSize", String(params.pageSize));
  const res = await apiFetch(`/api/questions?${sp.toString()}`, {
    auth: true,
  });
  return parseJson(res);
}

export async function getQuestion(slug: string): Promise<QuestionDetail> {
  const res = await apiFetch(`/api/questions/${slug}`, { auth: true });
  return parseJson(res);
}

export async function listTopics(): Promise<Topic[]> {
  const res = await apiFetch(`/api/topics`, { auth: false });
  return parseJson(res);
}

export type CodingLanguageRow = {
  id: string;
  name: string;
  slug: string;
  version: string;
  template_code: string;
  file_extension: string;
};

export async function listLanguages(): Promise<CodingLanguageRow[]> {
  const res = await apiFetch(`/api/languages`, { auth: false });
  return parseJson(res);
}

export async function getDashboard(): Promise<DashboardStats> {
  const res = await apiFetch(`/api/analytics/dashboard`, { auth: true });
  return parseJson(res);
}

export async function getAnalyticsProgress(range: string): Promise<{
  dates: string[];
  solved: number[];
  submissions: number[];
}> {
  const res = await apiFetch(
    `/api/analytics/progress?range=${encodeURIComponent(range)}`,
    { auth: true }
  );
  return parseJson(res);
}

export async function getAnalyticsTopics(): Promise<
  { topic: string; easy: number; medium: number; hard: number }[]
> {
  const res = await apiFetch(`/api/analytics/topics`, { auth: true });
  return parseJson(res);
}

export async function getLeaderboardGlobal(page: number): Promise<{
  items: LeaderboardEntry[];
  total: number;
}> {
  const res = await apiFetch(`/api/leaderboard/global?page=${page}`, {
    auth: false,
  });
  return parseJson(res);
}

export async function getLeaderboardTopic(topicId: string): Promise<{
  items: LeaderboardEntry[];
}> {
  const res = await apiFetch(`/api/leaderboard/topic/${topicId}`, {
    auth: false,
  });
  return parseJson(res);
}

export async function getLeaderboardCollege(): Promise<
  {
    rank: number;
    college: string;
    members: number;
    combined_solved: number;
    avg_accuracy: number;
  }[]
> {
  const res = await apiFetch(`/api/leaderboard/college`, { auth: false });
  return parseJson(res);
}

export async function getPublicProfile(username: string): Promise<{
  username: string;
  bio: string | null;
  college: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  solved: number;
  streak: number;
  accuracy: number;
  rank: number;
  distribution: { easy: number; medium: number; hard: number };
  topicBars: { name: string; count: number }[];
  achievements: { name: string; icon: string; earned_at: string }[];
  recent: {
    title: string;
    slug: string;
    language: string;
    status: string;
    at: string;
  }[];
}> {
  const res = await apiFetch(
    `/api/profile/${encodeURIComponent(username)}`,
    { auth: false }
  );
  return parseJson(res);
}

export async function listTutorSessions(): Promise<TutorSession[]> {
  const res = await apiFetch(`/api/tutor/sessions`, { auth: true });
  return parseJson(res);
}

export async function createTutorSession(body: {
  question_id?: string;
}): Promise<TutorSession> {
  const res = await apiFetch(`/api/tutor/sessions`, {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  });
  return parseJson(res);
}

export async function getTutorMessages(
  sessionId: string
): Promise<TutorMessage[]> {
  const res = await apiFetch(`/api/tutor/sessions/${sessionId}/messages`, {
    auth: true,
  });
  return parseJson(res);
}

export async function postTutorMessage(
  sessionId: string,
  content: string
): Promise<{ ok: boolean; reply: string }> {
  const res = await apiFetch(`/api/tutor/sessions/${sessionId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
    auth: true,
  });
  return parseJson(res);
}

export async function postRun(body: {
  code: string;
  language_id: string;
  custom_input: string;
}): Promise<{
  stdout: string;
  stderr: string;
  execution_time_ms: number;
  status: string;
  status_description: string;
  compile_output?: string;
  message?: string;
}> {
  const res = await apiFetch(`/api/execute/run`, {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  });
  return parseJson(res);
}

export async function postSubmit(body: {
  code: string;
  language_id: string;
  question_id: string;
}): Promise<{
  job_id: string;
  status?: "running" | "completed";
  verdict?:
    | "pending"
    | "running"
    | "accepted"
    | "wrong_answer"
    | "compilation_error"
    | "runtime_error";
  passed?: number;
  total?: number;
  failed_test_case?: number | null;
  message?: string | null;
}> {
  const res = await apiFetch(`/api/execute/submit`, {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  });
  return parseJson(res);
}

export async function getExecuteStatus(jobId: string): Promise<{
  status: string;
  verdict?:
    | "pending"
    | "running"
    | "accepted"
    | "wrong_answer"
    | "compilation_error"
    | "runtime_error";
  passed?: number;
  total?: number;
}> {
  const res = await apiFetch(`/api/execute/status/${jobId}`, {
    auth: true,
  });
  return parseJson(res);
}
