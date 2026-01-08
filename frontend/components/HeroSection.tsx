"use client";

import Link from "next/link";
import Hero3D from "./Hero3D";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950"
    >
      {/* 3D Animated Background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Hero3D />
      </div>

      {/* Background glow */}
      <div className="absolute z-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Overlay gradient for readability - less opaque to show 3D background */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-neutral-950/40 via-neutral-950/20 to-neutral-950/60" />

      {/* Hero Content */}
      <div className="relative mx-auto max-w-6xl px-6 py-32 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Practice DSA <br />
          <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            Like Real Engineers
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
          Solve interview-grade coding problems, visualize execution in 3D,
          and prepare with confidence. Level up your coding skills professionally.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link
            href="/signup"
            className="rounded-lg bg-emerald-500 px-8 py-3 font-semibold text-black transition hover:bg-emerald-400"
          >
            Start Coding Free
          </Link>

          <Link
            href="/login"
            className="rounded-lg border border-neutral-700 px-8 py-3 text-neutral-300 transition hover:border-emerald-400 hover:text-white"
          >
            Get Started
          </Link>

          <button
            onClick={() =>
              document.getElementById("features")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="rounded-lg border border-neutral-700 px-8 py-3 text-neutral-300 transition hover:border-emerald-400 hover:text-white"
          >
            Explore Platform
          </button>
        </div>
      </div>
    </section>
  );
}
