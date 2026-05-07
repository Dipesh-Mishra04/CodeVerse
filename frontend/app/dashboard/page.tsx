"use client";

import { useEffect, useState } from "react";
import { getUser, getUserName } from "@/lib/auth";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardHome } from "@/components/dashboard/DashboardHome";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const u = await getUser();
        if (u) {
          setUser(u);
          const userName = await getUserName();
          setUsername(userName || u.email?.split("@")[0] || "Coder");
        }
      } catch {
        router.push("/login?redirect=/dashboard");
      } finally {
        setLoading(false);
      }
    };
    void fetchUserData();
  }, [router]);

  useEffect(() => {
    const welcomeShown = localStorage.getItem("welcomeShown");
    if (!welcomeShown) {
      setShowWelcome(true);
      localStorage.setItem("welcomeShown", "true");
      const timer = setTimeout(() => setShowWelcome(false), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--cv-bg)] text-[var(--cv-text-muted)]">
        Loading dashboard…
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell>
      {showWelcome && (
        <div className="fixed left-1/2 top-6 z-[60] -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/40 bg-neutral-900/95 px-6 py-4 text-sm font-semibold text-emerald-100 shadow-2xl shadow-emerald-500/40 backdrop-blur-xl">
            <span className="inline-block h-3 w-3 animate-ping rounded-full bg-emerald-400" />
            Welcome to CodeVerse!
          </div>
        </div>
      )}
      <DashboardHome displayName={username} />
    </AppShell>
  );
}
