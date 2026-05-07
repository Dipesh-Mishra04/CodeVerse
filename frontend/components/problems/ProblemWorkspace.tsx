"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import {
  BookMarked,
  ChevronDown,
  Copy,
  Flag,
  Loader2,
  Redo,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getQuestion,
  getExecuteStatus,
  listLanguages,
  postRun,
  postSubmit,
} from "@/lib/api";
import { MOCK_LANGUAGES } from "@/lib/mock-data";
import { AppShell } from "@/components/layout/AppShell";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Button } from "@/components/ui/Button";
import { DifficultyBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Input";
import { useEditorPrefs } from "@/stores/editor-prefs";
import { getUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { CodingLanguage } from "@/types";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center bg-[#0d1117] text-sm text-[var(--cv-text-muted)]">
      Loading editor…
    </div>
  ),
});

type Tab = "description" | "submissions" | "editorial" | "discussion" | "tutor";

function formatRunOutput(result: {
  stdout: string;
  stderr: string;
  execution_time_ms: number;
  status: string;
  status_description: string;
  compile_output?: string;
  message?: string;
}) {
  const sections = [`Status: ${result.status_description}`];

  if (result.compile_output?.trim()) {
    sections.push(`Compiler output:\n${result.compile_output.trim()}`);
  }

  if (result.stderr.trim()) {
    sections.push(`stderr:\n${result.stderr.trim()}`);
  }

  if (result.message?.trim()) {
    sections.push(`Message:\n${result.message.trim()}`);
  }

  if (result.stdout.trim()) {
    sections.push(`stdout:\n${result.stdout.trimEnd()}`);
  } else if (
    !result.compile_output?.trim() &&
    !result.stderr.trim() &&
    !result.message?.trim()
  ) {
    sections.push("stdout:\n[no stdout]");
  }

  sections.push(`Time: ${result.execution_time_ms} ms`);
  return sections.join("\n\n");
}

