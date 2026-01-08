"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
    setOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">

        {/* LOGO */}
        <div
          onClick={() => scrollTo("home")}
          className="cursor-pointer text-lg font-bold text-emerald-400"
        >
          CodeVerse
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
          <button onClick={() => scrollTo("features")} className="hover:text-white">
            Features
          </button>
          <button onClick={() => scrollTo("how")} className="hover:text-white">
            How it Works
          </button>
          <button onClick={() => scrollTo("contact")} className="hover:text-white">
            Contact
          </button>
          <Link 
            href="/login"
            className="rounded-md bg-emerald-500 px-3 py-1.5 text-black font-medium hover:bg-emerald-400 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden text-neutral-300 text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950">
          <div className="flex flex-col px-4 py-4 text-sm text-neutral-300 space-y-3">
            <button onClick={() => scrollTo("features")}>Features</button>
            <button onClick={() => scrollTo("how")}>How it Works</button>
            <button onClick={() => scrollTo("contact")}>Contact</button>
            <Link 
              href="/login"
              className="rounded-md bg-emerald-500 py-2 text-black font-medium hover:bg-emerald-400 transition-colors text-center"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
