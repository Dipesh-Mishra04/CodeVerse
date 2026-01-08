"use client";

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative mx-auto max-w-7xl px-6 py-32"
    >
      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Built for{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            Serious Coders
          </span>
        </h2>
        <p className="mt-4 text-neutral-400 text-lg">
          Everything you need to practice, analyze, and master Data Structures
          & Algorithms — designed like real interview platforms.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <div
            key={i}
            className="group relative rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur transition hover:border-emerald-400"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition group-hover:opacity-100 bg-emerald-500/10" />

            <h3 className="text-lg font-semibold text-emerald-400">
              {f.title}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= DATA ================= */

const features = [
  {
    title: "Curated DSA Problems",
    desc: "Topic-wise and difficulty-based problems inspired by real FAANG and product-company interviews.",
  },
  {
    title: "Online Code Compiler",
    desc: "Run solutions against visible and hidden test cases with instant feedback and verdicts.",
  },
  {
    title: "3D Code Visualization",
    desc: "Understand how your algorithm executes internally using animated trees, stacks, and graphs.",
  },
  {
    title: "Submission History",
    desc: "Every attempt is saved with runtime, memory usage, and optimization insights.",
  },
  {
    title: "Google Authentication",
    desc: "Secure sign-in using Supabase OAuth with industry-standard authentication flow.",
  },
  {
    title: "Interview-Ready Platform",
    desc: "Designed to simulate real interview environments and coding assessments.",
  },
];
