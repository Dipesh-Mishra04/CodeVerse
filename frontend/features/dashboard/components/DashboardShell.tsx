'use client';

import { type ReactNode, useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  Bell,
  Bookmark,
  Bot,
  Brain,
  ChevronDown,
  Code2,
  Compass,
  Flame,
  LayoutDashboard,
  LogOut,
  Medal,
  MessageSquare,
  Search,
  Settings,
  Trophy,
  UserRound,
} from "lucide-react";
import { DashboardSection, emptyProfile, UserProfile } from "@/features/dashboard/types";
import ProfileForm from "@/features/dashboard/components/ProfileForm";
import MiniLeetSection from "@/features/dashboard/components/MiniLeetSection";
import AITutorSection from "@/features/dashboard/components/AITutorSection";

interface DashboardShellProps {
  user: User;
  initialProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => Promise<UserProfile>;
  onSignOut: () => Promise<void>;
}

export default function DashboardShell({
  user,
  initialProfile,
  onSaveProfile,
  onSignOut,
}: DashboardShellProps) {
  const [section, setSection] = useState<DashboardSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile ?? emptyProfile(user.id, user.email ?? "")
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const displayName = useMemo(
    () => profile.full_name || user.user_metadata?.username || "Coder",
    [profile.full_name, user.user_metadata?.username]
  );

  const saveProfile = async () => {
    setSaving(true);
    try {
      const saved = await onSaveProfile(profile);
      setProfile(saved);
      setStatusMessage("Profile updated successfully.");
    } catch {
      setStatusMessage("Could not save profile. Check Supabase table schema.");
    } finally {
      setSaving(false);
    }
  };

  const sidebarItems: Array<{ id: DashboardSection; label: string; icon: ReactNode }> = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
    { id: "problems", label: "Practice Problems", icon: <Code2 size={16} /> },
    { id: "submissions", label: "My Submissions", icon: <Trophy size={16} /> },
    { id: "ai-tutor", label: "AI Tutor", icon: <Bot size={16} /> },
    { id: "roadmap", label: "Learning Roadmap", icon: <Compass size={16} /> },
    { id: "leaderboard", label: "Leaderboard", icon: <Medal size={16} /> },
    { id: "community", label: "Community", icon: <MessageSquare size={16} /> },
    { id: "bookmarks", label: "Bookmarks", icon: <Bookmark size={16} /> },
    { id: "settings", label: "Settings", icon: <Settings size={16} /> },
    { id: "profile", label: "Profile", icon: <UserRound size={16} /> },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 px-4 py-5 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.2),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(34,211,238,0.15),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px]" />

      <div className="relative mx-auto max-w-[1400px]">
        <header className="mb-6 rounded-2xl border border-white/10 bg-neutral-900/70 px-4 py-4 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 p-2">
                  <Code2 size={18} className="text-black" />
                </div>
                <div>
                  <h1 className="text-sm font-bold uppercase tracking-widest text-cyan-300">
                    AI Coding Platform
                  </h1>
                  <p className="text-xs text-neutral-400">Developer Mode</p>
                </div>
              </div>
              <nav className="hidden items-center gap-5 text-sm text-neutral-300 lg:flex">
                <TopNavLink label="Dashboard" />
                <TopNavLink label="Problems" />
                <TopNavLink label="AI Tutor" />
                <TopNavLink label="Leaderboard" />
                <TopNavLink label="Discussions" />
                <TopNavLink label="Profile" />
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-neutral-800/80 px-3 py-2 md:flex">
                <Search size={16} className="text-neutral-500" />
                <input
                  placeholder="Search problems..."
                  className="w-52 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 outline-none"
                />
              </div>
              <button className="rounded-lg border border-white/10 bg-neutral-800/80 p-2 text-neutral-300 transition hover:border-cyan-400/50 hover:text-cyan-300">
                <Bell size={16} />
              </button>
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-neutral-800/80 px-3 py-2 text-sm transition hover:border-violet-400/50"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/30 to-violet-500/30 text-cyan-300">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline">{displayName}</span>
                  <ChevronDown size={14} className="text-neutral-400" />
                </button>
                {profileMenuOpen ? (
                  <div className="absolute right-0 z-30 mt-2 w-40 rounded-xl border border-white/10 bg-neutral-900/95 p-2 text-sm shadow-2xl backdrop-blur-xl">
                    <button
                      onClick={() => {
                        setSection("profile");
                        setProfileMenuOpen(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-neutral-200 hover:bg-neutral-800"
                    >
                      Profile
                    </button>
                    <button className="w-full rounded-md px-3 py-2 text-left text-neutral-200 hover:bg-neutral-800">
                      Settings
                    </button>
                    <button
                      onClick={onSignOut}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-rose-300 hover:bg-neutral-800"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          <aside
            className={`rounded-2xl border border-white/10 bg-neutral-900/80 p-3 backdrop-blur-xl transition-all ${
              sidebarOpen ? "w-full" : "w-[74px]"
            }`}
          >
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="mb-2 w-full rounded-lg border border-white/10 bg-neutral-800/70 px-3 py-2 text-left text-xs text-neutral-400 hover:text-neutral-200"
            >
              {sidebarOpen ? "Collapse Menu" : "Menu"}
            </button>
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all ${
                    section === item.id
                      ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-black shadow-[0_0_18px_rgba(34,211,238,0.35)]"
                      : "bg-neutral-800/70 text-neutral-200 hover:bg-neutral-800 hover:translate-x-1"
                  }`}
                >
                  {item.icon}
                  {sidebarOpen ? item.label : null}
                </button>
              ))}
            </nav>
          </aside>

          <main className="space-y-6">
            {section === "overview" && <OverviewSection displayName={displayName} />}
            {section === "profile" && (
              <ProfileForm
                profile={profile}
                onProfileChange={setProfile}
                onSave={saveProfile}
                saving={saving}
                statusMessage={statusMessage}
              />
            )}
            {section === "mini-leetcode" && <MiniLeetSection />}
            {section === "ai-tutor" && <AITutorSection />}
            {section === "problems" && <MiniLeetSection />}
            {section === "submissions" && <RecentSubmissions />}
            {section === "roadmap" && <RoadmapCard />}
            {section === "leaderboard" && <LeaderboardPreview />}
            {section === "community" && <ComingSoonCard title="Community Discussions" />}
            {section === "bookmarks" && <ComingSoonCard title="Saved Bookmarks" />}
            {section === "settings" && <ComingSoonCard title="Settings Center" />}
          </main>
        </div>
      </div>

      <TutorWidget />
    </div>
  );
}

function TopNavLink({ label }: { label: string }) {
  return (
    <button className="relative text-neutral-300 transition hover:text-cyan-300">
      {label}
      <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan-300 transition-all duration-300 group-hover:w-full" />
    </button>
  );
}

function OverviewSection({ displayName }: { displayName: string }) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-[#0d1325] via-[#12172b] to-[#16132a] p-6 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
        <p className="text-sm text-neutral-400">Welcome back, {displayName} 👋</p>
        <h2 className="mt-1 text-2xl font-bold text-white lg:text-3xl">
          Let&apos;s solve some problems today
        </h2>
        <p className="mt-2 text-sm text-neutral-300">
          Stay consistent and sharpen your interview prep with focused daily practice.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
            Continue Practice
          </button>
          <button className="rounded-lg border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20">
            Start Daily Challenge
          </button>
          <button className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20">
            Ask AI Tutor
          </button>
          <div className="ml-auto rounded-lg border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
            <Flame size={14} className="mr-1 inline" />
            21 day streak
          </div>
        </div>
      </div>

      <StatsCards />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <DailyChallenge />
        <LeaderboardPreview />
      </div>

      <RecommendedProblems />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentSubmissions />
        <ProgressVisuals />
      </div>

      <BadgesSection />

      <FooterLinks />
    </section>
  );
}

function StatsCards() {
  const cards = [
    { title: "Problems Solved", value: "384", hint: "+8 this week", color: "cyan" },
    { title: "Current Streak", value: "21 Days", hint: "Best: 31 days", color: "violet" },
    { title: "Total Submissions", value: "612", hint: "43 accepted", color: "blue" },
    { title: "Accuracy Rate", value: "91%", hint: "Top 12 percentile", color: "emerald" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="group rounded-2xl border border-white/10 bg-neutral-900/75 p-4 transition hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        >
          <p className="text-xs uppercase tracking-wider text-neutral-400">{card.title}</p>
          <p className="mt-2 text-2xl font-bold text-white">{card.value}</p>
          <p className="mt-1 text-xs text-neutral-500">{card.hint}</p>
          <div className="mt-3 h-1 rounded-full bg-neutral-800">
            <div
              className={`h-full rounded-full ${
                card.color === "cyan"
                  ? "w-4/5 bg-cyan-400"
                  : card.color === "violet"
                    ? "w-3/5 bg-violet-400"
                    : card.color === "blue"
                      ? "w-5/6 bg-blue-400"
                      : "w-11/12 bg-emerald-400"
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DailyChallenge() {
  return (
    <section className="rounded-2xl border border-violet-400/30 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Daily Coding Challenge</h3>
        <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
          Medium
        </span>
      </div>
      <h4 className="mt-3 text-xl font-semibold text-cyan-300">Longest Consecutive Sequence</h4>
      <p className="mt-2 text-sm text-neutral-300">
        Given an unsorted array, return the length of the longest consecutive elements sequence
        in O(n) time.
      </p>
      <button className="mt-4 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
        Solve Now
      </button>
    </section>
  );
}

function RecommendedProblems() {
  const problems = [
    { title: "Two Sum", level: "Easy", tags: "Array, HashMap", status: "Solved" },
    {
      title: "Binary Tree Zigzag Level Order",
      level: "Medium",
      tags: "Tree, BFS",
      status: "Attempted",
    },
    {
      title: "Median of Two Sorted Arrays",
      level: "Hard",
      tags: "Binary Search",
      status: "Unsolved",
    },
  ];

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900/80 p-6">
      <h3 className="text-lg font-bold text-white">Recommended Problems</h3>
      <div className="mt-4 space-y-3">
        {problems.map((problem) => (
          <div
            key={problem.title}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-neutral-800/60 p-3"
          >
            <div>
              <p className="font-semibold text-white">{problem.title}</p>
              <p className="text-xs text-neutral-400">{problem.tags}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                {problem.level}
              </span>
              <span className="rounded-full border border-white/10 bg-neutral-700 px-3 py-1 text-xs text-neutral-200">
                {problem.status}
              </span>
              <button className="rounded-md border border-violet-400/40 px-3 py-1 text-xs text-violet-300 transition hover:bg-violet-500/20">
                Solve
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentSubmissions() {
  const rows = [
    ["Two Sum", "TypeScript", "Accepted", "92ms", "2026-04-09"],
    ["Merge Intervals", "Python", "Wrong Answer", "N/A", "2026-04-08"],
    ["LRU Cache", "Java", "TLE", "N/A", "2026-04-08"],
    ["Valid Parentheses", "C++", "Accepted", "1ms", "2026-04-07"],
  ];

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900/80 p-6">
      <h3 className="text-lg font-bold text-white">Recent Submissions</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-neutral-400">
            <tr className="border-b border-white/10">
              <th className="px-2 py-2">Problem Name</th>
              <th className="px-2 py-2">Language</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Runtime</th>
              <th className="px-2 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-white/5 text-neutral-200">
                <td className="px-2 py-3">{row[0]}</td>
                <td className="px-2 py-3">{row[1]}</td>
                <td
                  className={`px-2 py-3 ${
                    row[2] === "Accepted"
                      ? "text-emerald-300"
                      : row[2] === "Wrong Answer"
                        ? "text-rose-300"
                        : "text-amber-300"
                  }`}
                >
                  {row[2]}
                </td>
                <td className="px-2 py-3">{row[3]}</td>
                <td className="px-2 py-3">{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProgressVisuals() {
  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-neutral-900/80 p-6">
      <h3 className="text-lg font-bold text-white">Progress Visualization</h3>

      <div className="rounded-xl border border-white/10 bg-neutral-800/70 p-4">
        <p className="text-sm text-neutral-300">Problems solved by difficulty</p>
        <Bar label="Easy" value={72} color="bg-cyan-400" />
        <Bar label="Medium" value={51} color="bg-violet-400" />
        <Bar label="Hard" value={23} color="bg-blue-400" />
      </div>

      <div className="rounded-xl border border-white/10 bg-neutral-800/70 p-4">
        <p className="text-sm text-neutral-300">Weekly activity heatmap</p>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {Array.from({ length: 49 }, (_, i) => (
            <div
              key={i}
              className={`h-4 rounded ${
                i % 7 === 0
                  ? "bg-cyan-500/80"
                  : i % 5 === 0
                    ? "bg-violet-500/70"
                    : i % 3 === 0
                      ? "bg-blue-500/60"
                      : "bg-neutral-700"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-neutral-800/70 p-4">
        <p className="text-sm text-neutral-300">Learning Progress</p>
        <div className="mt-2 h-2 rounded-full bg-neutral-700">
          <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
        </div>
        <p className="mt-2 text-xs text-neutral-400">68% roadmap completed</p>
      </div>
    </section>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mt-3">
      <div className="mb-1 flex justify-between text-xs text-neutral-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-neutral-700">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function BadgesSection() {
  const badges = [
    { title: "First Problem Solved", icon: "🎯" },
    { title: "7 Day Streak", icon: "🔥" },
    { title: "50 Problems Solved", icon: "⚡" },
    { title: "Speed Coder", icon: "🚀" },
  ];

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900/80 p-6">
      <h3 className="text-lg font-bold text-white">Badges Earned</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => (
          <div
            key={badge.title}
            className="rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 p-4 text-center transition hover:-translate-y-1"
          >
            <p className="text-2xl">{badge.icon}</p>
            <p className="mt-2 text-sm font-semibold text-neutral-100">{badge.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LeaderboardPreview() {
  const board = [
    ["1", "Aarav", "1260", "42"],
    ["2", "Dipesh", "1210", "39"],
    ["3", "Aisha", "1175", "36"],
    ["4", "Rohan", "1102", "34"],
  ];

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900/80 p-6">
      <h3 className="text-lg font-bold text-white">Top Coders This Week</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-neutral-400">
            <tr className="border-b border-white/10">
              <th className="px-2 py-2">Rank</th>
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Points</th>
              <th className="px-2 py-2">Solved</th>
            </tr>
          </thead>
          <tbody>
            {board.map((row) => (
              <tr key={row[0]} className="border-b border-white/5 text-neutral-200">
                <td className="px-2 py-2">{row[0]}</td>
                <td className="px-2 py-2">{row[1]}</td>
                <td className="px-2 py-2">{row[2]}</td>
                <td className="px-2 py-2">{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RoadmapCard() {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900/80 p-6">
      <h3 className="text-lg font-bold text-white">Learning Roadmap</h3>
      <p className="mt-2 text-sm text-neutral-300">
        Array &rarr; Hashing &rarr; Sliding Window &rarr; Trees &rarr; Graphs &rarr; DP
      </p>
      <div className="mt-4 space-y-2 text-sm text-neutral-300">
        <p>✅ Arrays & Hashing</p>
        <p>✅ Two Pointers</p>
        <p>🟡 Trees and BST</p>
        <p>⚪ Dynamic Programming</p>
      </div>
    </section>
  );
}

function ComingSoonCard({ title }: { title: string }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900/80 p-6">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-neutral-300">
        This section is ready for backend integration and advanced interactions.
      </p>
    </section>
  );
}

function TutorWidget() {
  const [message, setMessage] = useState("");
  const prompts = ["Explain this problem", "Give me a hint", "Optimize my code"];

  return (
    <div className="fixed bottom-5 right-5 z-40 w-[320px] rounded-2xl border border-cyan-400/30 bg-neutral-900/90 p-4 shadow-2xl backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-lg bg-cyan-500/20 p-2 text-cyan-300">
          <Brain size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">AI Tutor</p>
          <p className="text-xs text-neutral-400">Ask doubts instantly</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => setMessage(prompt)}
            className="rounded-full border border-white/10 bg-neutral-800 px-2 py-1 text-xs text-neutral-300 hover:border-cyan-400/40"
          >
            {prompt}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything..."
          className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none"
        />
        <button className="rounded-lg bg-cyan-400 px-3 text-sm font-semibold text-black">Send</button>
      </div>
    </div>
  );
}

function FooterLinks() {
  const links = ["About", "Contact", "Privacy", "GitHub", "Documentation"];
  return (
    <footer className="rounded-2xl border border-white/10 bg-neutral-900/70 px-5 py-4">
      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
        {links.map((link) => (
          <button key={link} className="transition hover:text-cyan-300">
            {link}
          </button>
        ))}
      </div>
    </footer>
  );
}
