"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2, MessageSquarePlus, Send, Settings } from "lucide-react";
import toast from "react-hot-toast";
import {
  createTutorSession,
  getTutorMessages,
  listTutorSessions,
  postTutorMessage,
} from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { formatRelativeTime } from "@/lib/utils";

export function TutorPageClient() {
  const qc = useQueryClient();
  const sp = useSearchParams();
  const question = sp.get("question");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const sessionsQ = useQuery({
    queryKey: ["tutor-sessions"],
    queryFn: listTutorSessions,
  });

  const messagesQ = useQuery({
    queryKey: ["tutor-messages", sessionId],
    queryFn: () => getTutorMessages(sessionId!),
    enabled: !!sessionId,
  });

  useEffect(() => {
    if (!sessionId && sessionsQ.data?.length) {
      setSessionId(sessionsQ.data[0].id);
    }
  }, [sessionId, sessionsQ.data]);

  const send = useMutation({
    mutationFn: async () => {
      if (!sessionId) throw new Error("No session");
      return postTutorMessage(sessionId, input);
    },
    onSuccess: () => {
      setInput("");
      void qc.invalidateQueries({ queryKey: ["tutor-messages", sessionId] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const newSession = useMutation({
    mutationFn: () => createTutorSession({ question_id: question ?? undefined }),
    onSuccess: (s) => {
      setSessionId(s.id);
      void qc.invalidateQueries({ queryKey: ["tutor-sessions"] });
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesQ.data]);

  return (
    <AppShell fullWidth>
      <div className="grid min-h-[calc(100vh-8rem)] gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-4">
          <Button
            variant="primary"
            className="w-full"
            disabled={newSession.isPending}
            onClick={() => newSession.mutate()}
          >
            {newSession.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MessageSquarePlus className="mr-2 h-4 w-4" />
            )}
            New chat
          </Button>
          <div className="mt-4 space-y-2">
            {sessionsQ.data?.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSessionId(s.id)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                  sessionId === s.id
                    ? "border-[var(--cv-accent)] bg-[var(--cv-accent)]/10"
                    : "border-[var(--cv-border)] hover:border-[var(--cv-accent)]/40"
                }`}
              >
                <p className="font-medium line-clamp-2">{s.title}</p>
                <p className="text-xs text-[var(--cv-text-muted)]">
                  {s.question_title ?? "General"}{" "}
                  · {formatRelativeTime(s.updated_at)}
                </p>
              </button>
            ))}
          </div>
          <Link
            href="/settings"
            className="mt-6 flex items-center gap-2 text-sm text-[var(--cv-text-muted)] hover:text-[var(--cv-text-primary)]"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </aside>

        <section className="flex min-h-[480px] flex-col overflow-hidden rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)]">
          <header className="border-b border-[var(--cv-border)] px-4 py-3">
            <h1 className="text-lg font-semibold">AI Tutor</h1>
            <p className="text-xs text-[var(--cv-text-muted)]">
              Streaming will arrive with the Flask + Socket.io service.
            </p>
          </header>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {!sessionId && (
              <p className="text-sm text-[var(--cv-text-secondary)]">
                Create a session or pick one from the sidebar.
              </p>
            )}
            {messagesQ.isLoading && (
              <div className="flex items-center gap-2 text-sm text-[var(--cv-text-muted)]">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading messages…
              </div>
            )}
            {messagesQ.data?.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[min(720px,100%)] rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-[var(--cv-accent)] text-[#0d1117]"
                      : "bg-[var(--cv-elevated)] text-[var(--cv-text-primary)]"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <MarkdownContent content={m.content} />
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <footer className="border-t border-[var(--cv-border)] p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <Textarea
                value={input}
                maxLength={2000}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for a hint, dry run, or error help…"
                className="min-h-[88px] flex-1"
              />
              <Button
                variant="primary"
                className="sm:h-[88px] sm:w-28"
                disabled={!sessionId || !input.trim() || send.isPending}
                onClick={() => send.mutate()}
              >
                {send.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="mt-2 text-right text-xs text-[var(--cv-text-muted)]">
              {input.length}/2000 · Ctrl+Enter to send
            </p>
          </footer>
        </section>
      </div>
    </AppShell>
  );
}
