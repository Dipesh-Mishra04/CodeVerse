"use client";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative mx-auto max-w-7xl px-6 py-32"
    >
      <div className="grid gap-16 md:grid-cols-2 items-center">
        
        {/* ================= LEFT : CONTACT FORM ================= */}
        <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8 backdrop-blur-xl">
          <h2 className="text-3xl font-bold">
            Get in{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>

          <p className="mt-3 text-neutral-400">
            Have feedback?  
            We’d love to hear from you.
          </p>

          {/* 🔥 Formspree Connected Form */}
          <form
            className="mt-8 space-y-6"
            action="https://formspree.io/f/xrebnyro"
            method="POST"
          >
            {/* Name */}
            <div>
              <label className="text-sm text-neutral-400">Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your full name"
                className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-200 outline-none focus:border-emerald-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-neutral-400">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-200 outline-none focus:border-emerald-400"
              />
            </div>

            {/* Feedback */}
            <div>
              <label className="text-sm text-neutral-400">Feedback</label>
              <textarea
                rows={4}
                name="message"
                required
                placeholder="Share your thoughts..."
                className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-200 outline-none focus:border-emerald-400"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Submit Feedback
            </button>
          </form>
        </div>

        {/* ================= RIGHT : FUTURISTIC HUMAN AVATAR ================= */}
        <div className="relative hidden md:flex h-[520px] items-center justify-center">
          <div className="absolute h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-emerald-500/30 to-green-400/20 blur-3xl animate-pulse" />
          <div className="absolute h-[320px] w-[320px] rounded-full border border-emerald-400/30 animate-spin-slow" />
          <div className="absolute h-[260px] w-[260px] rounded-full border border-emerald-400/20 animate-spin-reverse" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-900 border border-emerald-400/40 shadow-[0_0_40px_rgba(52,211,153,0.35)]" />
            <div className="mt-1 h-4 w-8 rounded bg-neutral-700" />
            <div className="mt-2 h-64 w-48 rounded-3xl bg-gradient-to-b from-neutral-800 to-neutral-950 border border-emerald-400/30 shadow-[0_0_60px_rgba(16,185,129,0.25)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
