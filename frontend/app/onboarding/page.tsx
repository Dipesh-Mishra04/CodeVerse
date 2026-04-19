"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { listTopics } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { SkillLevel } from "@/types";

const steps = ["Profile", "Skill", "Topics", "Goal"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [college, setCollege] = useState("");
  const [bio, setBio] = useState("");
  const [skill, setSkill] = useState<SkillLevel | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [daily, setDaily] = useState(2);

  const tq = useQuery({ queryKey: ["topics"], queryFn: listTopics });

  const canNext =
    step === 0
      ? username.trim().length >= 3
      : step === 1
        ? skill !== null
        : step === 2
          ? topics.length > 0
          : true;

  const finish = () => {
    localStorage.setItem(
      "codeverse_onboarding",
      JSON.stringify({
        username,
        college,
        bio,
        skill,
        topics,
        daily,
        at: new Date().toISOString(),
      })
    );
    toast.success("Profile saved locally — Supabase sync comes with backend.");
    router.push("/dashboard");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="flex gap-2">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full ${i <= step ? "bg-[var(--cv-accent)]" : "bg-[var(--cv-border)]"}`}
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--cv-text-muted)]">
            Step {step + 1} of {steps.length}: {steps[step]}
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Welcome to CodeVerse</h1>
        </div>

        <div className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-6">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_handle"
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-[var(--cv-text-muted)]">
                  Availability check will call your API once deployed.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">College / University</label>
                <Input
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bio (optional)</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 200))}
                  maxLength={200}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-[var(--cv-text-muted)]">
                  {bio.length}/200
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  {
                    k: "beginner" as const,
                    title: "Beginner",
                    desc: "I'm just starting out",
                  },
                  {
                    k: "intermediate" as const,
                    title: "Intermediate",
                    desc: "I know basics, want to improve",
                  },
                  {
                    k: "advanced" as const,
                    title: "Advanced",
                    desc: "Interview & contests",
                  },
                ] as const
              ).map((x) => (
                <button
                  key={x.k}
                  type="button"
                  onClick={() => setSkill(x.k)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    skill === x.k
                      ? "border-[var(--cv-accent)] bg-[var(--cv-accent)]/10"
                      : "border-[var(--cv-border)] hover:border-[var(--cv-accent)]/40"
                  }`}
                >
                  <p className="font-semibold">{x.title}</p>
                  <p className="mt-2 text-sm text-[var(--cv-text-secondary)]">
                    {x.desc}
                  </p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {tq.data?.map((t) => (
                <label
                  key={t.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--cv-border)] px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={topics.includes(t.slug)}
                    onChange={() =>
                      setTopics((prev) =>
                        prev.includes(t.slug)
                          ? prev.filter((x) => x !== t.slug)
                          : [...prev, t.slug]
                      )
                    }
                  />
                  {t.name}
                </label>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2, 5, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDaily(n)}
                  className={`rounded-xl border p-4 text-left ${
                    daily === n
                      ? "border-[var(--cv-accent)] bg-[var(--cv-accent)]/10"
                      : "border-[var(--cv-border)]"
                  }`}
                >
                  <p className="font-semibold">{n} problems / day</p>
                  <p className="mt-1 text-xs text-[var(--cv-text-muted)]">
                    ~{n * 7} / week
                  </p>
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-between gap-3">
            <Button
              variant="secondary"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button
                variant="primary"
                disabled={!canNext}
                onClick={() => setStep((s) => s + 1)}
              >
                Continue
              </Button>
            ) : (
              <Button variant="primary" onClick={finish}>
                Finish
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
