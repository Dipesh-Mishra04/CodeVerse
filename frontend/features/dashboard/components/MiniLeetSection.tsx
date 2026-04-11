'use client';

const problems = [
  { title: "Two Sum", difficulty: "Easy", topic: "Array + HashMap" },
  { title: "Valid Parentheses", difficulty: "Easy", topic: "Stack" },
  { title: "Longest Substring Without Repeating", difficulty: "Medium", topic: "Sliding Window" },
  { title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap + Linked List" },
];

export default function MiniLeetSection() {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 backdrop-blur-xl">
      <h2 className="text-xl font-bold text-white">Mini LeetCode Practice</h2>
      <p className="mt-1 text-sm text-neutral-400">
        Daily coding set curated for interviews. Start with one easy, one medium, one hard.
      </p>

      <div className="mt-5 grid gap-3">
        {problems.map((problem) => (
          <div
            key={problem.title}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-neutral-800/70 p-4"
          >
            <div>
              <p className="font-semibold text-white">{problem.title}</p>
              <p className="text-xs text-neutral-400">{problem.topic}</p>
            </div>
            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              {problem.difficulty}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