function formatSubmissionOutput(result: {
  verdict?: string;
  passed?: number;
  total?: number;
  failed_test_case?: number | null;
  message?: string | null;
}) {
  const verdictLabel = (result.verdict ?? "unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  const sections = [`Verdict: ${verdictLabel}`];

  if (typeof result.passed === "number" && typeof result.total === "number") {
    sections.push(`Tests passed: ${result.passed}/${result.total}`);
  }

  if (result.failed_test_case) {
    sections.push(`Failed on test case: ${result.failed_test_case}`);
  }

  if (result.message?.trim()) {
    sections.push(result.message.trim());
  }

  return sections.join("\n\n");
}

export function ProblemWorkspace({ slug }: { slug: string }) {
  const q = useQuery({ queryKey: ["question", slug], queryFn: () => getQuestion(slug) });
  const langsQ = useQuery({ queryKey: ["languages"], queryFn: listLanguages });
  const langs: CodingLanguage[] = useMemo(() => {
    const rows = langsQ.data;
    if (!rows?.length) return MOCK_LANGUAGES;
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      version: row.version,
      template_code: row.template_code,
      file_extension: row.file_extension,
    }));
  }, [langsQ.data]);
  const [lang, setLang] = useState<CodingLanguage>(MOCK_LANGUAGES[0]);
  const [code, setCode] = useState(MOCK_LANGUAGES[0].template_code);
  const [tab, setTab] = useState<Tab>("description");
  const [customIn, setCustomIn] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const prefs = useEditorPrefs();

  useEffect(() => {
    if (!langs.length) return;
    setLang((prev) =>
      langs.some((l) => l.id === prev.id) ? prev : langs[0]
    );
  }, [langs]);

  useEffect(() => {
    setCode(lang.template_code);
  }, [lang.id, lang.template_code]);

  useEffect(() => {
    let cancelled = false;
    const loadDraft = async () => {
      const user = await getUser();
      if (!user || !q.data) return;
      const key = `draft-${user.id}-${q.data.id}-${lang.id}`;
      const raw = localStorage.getItem(key);
      if (raw && !cancelled) {
        setCode(raw);
        toast.success("Draft restored from last session.");
      }
    };
    void loadDraft();
    return () => {
      cancelled = true;
    };
  }, [q.data?.id, lang.id, q.data]);

  const persistDraft = useCallback(async () => {
    const user = await getUser();
    if (!user || !q.data) return;
    const key = `draft-${user.id}-${q.data.id}-${lang.id}`;
    localStorage.setItem(key, code);
  }, [code, q.data, lang.id]);

  useEffect(() => {
    const t = setInterval(() => {
      void persistDraft();
    }, 15000);
    return () => clearInterval(t);
  }, [persistDraft]);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setOutput(null);
    try {
      const res = await postRun({
        code,
        language_id: lang.id,
        custom_input: customIn,
      });
      setOutput(formatRunOutput(res));
      toast.success(res.status === "ok" ? "Run finished" : "Run completed with errors");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Run failed");
    } finally {
      setRunning(false);
    }
  }, [code, customIn, lang.id]);

  const handleSubmit = useCallback(async () => {
    if (!q.data) return;
    setSubmitting(true);
    setOutput(null);
    toast.loading("Judging…", { id: "sub" });
    try {
      const submission = await postSubmit({
        code,
        language_id: lang.id,
        question_id: q.data.id,
      });

      let finalStatus = submission;
      if (submission.status !== "completed") {
        for (let i = 0; i < 30; i += 1) {
          await new Promise((r) => setTimeout(r, 500));
          const st = await getExecuteStatus(submission.job_id);
          if (st.status === "completed") {
            finalStatus = st;
            break;
          }
        }
      }

      if (finalStatus.status !== "completed") {
        throw new Error("Judging timed out before a final verdict was returned.");
      }

      setOutput(formatSubmissionOutput(finalStatus));
      if (finalStatus.verdict === "accepted") {
        await q.refetch();
      }
      toast.success(
        finalStatus.verdict === "accepted"
          ? "Accepted"
          : "Submission evaluated",
        { id: "sub" }
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Submit failed", { id: "sub" });
    } finally {
      setSubmitting(false);
    }
  }, [code, lang.id, q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        void handleSubmit();
      } else if (e.key === "Enter") {
        e.preventDefault();
        void handleRun();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleRun, handleSubmit]);

  if (q.isLoading || !q.data) {
    return (
      <AppShell fullWidth>
        <div className="px-4 py-20 text-center text-[var(--cv-text-muted)]">
          Loading problem…
        </div>
      </AppShell>
    );
  }

  const problem = q.data;
  const editorialUnlocked = problem.user_solved;

  return (
    <AppShell fullWidth>
      <div className="px-2 pb-6 lg:px-4">
        <Group orientation="horizontal" className="min-h-[calc(100vh-6rem)]">
          <Panel defaultSize={45} minSize={28} className="min-h-[560px]">
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)]">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--cv-border)] p-4">
                <div>
                  <p className="text-xs text-[var(--cv-text-muted)]">
                    {problem.topic.name}
                  </p>
                  <h1 className="text-xl font-semibold tracking-tight">
                    {problem.title}
                  </h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <DifficultyBadge d={problem.difficulty} />
                    {problem.company_tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[var(--cv-border)] bg-[var(--cv-elevated)] px-2 py-0.5 text-xs text-[var(--cv-text-secondary)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setBookmark(!bookmark)}
                    className={cn(
                      "rounded-md border border-[var(--cv-border)] p-2",
                      bookmark ? "text-amber-300" : "text-[var(--cv-text-muted)]"
                    )}
                  >
                    <BookMarked className="h-4 w-4" />
                  </button>
                  <Button variant="secondary" size="sm" onClick={() => setReportOpen(true)}>
                    <Flag className="mr-1 h-4 w-4" />
                    Report
                  </Button>
                </div>
              </div>

              <div className="flex gap-1 border-b border-[var(--cv-border)] px-2 pt-2">
                {(
                  [
                    ["description", "Description"],
                    ["submissions", "Submissions"],
                    ["editorial", "Editorial"],
                    ["discussion", "Discussion"],
                    ["tutor", "AI Tutor"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={cn(
                      "rounded-t-md px-3 py-2 text-sm font-medium",
                      tab === id
                        ? "bg-[var(--cv-elevated)] text-[var(--cv-text-primary)]"
                        : "text-[var(--cv-text-muted)] hover:text-[var(--cv-text-primary)]"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {tab === "description" && (
                  <div className="space-y-6">
                    <MarkdownContent content={problem.description} />
                    {problem.constraints ? (
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--cv-text-primary)]">
                          Constraints
                        </h3>
                        <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-[var(--cv-border)] bg-[#0d1117] p-3 font-mono text-xs text-[var(--cv-text-secondary)]">
                          {problem.constraints}
                        </pre>
                      </div>
                    ) : null}
                    {problem.input_format ? (
                      <div>
                        <h3 className="text-sm font-semibold">Input format</h3>
                        <MarkdownContent content={problem.input_format} />
                      </div>
                    ) : null}
                    {problem.output_format ? (
                      <div>
                        <h3 className="text-sm font-semibold">Output format</h3>
                        <MarkdownContent content={problem.output_format} />
                      </div>
                    ) : null}
                    {problem.sample_input && problem.sample_output ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <SampleBlock label="Sample input" value={problem.sample_input} />
                        <SampleBlock label="Sample output" value={problem.sample_output} />
                      </div>
                    ) : null}
                  </div>
                )}

                {tab === "submissions" && (
                  <div className="text-sm text-[var(--cv-text-secondary)]">
                    <p>
                      Your submission history will appear here once the Node API
                      is connected to Supabase.
                    </p>
                  </div>
                )}

                {tab === "editorial" && (
                  <div>
                    {editorialUnlocked && problem.editorial ? (
                      <MarkdownContent content={problem.editorial} />
                    ) : (
                      <div className="relative rounded-lg border border-[var(--cv-border)] bg-[var(--cv-elevated)] p-8 text-center">
                        <p className="text-[var(--cv-text-secondary)]">
                          Solve the problem to unlock the editorial.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {tab === "discussion" && (
                  <p className="text-sm text-[var(--cv-text-muted)]">Coming soon.</p>
                )}

                {tab === "tutor" && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-[var(--cv-border)] bg-[var(--cv-elevated)] p-4 text-sm text-[var(--cv-text-secondary)]">
                      <div className="flex items-center gap-2 text-[var(--cv-text-primary)]">
                        <Sparkles className="h-4 w-4 text-[var(--cv-accent)]" />
                        Embedded tutor
                      </div>
                      <p className="mt-2">
                        Open the full tutor for streaming hints and context
                        about this problem.
                      </p>
                      <Button variant="primary" size="sm" className="mt-3" asChild>
                        <Link href={`/tutor?question=${slug}`}>Open full tutor</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <Separator className="mx-1 hidden w-2 items-center justify-center md:flex">
            <div className="h-24 w-1 rounded-full bg-[var(--cv-border)]" />
          </Separator>

          <Panel defaultSize={55} minSize={35}>
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)]">
              <div className="flex flex-wrap items-center gap-2 border-b border-[var(--cv-border)] p-3">
                <div className="relative">
                  <select
                    value={lang.id}
                    onChange={(e) => {
                      const next = langs.find((l) => l.id === e.target.value);
                      if (next) setLang(next);
                    }}
                    className="h-9 appearance-none rounded-md border border-[var(--cv-border)] bg-[var(--cv-elevated)] px-3 pr-8 text-sm"
                  >
                    {langs.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.version})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--cv-text-muted)]" />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCode(lang.template_code)}
                >
                  Load template
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm("Reset your code? This cannot be undone.")) {
                      setCode(lang.template_code);
                    }
                  }}
                >
                  <Redo className="mr-1 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    void navigator.clipboard.writeText(code);
                    toast.success("Copied");
                  }}
                >
                  <Copy className="mr-1 h-4 w-4" />
                  Copy
                </Button>
                <div className="ml-auto flex items-center gap-1 text-xs text-[var(--cv-text-muted)]">
                  <button
                    type="button"
                    className="rounded border border-[var(--cv-border)] px-2 py-1"
                    onClick={() => prefs.setFontSize(prefs.fontSize - 1)}
                  >
                    A−
                  </button>
                  <button
                    type="button"
                    className="rounded border border-[var(--cv-border)] px-2 py-1"
                    onClick={() => prefs.setFontSize(prefs.fontSize + 1)}
                  >
                    A+
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1">
                <MonacoEditor
                  height="420px"
                  language={
                    lang.slug === "cpp"
                      ? "cpp"
                      : lang.slug === "python"
                        ? "python"
                        : lang.slug === "javascript"
                          ? "javascript"
                          : lang.slug === "java"
                            ? "java"
                            : lang.slug === "go"
                              ? "go"
                              : "c"
                  }
                  theme={prefs.theme}
                  value={code}
                  onChange={(v) => setCode(v ?? "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: prefs.fontSize,
                    tabSize: prefs.tabSize,
                    wordWrap: "off",
                    fontFamily: "var(--font-mono), ui-monospace, monospace",
                    bracketPairColorization: { enabled: true },
                    lineNumbers: "on",
                  }}
                />
              </div>

              <details className="border-t border-[var(--cv-border)] bg-[var(--cv-elevated)] p-3">
                <summary className="cursor-pointer text-sm font-medium">
                  Custom test input
                </summary>
                <Textarea
                  value={customIn}
                  onChange={(e) => setCustomIn(e.target.value)}
                  className="mt-2 font-mono text-xs"
                  placeholder="stdin..."
                />
              </details>

              <div className="flex flex-wrap gap-2 border-t border-[var(--cv-border)] p-3">
                <Button
                  variant="secondary"
                  disabled={running || submitting}
                  onClick={() => void handleRun()}
                >
                  {running ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Run
                  <span className="ml-2 hidden text-xs text-[var(--cv-text-muted)] sm:inline">
                    ⌃↵
                  </span>
                </Button>
                <Button
                  variant="primary"
                  disabled={running || submitting}
                  onClick={() => void handleSubmit()}
                >
                  {submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Submit
                  <span className="ml-2 hidden text-xs text-[#0d1117]/70 sm:inline">
                    ⌃⇧↵
                  </span>
                </Button>
              </div>

              {output ? (
                <pre className="max-h-48 overflow-auto border-t border-[var(--cv-border)] bg-[#0d1117] p-3 font-mono text-xs text-[var(--cv-text-primary)]">
                  {output}
                </pre>
              ) : null}
            </div>
          </Panel>
        </Group>
      </div>

      <Modal open={reportOpen} onClose={() => setReportOpen(false)} title="Report problem">
        <p className="text-sm text-[var(--cv-text-secondary)]">
          Reports are submitted to moderators once the backend route is wired.
        </p>
        <Textarea className="mt-3" placeholder="Describe the issue…" />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setReportOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              toast.success("Report queued (stub)");
              setReportOpen(false);
            }}
          >
            Submit
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
}

function SampleBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--cv-border)] bg-[var(--cv-elevated)] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--cv-text-muted)]">
          {label}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            void navigator.clipboard.writeText(value);
            toast.success("Copied");
          }}
        >
          Copy
        </Button>
      </div>
      <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-[var(--cv-text-secondary)]">
        {value}
      </pre>
    </div>
  );
}
