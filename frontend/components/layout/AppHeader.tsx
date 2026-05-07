"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboard, listQuestions } from "@/lib/api";
import { getUser, getUserName, signOut } from "@/lib/auth";
import { cn, formatRelativeTime } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/problems", label: "Problems" },
  { href: "/tutor", label: "Tutor" },
  { href: "/analytics", label: "Analytics" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/settings", label: "Settings" },
];

const READ_NOTIFICATIONS_KEY = "cv_read_notifications";
const SEEN_PROBLEMS_KEY = "cv_seen_problem_slugs";

type HeaderNotification = {
  id: string;
  title: string;
  body: string;
  href: string;
  timeLabel?: string;
};

function readStoredArray(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(
    () => (typeof window === "undefined" ? [] : readStoredArray(READ_NOTIFICATIONS_KEY))
  );
  const [seenProblemSlugs, setSeenProblemSlugs] = useState<string[]>(
    () => (typeof window === "undefined" ? [] : readStoredArray(SEEN_PROBLEMS_KEY))
  );
  const profileRef = useRef<HTMLDivElement | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 60_000,
  });
  const problemsQuery = useQuery({
    queryKey: ["header-problems"],
    queryFn: () => listQuestions({ page: 1, pageSize: 12 }),
    staleTime: 60_000,
  });

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      if (!user) {
        setUsername("");
        setEmail("");
        return;
      }

      const resolvedName =
        (await getUserName()) || user.email?.split("@")[0] || "Coder";
      setUsername(resolvedName);
      setEmail(user.email || "");
    };

    void loadUser();
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setProfileOpen(false);
    router.push("/login");
  };

  const markNotificationsRead = (ids: string[]) => {
    if (!ids.length) return;
    setReadNotificationIds((current) => {
      const next = Array.from(new Set([...current, ...ids]));
      window.localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const profileInitial = username.trim().charAt(0).toUpperCase();
  const currentProblemSlugs = useMemo(
    () => problemsQuery.data?.items.map((item) => item.slug) ?? [],
    [problemsQuery.data]
  );
  const hasProblemSnapshot = seenProblemSlugs.length > 0;
  const unseenProblemSlugs = useMemo(
    () =>
      hasProblemSnapshot
        ? currentProblemSlugs.filter((slug) => !seenProblemSlugs.includes(slug))
        : [],
    [currentProblemSlugs, hasProblemSnapshot, seenProblemSlugs]
  );

  const syncCurrentProblemsAsSeen = () => {
    if (!currentProblemSlugs.length) return;
    const merged = Array.from(new Set([...currentProblemSlugs, ...seenProblemSlugs])).slice(0, 50);
    window.localStorage.setItem(SEEN_PROBLEMS_KEY, JSON.stringify(merged));
    setSeenProblemSlugs(merged);
  };

  const notifications = useMemo<HeaderNotification[]>(() => {
    const next: HeaderNotification[] = [];
    const dashboard = dashboardQuery.data;

    if (unseenProblemSlugs.length > 0) {
      const latestNewProblem = problemsQuery.data?.items.find((item) => item.slug === unseenProblemSlugs[0]);
      next.push({
        id: `new-problems:${unseenProblemSlugs.join(",")}`,
        title: `${unseenProblemSlugs.length} new ${unseenProblemSlugs.length === 1 ? "problem" : "problems"} added`,
        body: latestNewProblem
          ? `${latestNewProblem.title} is now live. Review the latest additions in the problem set.`
          : "Fresh problems are available in the catalog.",
        href: "/problems",
        timeLabel: "Just now",
      });
    }

    if (dashboard) {
      if (dashboard.goal_progress < dashboard.goal_daily) {
        const remaining = dashboard.goal_daily - dashboard.goal_progress;
        next.push({
          id: `daily-goal:${remaining}:${dashboard.goal_progress}`,
          title: "Daily goal pending",
          body: `You are ${remaining} ${remaining === 1 ? "problem" : "problems"} away from today's target.`,
          href: "/dashboard",
        });
      }

      if (dashboard.current_streak > 0 && dashboard.goal_progress === 0) {
        next.push({
          id: `streak-risk:${dashboard.current_streak}`,
          title: "Keep your streak alive",
          body: `Your ${dashboard.current_streak}-day streak needs activity today.`,
          href: "/problems",
        });
      }

      if (dashboard.weakness_topics[0]) {
        const weakTopic = dashboard.weakness_topics[0];
        next.push({
          id: `weak-topic:${weakTopic.slug}:${weakTopic.accuracy}`,
          title: `Practice ${weakTopic.name}`,
          body: `Accuracy is ${weakTopic.accuracy}%. This topic needs attention.`,
          href: `/problems?topics=${weakTopic.slug}`,
        });
      }

      if (dashboard.recommended[0]) {
        const recommended = dashboard.recommended[0];
        next.push({
          id: `recommended:${recommended.id}`,
          title: "Recommended next problem",
          body: `${recommended.title} matches your current practice needs.`,
          href: `/problems/${recommended.slug}`,
        });
      }

      const latestSubmission = dashboard.recent_submissions[0];
      if (latestSubmission && latestSubmission.status !== "accepted") {
        next.push({
          id: `submission:${latestSubmission.id}`,
          title: "Recent submission needs review",
          body: `${latestSubmission.question_title} ended with ${latestSubmission.status.replaceAll("_", " ")}.`,
          href: `/problems/${latestSubmission.question_slug}`,
          timeLabel: formatRelativeTime(latestSubmission.submitted_at),
        });
      }
    }

    return next;
  }, [dashboardQuery.data, problemsQuery.data, unseenProblemSlugs]);
  const unreadNotifications = notifications.filter(
    (notification) => !readNotificationIds.includes(notification.id)
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cv-border)] bg-[var(--cv-bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-lg font-bold tracking-tight text-[var(--cv-accent)]"
          >
            CodeVerse
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === l.href || pathname.startsWith(l.href + "/")
                    ? "bg-white/5 text-[var(--cv-text-primary)]"
                    : "text-[var(--cv-text-secondary)] hover:text-[var(--cv-text-primary)]"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => {
                if (!hasProblemSnapshot || unseenProblemSlugs.length) {
                  syncCurrentProblemsAsSeen();
                }
                setNotificationsOpen((current) => !current);
              }}
              className="relative inline-flex rounded-full border border-[var(--cv-border)] p-2 text-[var(--cv-text-muted)] hover:bg-white/5 hover:text-[var(--cv-text-primary)]"
              aria-label="Open notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications.length ? (
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[var(--cv-accent)] px-1.5 text-center text-[10px] font-semibold leading-5 text-[#0d1117]">
                  {unreadNotifications.length > 9 ? "9+" : unreadNotifications.length}
                </span>
              ) : null}
            </button>
            {notificationsOpen ? (
              <div className="absolute right-0 top-12 z-50 w-[22rem] max-w-[calc(100vw-2rem)] rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-2 shadow-2xl">
                <div className="flex items-center justify-between gap-3 px-3 py-2">
                  <div>
                    <div className="text-sm font-semibold text-[var(--cv-text-primary)]">
                      Notifications
                    </div>
                    <div className="text-xs text-[var(--cv-text-muted)]">
                      {unreadNotifications.length} unread
                    </div>
                  </div>
                  {unreadNotifications.length ? (
                    <button
                      type="button"
                      onClick={() => markNotificationsRead(unreadNotifications.map((item) => item.id))}
                      className="text-xs font-medium text-[var(--cv-accent)] hover:underline"
                    >
                      Mark all read
                    </button>
                  ) : null}
                </div>
                <div className="mt-1 max-h-96 space-y-1 overflow-y-auto">
                  {notifications.length ? (
                    notifications.map((notification) => {
                      const unread = !readNotificationIds.includes(notification.id);
                      return (
                        <Link
                          key={notification.id}
                          href={notification.href}
                          onClick={() => {
                            markNotificationsRead([notification.id]);
                            setNotificationsOpen(false);
                          }}
                          className="block rounded-lg px-3 py-3 hover:bg-white/5"
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={cn(
                                "mt-1 h-2.5 w-2.5 rounded-full",
                                unread ? "bg-[var(--cv-accent)]" : "bg-[var(--cv-border)]"
                              )}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-[var(--cv-text-primary)]">
                                  {notification.title}
                                </p>
                                {notification.timeLabel ? (
                                  <span className="shrink-0 text-[11px] text-[var(--cv-text-muted)]">
                                    {notification.timeLabel}
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-1 text-xs leading-5 text-[var(--cv-text-secondary)]">
                                {notification.body}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="px-3 py-6 text-sm text-[var(--cv-text-muted)]">
                      No notifications right now.
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          {username ? (
            <div className="relative hidden md:block" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--cv-border)] bg-[var(--cv-surface)] text-sm font-semibold text-[var(--cv-text-primary)] hover:bg-white/5"
                aria-label="Open profile menu"
              >
                {profileInitial}
              </button>
              {profileOpen ? (
                <div className="absolute right-0 top-12 w-56 rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-2 shadow-2xl">
                  <div className="rounded-lg px-3 py-2">
                    <div className="text-sm font-semibold text-[var(--cv-text-primary)]">
                      {username}
                    </div>
                    {email ? (
                      <div className="mt-0.5 truncate text-xs text-[var(--cv-text-muted)]">
                        {email}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleSignOut()}
                    className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--cv-text-primary)] hover:bg-white/5"
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
          <Link
            href="/problems"
            className="hidden rounded-md bg-[var(--cv-accent)] px-3 py-2 text-sm font-semibold text-[#0d1117] hover:bg-[var(--cv-accent-hover)] md:inline-block"
          >
            Practice
          </Link>
          <button
            type="button"
            className="inline-flex rounded-md border border-[var(--cv-border)] p-2 text-[var(--cv-text-primary)] md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-[var(--cv-border)] bg-[var(--cv-bg)] px-4 py-3 md:hidden">
        <div className="flex flex-col gap-1">
          {username ? (
            <div className="mb-2 rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] px-3 py-3 text-sm text-[var(--cv-text-secondary)]">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--cv-border)] bg-white/5 text-sm font-semibold text-[var(--cv-text-primary)]">
                  {profileInitial}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-[var(--cv-text-primary)]">
                    {username}
                  </div>
                  {email ? (
                    <div className="truncate text-xs text-[var(--cv-text-muted)]">
                      {email}
                    </div>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="mt-3 rounded-md bg-white/5 px-3 py-2 text-sm font-semibold text-[var(--cv-text-primary)] hover:bg-white/10"
              >
                Sign out
              </button>
            </div>
          ) : null}
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-[var(--cv-text-secondary)] hover:bg-white/5 hover:text-[var(--cv-text-primary)]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/problems"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-[var(--cv-accent)] px-3 py-2 text-center text-sm font-semibold text-[#0d1117]"
            >
              Practice
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
