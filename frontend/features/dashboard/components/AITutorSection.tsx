'use client';

import { useState } from "react";

export default function AITutorSection() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askTutor = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/tutor/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, level: "intermediate" }),
      });

      if (!res.ok) {
        throw new Error("Unable to reach AI tutor right now.");
      }

      const data = (await res.json()) as { answer: string; follow_up?: string };
      const followUp = data.follow_up ? `\n\nFollow-up: ${data.follow_up}` : "";
      setResponse(`${data.answer}${followUp}`);
    } catch {
      setResponse(
        "Tutor backend is not running yet. Start Flask server in /backend and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 backdrop-blur-xl">
      <h2 className="text-xl font-bold text-white">AI Tutor</h2>
      <p className="mt-1 text-sm text-neutral-400">
        Ask doubts, request hints, and improve your problem-solving approach.
      </p>

      <div className="mt-4 space-y-3">
        <textarea
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Example: How should I optimize two sum from O(n^2) to O(n)?"
          className="w-full rounded-lg border border-white/10 bg-neutral-800/80 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500/40 focus:outline-none"
        />
        <button
          onClick={askTutor}
          disabled={loading}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Thinking..." : "Ask Tutor"}
        </button>
      </div>

      {response ? (
        <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-white/10 bg-neutral-800/60 p-4 text-sm text-neutral-100">
          {response}
        </pre>
      ) : null}
    </section>
  );
}
