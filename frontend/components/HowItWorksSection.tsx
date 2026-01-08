"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Code2,
  PlayCircle,
  CheckCircle2,
  Box,
  BarChart3,
} from "lucide-react";

const steps = [
  {
    title: "Authentication",
    desc: "Login instantly using Google OAuth with Supabase-backed enterprise security.",
    icon: Brain,
  },
  {
    title: "Problem Selection",
    desc: "Choose interview-focused DSA problems organized by topic and difficulty.",
    icon: Code2,
  },
  {
    title: "Code Execution",
    desc: "Write, run, and debug code inside a powerful browser-based compiler.",
    icon: PlayCircle,
  },
  {
    title: "Evaluation",
    desc: "Solutions are validated against hidden test cases with performance metrics.",
    icon: CheckCircle2,
  },
  {
    title: "3D Visualization",
    desc: "Understand your algorithm with animated 3D data-structure flows.",
    icon: Box,
  },
  {
    title: "Progress Tracking",
    desc: "Track submissions, accuracy, and growth over time.",
    icon: BarChart3,
  },
];

export default function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const ActiveIcon = steps[active].icon;

  return (
    <section
      id="working"
      className="mx-auto max-w-6xl px-6 py-32"
    >
      {/* Header */}
      <div className="mb-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold">
          How{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            It Works
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-400">
          A concise, interactive flow designed for serious interview preparation.
        </p>
      </div>

      {/* Main Container */}
      <div className="grid gap-10 md:grid-cols-2">
        {/* LEFT — Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = active === index;

            return (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`group flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition
                  ${
                    isActive
                      ? "border-emerald-400 bg-emerald-500/10"
                      : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-600"
                  }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition
                    ${
                      isActive
                        ? "bg-emerald-400 text-black"
                        : "bg-neutral-800 text-neutral-400 group-hover:text-white"
                    }`}
                >
                  <Icon size={20} />
                </div>

                <span
                  className={`font-medium ${
                    isActive ? "text-white" : "text-neutral-400"
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* RIGHT — Animated Content */}
        <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/50 p-10 backdrop-blur">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <ActiveIcon size={28} />
              </div>

              <h3 className="text-2xl font-semibold">
                {steps[active].title}
              </h3>

              <p className="text-neutral-400 leading-relaxed">
                {steps[active].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
