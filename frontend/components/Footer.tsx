"use client";

import Link from "next/link";

export default function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* MAIN FOOTER CONTENT */}
        <div className="grid gap-10 md:grid-cols-3">

          {/* LEFT : BRAND */}
          <div>
            <h2 className="text-2xl font-bold text-emerald-400">
              CodeVerse
            </h2>
            <p className="mt-4 max-w-sm text-sm text-neutral-400 leading-relaxed">
              A modern coding platform built for developers to create,
              experiment, and scale ideas with confidence.
            </p>
          </div>

          {/* CENTER : NAV LINKS */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wide">
              Explore
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-neutral-400">
              <li>
                <button
                  onClick={() => scrollTo("features")}
                  className="hover:text-white transition"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("how")}
                  className="hover:text-white transition"
                >
                  How it Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("contact")}
                  className="hover:text-white transition"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* RIGHT : CTA */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wide">
              Get Started
            </h3>

            <p className="mt-4 text-sm text-neutral-400">
              Ready to begin your journey with CodeVerse?
            </p>

            <Link
              href="/signup"
              className="mt-6 inline-block rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
            >
              Let’s Start
            </Link>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="mt-14 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-500">
          © 2026 CodeVerse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
