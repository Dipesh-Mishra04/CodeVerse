You are a Senior Full-Stack Engineer and Product Designer with production-level expertise in EdTech SaaS platforms, competitive programming systems, AI-integrated learning tools, and cloud-native architectures. Your task is to build CodeVerse — a complete, production-ready, AI-powered competitive coding and virtual tutor platform. Every feature must be fully implemented with real business logic, real UI states, and real data flows. No placeholder content, no mock APIs, no skeleton implementations left incomplete.

PLATFORM IDENTITY
Product Name: CodeVerse
Tagline: Practice. Learn. Grow — with AI by your side.
Category: EdTech / Competitive Programming / AI-Powered Learning
Core Positioning: A unified smart ecosystem that combines LeetCode-style DSA problem practice, a sandboxed multi-language online compiler, hidden test-case-based submission judging, a performance analytics dashboard, and an AI virtual tutor — all within a single, cohesive platform built for learners from beginner to advanced level.

TECH STACK (MANDATORY — NO SUBSTITUTIONS)
Frontend
Framework: Next.js 14 with App Router and TypeScript (strict mode)
Styling: Tailwind CSS only — no Material UI, no Chakra UI, no component libraries with pre-styled themes
Code Editor: Monaco Editor with JetBrains M
ono font, syntax highlighting per language, dark theme default
Charts and Analytics: Recharts — line charts, bar charts, radar charts, heatmap calendar
Animations: Framer Motion — page transitions, button hovers, modal entrances, tutor typing indicator
State Management: Zustand for global client state (auth, editor preferences, active session)
Server State: TanStack Query (React Query v5) for all API data fetching, caching, background refetch, and optimistic updates
Notifications: React Hot Toast — bottom-right, 4-second auto-dismiss, styled per success/error/warning
Icons: Lucide React exclusively
Resizable Panels: react-resizable-panels for split-panel problem page layout
Markdown Rendering: react-markdown with remark-gfm and rehype-highlight for code blocks in tutor chat and editorials
Backend — Layer 1 (Node.js Application Server)
Runtime: Node.js 20 LTS
Framework: Express.js with modular router structure
Language: TypeScript with strict mode
Auth Middleware: Supabase JWT verification on every protected route
Role-Based Access Control: Middleware checking user role (user / moderator / admin) from Supabase profiles table
Real-Time: Socket.io for WebSocket connections — execution status push, tutor response streaming relay
Job Queue: BullMQ with Redis for async code execution jobs — retry up to 2 times, dead letter queue for permanently failed jobs
Rate Limiting: express-rate-limit — execution endpoints: 10 requests/minute/user; tutor endpoints: 20 requests/minute/user; auth endpoints: 5 requests/minute/IP
Validation: Zod on all request bodies and query parameters
Logging: Winston with structured JSON logs, request ID tracing
Backend — Layer 2 (Flask Microservice)
Runtime: Python 3.11
Framework: Flask with Blueprint architecture
Responsibilities: Code execution orchestration, Docker container lifecycle management, test case evaluation logic, AI tutor prompt construction and OpenAI API communication, performance analysis computation
Communication: Internal REST calls from Node.js to Flask on private network — never exposed to frontend directly
AI Integration: OpenAI Python SDK — model: gpt-4o, streaming enabled via Server-Sent Events relayed through Node.js WebSocket to frontend
Code Execution Sandbox
Technology: Docker SDK for Python (inside Flask microservice)
Isolation: One ephemeral Docker container per execution job
Supported Languages: C (gcc 13), C++ (g++ 13), Java 21, Python 3.11, JavaScript (Node.js 20), Go 1.22
Resource Limits per Container: CPU: 0.5 cores, Memory: 256MB, Execution timeout: 5 seconds hard kill, PIDs: max 50
Restrictions: No network access (--network none), no file system write outside /sandbox/ working directory, no system command access, no root privileges inside container
Cleanup: Container removed immediately after execution completes or times out
Job Flow: BullMQ job created → Flask worker picks up job → Docker container spawned → code executed → output captured → result written to submission_results table → Node.js pushes result to client via Socket.io

Database and Auth
Primary Database: Supabase PostgreSQL
Authentication: Supabase Auth — email/password, Google OAuth, GitHub OAuth
Storage: Supabase Storage — profile avatars bucket, question assets bucket
Row Level Security: RLS enabled and enforced on every table with explicit policies
Caching: Redis — leaderboard cache (TTL 5 minutes), question list cache (TTL 10 minutes), user streak data (TTL 1 minute)
Infrastructure
Containerization: Docker Compose for local development (all services: Next.js, Node.js, Flask, Redis, Supabase local stack)
Reverse Proxy: Nginx — routes /api/* to Node.js, /exec/* to Flask (internal only), serves Next.js SSR
CI/CD: GitHub Actions — lint → type-check → test → build → deploy on push to main
Environment Management: .env.example files for each service, never commit real credentials
Error Tracking: Sentry integration in both Node.js and Next.js

DATABASE SCHEMA (BUILD ALL TABLES WITH RLS)
Execute the following in Supabase migrations. All tables use UUID primary keys. All timestamps are timestamptz with DEFAULT now().
-- Users managed by Supabase Auth: auth.users
-- Extended profile
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  college TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  daily_goal INTEGER DEFAULT 2,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  joined_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INTEGER
);

CREATE TABLE coding_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  version TEXT NOT NULL,
  docker_image TEXT NOT NULL,
  compile_command TEXT,
  run_command TEXT NOT NULL,
  template_code TEXT NOT NULL,
  file_extension TEXT NOT NULL
);

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  topic_id UUID REFERENCES topics(id),
  company_tags TEXT[],
  constraints TEXT,
  input_format TEXT,
  output_format TEXT,
  sample_input TEXT,
  sample_output TEXT,
  editorial TEXT,
  is_premium BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE test_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  is_hidden BOOLEAN DEFAULT true,
  weight INTEGER DEFAULT 1,
  display_order INTEGER
);

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  question_id UUID REFERENCES questions(id),
  language_id UUID REFERENCES coding_languages(id),
  code TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','running','accepted','wrong_answer','time_limit_exceeded','memory_limit_exceeded','compilation_error','runtime_error')),
  total_test_cases INTEGER,
  passed_test_cases INTEGER,
  score NUMERIC(5,2),
  submitted_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE submission_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  test_case_id UUID REFERENCES test_cases(id),
  actual_output TEXT,
  is_passed BOOLEAN,
  execution_time_ms INTEGER,
  memory_used_kb INTEGER,
  error_message TEXT
);

CREATE TABLE daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  date DATE NOT NULL,
  time_spent_minutes INTEGER DEFAULT 0,
  questions_solved INTEGER DEFAULT 0,
  submissions_made INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE
);

CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  question_id UUID REFERENCES questions(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, question_id)
);

CREATE TABLE tutor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  question_id UUID REFERENCES questions(id),
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tutor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES tutor_sessions(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  badge_name TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) UNIQUE,
  total_solved INTEGER DEFAULT 0,
  accuracy_percent NUMERIC(5,2) DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE reported_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  question_id UUID REFERENCES questions(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','resolved','dismissed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_topic_interests (
  user_id UUID REFERENCES profiles(id),
  topic_id UUID REFERENCES topics(id),
  PRIMARY KEY (user_id, topic_id)
);

Apply RLS policies: users can SELECT/INSERT/UPDATE only their own rows on profiles, submissions, bookmarks, tutor_sessions, tutor_messages, daily_activity, streaks, achievements. questions and topics are publicly readable for published records. test_cases with is_hidden = true are never readable by non-admin users. Admin role bypasses RLS via service role key used only server-side.


COMPLETE PAGE STRUCTURE
Page 1 — Landing Page /
Server-side rendered for SEO. Sections in order:
Navbar: CodeVerse logo (left), navigation links (Problems, Leaderboard, About), Sign In button, Start Free button (primary accent). Sticky with backdrop blur on scroll. Hamburger menu on mobile.
Hero Section: Full-width, dark background. Large headline: "Master DSA. Get Hired. Learn Smarter." Subtitle: "The all-in-one platform for coding practice, AI tutoring, and performance tracking." Two CTAs: "Start Practicing Free" (primary filled button) and "See How It Works" (ghost button). Right side: animated mockup of the Monaco Editor with a sample LeetCode-style problem rendered — use Framer Motion to animate line-by-line code typing effect on load. Below hero: social proof strip — "Trusted by 10,000+ learners | 50,000+ problems solved | 6 languages supported".
Features Section: 6-card grid. Each card has an icon (Lucide), bold feature name, and a 2-sentence description. Features: DSA Problem Library, Multi-Language Compiler, AI Virtual Tutor, Performance Dashboard, Test Case Judging, Daily Streak Tracker.
How It Works Section: 4-step horizontal flow with numbered icons and connecting arrows. Steps: Sign Up & Set Your Goal → Choose a Topic & Pick a Problem → Write Code & Run Instantly → Submit & Track Your Progress.
AI Tutor Showcase Section: Split layout — left: chat UI mockup showing a user asking "Give me a hint for Two Sum" and the AI responding with a structured hint. Right: feature bullets listing tutor capabilities.
Testimonials Section: 3 cards with avatar, name, college, and quote. Static content seeded.
CTA Banner: Full-width banner — "Ready to level up your coding skills?" with Start Free button.
Footer: Logo, tagline, link columns (Platform: Problems, Leaderboard, Dashboard | Company: About, Blog, Privacy, Terms | Connect: GitHub, Twitter, LinkedIn), copyright line.

Page 2 — Sign Up /auth/signup
Clean centered card layout on dark background
Fields: Full Name, Email, Password (min 8 chars, show/hide toggle), Confirm Password
Password strength indicator bar (weak / medium / strong)
Submit button: "Create Account"
Divider: "or continue with"
OAuth buttons: Google (white with Google logo), GitHub (dark with GitHub logo) — both using Supabase OAuth
Link: "Already have an account? Sign In"
On success: redirect to /onboarding
Inline validation errors below each field (red text, not toast)

Page 3 — Sign In /auth/login
Same card layout as signup
Fields: Email, Password
"Forgot Password?" link triggers Supabase password reset email
OAuth buttons same as signup
On success: redirect to /dashboard

Page 4 — Onboarding /onboarding
Multi-step wizard. Progress bar at top showing step completion. Cannot skip steps. Back button available from step 2 onward.
Step 1 — Profile Setup: Username (real-time availability check via API debounce 500ms), College/University, Bio (optional, 200 char limit), Avatar upload (Supabase Storage, max 2MB, jpg/png/webp only, show preview immediately after selection).
Step 2 — Skill Level: 3 large selectable cards — Beginner (I'm just starting out), Intermediate (I know basics, want to improve), Advanced (I want competitive programming and interview prep). Single select, required.
Step 3 — Topic Interests: Checkbox grid of all DSA topics fetched from topics table. Must select at least 1. Show topic icon + name per checkbox.
Step 4 — Daily Goal: 4 large radio buttons — 1 problem/day, 2 problems/day, 5 problems/day, 10 problems/day. Each shows estimated weekly completion count.
Completion: Insert profile record, insert topic interests, initialize streak record with current_streak = 0, initialize leaderboard entry, redirect to /dashboard with a welcome toast notification.

Page 5 — Dashboard /dashboard
Protected route — redirect to /auth/login if unauthenticated.
Top Bar: Personalized greeting "Good morning, [username] 👋" with current date. Notification bell icon (future scope, render as non-functional icon for now).
Stats Row (4 cards): Total Questions Solved | Current Streak (with flame icon) | Accuracy % (accepted / total submissions × 100) | Time Spent Today (in minutes). Each card has a subtle trend indicator (up/down arrow with percentage change vs yesterday).
Daily Goal Progress: Horizontal progress bar — "Today's Goal: 2 / 5 problems solved". Percentage fill with label. If goal met: green color, checkmark icon, "Goal achieved! 🎉" text.
Activity Heatmap: GitHub-style contribution heatmap. 52 weeks × 7 days grid. Color intensity based on daily_activity.questions_solved. Tooltip on hover: "3 problems solved on Jan 15, 2025". Render using SVG via Recharts or custom SVG implementation.
Topic Radar Chart: Recharts RadarChart showing accuracy per topic (normalized 0–100). Topics on axes. User's performance plotted. Colored fill with 40% opacity.
Weakness Detector Panel: List top 3 topics where user has lowest accuracy. Each row: topic name, accuracy badge, "Practice Now" button linking to /problems?topic=[slug].
Recent Submissions Table: Last 10 submissions. Columns: Problem Title (clickable link), Language badge, Status badge (color-coded), Time (relative: "2 hours ago"). Show skeleton loader while fetching.
Recommended Problems: 3 problem cards based on user's weak topics and unsolved bookmarks. Card shows: title, difficulty badge, topic tag, estimated time. "Solve Now" button links to /problems/[slug].
Quick Tutor Access: Floating card — "Need help? Ask your AI Tutor" with a chat bubble icon and "Open Tutor" button linking to /tutor.

Page 6 — Problems List /problems
Two-column layout: filter sidebar (240px fixed left) + main content (fluid right).
Filter Sidebar:
Search input: real-time search by title (300ms debounce, updates URL query param ?search=)
Topic filter: multi-select checkbox list (all topics from DB, show count per topic)
Difficulty filter: 3 checkboxes (Easy, Medium, Hard) with color indicators
Status filter: radio buttons (All / Solved / Attempted / Unsolved) — compares against user's submission history
Company tag filter: multi-select dropdown with search
Premium filter: toggle (Free / All)
Clear All Filters button
All filter selections reflected in URL query params for shareability and browser back navigation.
Problems Table:
Columns: # (row number), Status Icon (green checkmark = solved, yellow dot = attempted, empty = unsolved), Title (clickable), Difficulty Badge (pill: green/yellow/red), Topic Tag, Company Tags (up to 2 shown + overflow count), Bookmark Icon (toggle, instant Supabase upsert)
Pagination: 50 rows per page, pagination controls at bottom
Sort: click column headers for Title (A-Z/Z-A), Difficulty (easy-first/hard-first)
Loading: skeleton rows (10 rows) during initial fetch
Empty state: illustrated empty state SVG + "No problems match your filters. Try adjusting them." with Reset Filters button

Page 7 — Problem Detail + Code Editor /problems/[slug]
This is the platform's most critical page. Full-viewport split-panel layout using react-resizable-panels. Default split: 45% left / 55% right. Draggable divider. Both panels independently scrollable.
Left Panel — Problem Description:
Sticky top bar: Problem title, difficulty badge, topic tag chips, company tag chips, bookmark toggle button, Report Problem button (opens modal).
Tab navigation: Description | Submissions | Editorial | Discussion (render static "Coming Soon" for Discussion).
Description Tab:
Full problem statement rendered as markdown
Input Format section
Output Format section
Constraints section (monospace font, dark background box)
2 Sample Test Cases, each in a bordered card:
Input block with "Copy" button
Output block with "Copy" button
Explanation if provided
Related Topics chips at bottom
Submissions Tab:
User's submission history for this problem only
Table: submission ID (last 6 chars), Language, Status badge, Score, Date/time, "View Code" button
"View Code" opens a modal with read-only Monaco Editor showing submitted code
Editorial Tab:
If user has solved the problem OR editorial is unlocked: render full editorial markdown with code examples in highlighted code blocks
If not solved and locked: blurred overlay with "Solve the problem to unlock the editorial" and a padlock icon
Right Panel — Code Editor:
Top toolbar:
Language selector dropdown (shows language name + version, updates editor syntax mode)
"Load Template" button — fills editor with starter template for selected language
"Reset" button — clears editor (with confirmation: "Reset your code? This cannot be undone.")
"Copy Code" button — copies editor content to clipboard
"Format Code" button — runs Prettier (JS) or equivalent formatting via Flask microservice
Font size controls: A- / A+
Monaco Editor:
Theme: vs-dark default, switchable to light and hc-black via settings
Font: JetBrains Mono, size from user preference (default 14px)
Tab size: from user preference (default 2 spaces)
Minimap: disabled
Line numbers: enabled
Bracket pair colorization: enabled
Word wrap: off
Auto-save draft to localStorage keyed by [userId]-[questionId]-[languageId] — restore on page load with a toast "Draft restored from last session."
Custom Input Panel (below editor, collapsible):
Label: "Custom Test Input"
Textarea for user-provided stdin
Toggle show/hide with chevron icon
Action Buttons (sticky bottom of right panel):
"Run" button (secondary style, Ctrl+Enter shortcut): sends code + custom input to /api/execute/run, shows result in output console
"Submit" button (primary style, Ctrl+Shift+Enter shortcut): sends code to /api/execute/submit, evaluates against all test cases
Output Console (below action buttons, appears after Run or Submit):
Run Result: shows stdout (white text), stderr (red text), compilation error (yellow text with line numbers), runtime error (red with error type label), execution time in ms
Submit Result: animated progress — "Running test cases... (3/10)". After completion: summary card showing passed/total count, score percentage, status badge. Expandable test case breakdown showing each test case: status icon, execution time, memory used. Hidden test cases show only pass/fail, not the actual input/output.
During execution: spinner animation in Run/Submit button, button disabled to prevent double-submission
AI Tutor Tab (inside left panel tabs):
Embedded mini-chat interface inside the left panel
Pre-loaded system context: current question title, difficulty, user's recent submissions on this question
Input field at bottom with Send button
Chat messages above, scrollable
"Open in Full Tutor" link that navigates to /tutor with this session pre-loaded

Page 8 — AI Virtual Tutor /tutor
Full-viewport layout. Left sidebar (280px) + main chat area (fluid).
Left Sidebar:
"New Chat" button at top (primary, full width)
Sessions list: grouped by date (Today, Yesterday, Last 7 days). Each item: session title (auto-generated from first message, max 40 chars), question name if linked, relative timestamp. Click to open session.
Search sessions input
Settings gear icon linking to /settings
Main Chat Area:
Chat header: session title (editable inline on click), linked question name if applicable, "Clear History" button (with confirmation)
Messages list (scrollable): user messages right-aligned (primary accent background), AI messages left-aligned (surface background). Both use rounded-2xl pill styling. Markdown rendered in AI messages — code blocks with syntax highlighting, bullet lists, bold text, headings all styled correctly.
AI message actions: copy button, thumbs up/down feedback buttons
Typing indicator: 3 animated dots when AI is generating response
Input area (sticky bottom): textarea (auto-resize, max 4 rows), character counter (max 2000), Send button (Ctrl+Enter shortcut), attach question shortcut button (opens question picker modal)
Tutor System Prompt (constructed in Flask, not visible to user):
You are CodeVerse AI Tutor, a world-class DSA and competitive programming mentor.
You are helping [username], a [skill_level] learner who is working on [question title] (Difficulty: [difficulty], Topic: [topic]).
Their recent submissions on this question had status: [submission_statuses].
Their weakest topics are: [weak_topics].

Rules:
1. Never give the full solution directly unless the user explicitly asks after at least 2 failed attempts.
2. Always give hints progressively — start with a conceptual nudge, then algorithmic hint, then pseudocode if needed.
3. Explain compilation errors and runtime errors with the exact line and cause.
4. Perform step-by-step dry runs when asked.
5. Recommend related problems after a successful solve.
6. Keep responses concise — no unnecessary preamble.
7. Always use code blocks for any code or pseudocode.
8. If asked for a learning path or roadmap, output it as a structured numbered list with time estimates.
Stream AI responses via OpenAI stream=True → Server-Sent Events from Flask → Socket.io relay from Node.js → real-time token-by-token rendering in frontend.
Save all messages to tutor_messages table after stream completes. Session updated_at refreshed on each message.

Page 9 — Performance Analytics /analytics
Protected route.
Date Range Selector: Pill buttons — 7 Days | 30 Days | 3 Months | All Time. Updates all charts on click.
Metrics Summary Row (5 cards): Total Solved | Total Submissions | Acceptance Rate | Average Execution Time | Longest Streak
Chart 1 — Daily Activity Line Chart: X-axis: dates, Y-axis: questions solved. Two lines: questions solved + submissions made. Dots on data points. Tooltip on hover.
Chart 2 — Topic Breakdown Bar Chart: X-axis: topic names, Y-axis: solved count. Bars colored by difficulty distribution (stacked: green/yellow/red segments). Tooltip shows breakdown.
Chart 3 — Topic Accuracy Radar Chart: Same as dashboard but larger, with labels and legend.
Chart 4 — Activity Heatmap: Larger version of dashboard heatmap. Color legend below. Tooltip with exact date and count.
Weakness Analysis Panel: Table listing all attempted topics, sorted by accuracy ascending. Columns: Topic, Attempted, Solved, Accuracy %, Trend (up/down vs last period). Bottom 3 rows highlighted in red background.
Submission History Table: Full paginated log of all user submissions. Filters: by problem, by language, by status. Columns: Problem, Language, Status, Score, Execution Time, Date. Click row to expand and view code in modal.

Page 10 — Leaderboard /leaderboard
Public page (viewable without login, but current user's row highlighted only when logged in).
Tab Navigation: Global | By Topic | By College
Global Tab:
Table: Rank (with medal icon for top 3: gold/silver/bronze), Avatar + Username, College, Total Solved, Accuracy %, Current Streak
Current user's row: highlighted with primary accent border
Pagination: 25 per page
Data polled every 5 minutes via React Query refetchInterval
Redis cache on backend: leaderboard computed and cached, refreshed every 5 minutes
By Topic Tab: Dropdown to select topic. Table shows rankings scoped to that topic's solved count and accuracy.
By College Tab: Shows aggregate stats grouped by college name. Columns: Rank, College, Total Members, Combined Solved, Average Accuracy.

Page 11 — Public Profile /profile/[username]
Cover gradient header, avatar (circular, 80px), username, bio, college, GitHub/LinkedIn icon links
Stats row: Solved, Streak, Accuracy %, Global Rank
Solved Distribution Donut Chart: Recharts PieChart — Easy (green) / Medium (yellow) / Hard (red) segments with legend
Topic Breakdown: horizontal bar chart of solved count per topic
Achievements Grid: badge icon + badge name + earned date, in a wrapping grid
Recent Submissions: last 5 submissions (problem, language, status, date) — view-only
"Edit Profile" button only visible when viewing own profile (compare auth user ID)

Page 12 — Settings /settings
Protected route. Tab layout: Profile | Preferences | Security
Profile Tab: Edit avatar (drag-and-drop upload, preview before save), username (availability check), bio, college, GitHub URL, LinkedIn URL. Save button triggers Supabase Storage upload for avatar, then profile update. Success toast on save.
Preferences Tab:
Dark / Light mode toggle (persisted to localStorage and Zustand)
Editor font size slider: 12–20px (updates Monaco Editor globally)
Editor theme selector: vs-dark | light | hc-black | monokai
Tab size: radio buttons (2 spaces / 4 spaces)
Auto-format on save: toggle
Daily reminder: toggle (future scope — render toggle but show "Email reminders coming soon" note)
Security Tab:
Change Password: Current Password, New Password, Confirm New Password — calls Supabase updateUser
Delete Account: destructive red button. Opens modal requiring user to type "DELETE" to confirm. On confirm: deletes all user data via cascade, calls Supabase deleteUser.

Page 13 — Admin Panel /admin
Role-gated: redirect to /dashboard if user role is not admin or moderator. Admin sees all tabs. Moderator sees only Questions and Reports tabs.
Sidebar Navigation: Dashboard Overview | Questions | Test Cases | Users | Submissions | Reports | Leaderboard
Overview: Stats cards — Total Users, Total Questions, Total Submissions Today, Active Users Today, Platform Error Rate. Line chart: daily signups for last 30 days.
Questions Manager:
Table: ID, Title, Topic, Difficulty, Published status, Premium status, Solved count, Actions (Edit / Delete / Toggle Published)
"Create Question" button opens full-page form:
Title, Slug (auto-generated, editable), Description (Monaco Editor in markdown mode), Difficulty selector, Topic selector, Company Tags (tag input), Constraints, Input Format, Output Format, Sample Input (code editor), Sample Output (code editor), Editorial (Monaco markdown), Is Premium toggle, Is Published toggle
Save as Draft or Publish directly
Test Cases Manager:
Question selector dropdown
CSV upload: format input,expected_output,is_hidden,weight — parsed and bulk-inserted
Manual add: input textarea, expected output textarea, is_hidden checkbox, weight input
Table of existing test cases with edit/delete per row
Users Manager:
Searchable table: avatar, username, email, role, joined date, total submissions, ban status
Actions: Change Role dropdown (user/moderator/admin), Ban User (sets banned flag, blocked from login), View Profile link
Submissions Monitor:
All submissions with filters: by user, by question, by status, by date range
Stuck jobs: filter status = 'pending' older than 60 seconds — show "Rerun" button that re-enqueues the BullMQ job
Reports Queue:
Table: reported question title, reported by, reason, date, status
Actions: Resolve (mark resolved, sends notification to reporter), Dismiss (mark dismissed), View Question link
Leaderboard Control: Button to manually trigger leaderboard recalculation (bypasses Redis cache, recomputes from raw submissions data).

ALL API ENDPOINTS
Auth — Node.js
POST   /api/auth/signup          — create Supabase user + profile row
POST   /api/auth/login           — Supabase signInWithPassword
POST   /api/auth/logout          — Supabase signOut
GET    /api/auth/session         — verify JWT, return user + profile
POST   /api/auth/refresh         — Supabase refreshSession
POST   /api/auth/forgot-password — Supabase resetPasswordForEmail
Questions — Node.js
GET    /api/questions                    — paginated, filterable (topic, difficulty, status, company, search, premium), returns solved/attempted status per question for auth user
GET    /api/questions/:slug              — full question detail (no hidden test cases)
GET    /api/questions/bookmarked         — auth user's bookmarked questions
POST   /api/questions/:id/bookmark      — toggle bookmark (upsert/delete)
POST   /api/questions/:id/report        — submit report
Execution — Node.js → Flask
POST   /api/execute/run          — body: { code, language_id, custom_input } → Flask /run → Docker → return { stdout, stderr, execution_time_ms, status }
POST   /api/execute/submit       — body: { code, language_id, question_id } → enqueue BullMQ job → return { job_id }
GET    /api/execute/status/:jobId — poll job status → return { status, result } (also pushed via Socket.io)
Analytics — Node.js
GET    /api/analytics/dashboard  — returns all dashboard stats for auth user
GET    /api/analytics/progress   — time-series data, query param: range (7d|30d|3m|all)
GET    /api/analytics/topics     — per-topic solved/accuracy breakdown
GET    /api/analytics/streak     — current streak, longest streak, last active date, heatmap data
Tutor — Node.js → Flask → OpenAI
POST   /api/tutor/sessions                         — create new session, body: { question_id? }
GET    /api/tutor/sessions                         — list auth user's sessions
GET    /api/tutor/sessions/:id/messages            — fetch full message history for session
POST   /api/tutor/sessions/:id/messages            — send user message → Flask constructs prompt → OpenAI stream → Socket.io relay → saves to DB on complete
DELETE /api/tutor/sessions/:id                     — delete session + cascade messages
Leaderboard — Node.js
GET    /api/leaderboard/global          — paginated global rankings (cached Redis)
GET    /api/leaderboard/topic/:topicId  — topic-scoped rankings
GET    /api/leaderboard/college         — college aggregate rankings
GET    /api/leaderboard/me              — auth user's rank and surrounding neighbors
Profile — Node.js
GET    /api/profile/:username    — public profile data
PUT    /api/profile              — update auth user's profile
POST   /api/profile/avatar       — upload avatar to Supabase Storage, return URL
Admin — Node.js (role-gated)
POST   /api/admin/questions                  — create question
PUT    /api/admin/questions/:id              — update question
DELETE /api/admin/questions/:id              — delete question
POST   /api/admin/questions/:id/testcases    — bulk upload test cases (CSV)
POST   /api/admin/questions/:id/testcases/single — add single test case
PUT    /api/admin/testcases/:id              — update test case
DELETE /api/admin/testcases/:id             — delete test case
GET    /api/admin/users                      — list all users with filters
PUT    /api/admin/users/:id/role             — change user role
POST   /api/admin/users/:id/ban              — ban/unban user
GET    /api/admin/submissions                — all submissions with filters
POST   /api/admin/submissions/:id/rerun      — requeue stuck submission
GET    /api/admin/reports                    — list reports with filters
PUT    /api/admin/reports/:id                — resolve/dismiss report
POST   /api/admin/leaderboard/recalculate   — force leaderboard recomputation
GET    /api/admin/analytics/platform        — platform-wide stats

UI/UX DESIGN SYSTEM
Color Tokens (CSS custom properties — dark mode defaults)
css
--color-bg-base: #0D1117;
--color-bg-surface: #161B22;
--color-bg-elevated: #21262D;
--color-border: #30363D;
--color-border-muted: #21262D;
--color-accent-primary: #58A6FF;
--color-accent-primary-hover: #79B8FF;
--color-success: #3FB950;
--color-error: #F85149;
--color-warning: #D29922;
--color-info: #58A6FF;
--color-text-primary: #E6EDF3;
--color-text-secondary: #C9D1D9;
--color-text-muted: #8B949E;
--color-text-disabled: #484F58;
--color-difficulty-easy: #3FB950;
--color-difficulty-medium: #D29922;
--color-difficulty-hard: #F85149;
Light mode: override all tokens with light equivalents (white backgrounds, dark text, same accent).
Typography
UI Font: Inter — imported from Google Fonts
Code Font: JetBrains Mono — imported from Google Fonts
Scale: 48px h1 / 36px h2 / 24px h3 / 20px h4 / 16px body / 14px small / 12px caption
Weight: 400 body, 500 medium UI elements, 600 headings, 700 bold headings
Line Height: 1.6 body, 1.3 headings, 1.5 UI
Component Standards
Border Radius: buttons 6px, cards 8px, modals 12px, badges 9999px (pill)
Button Heights: primary/secondary 40px, small 32px, large 48px
Shadows: cards 0 1px 3px rgba(0,0,0,0.4), modals 0 20px 60px rgba(0,0,0,0.6)
Focus Rings: outline: 2px solid var(--color-accent-primary); outline-offset: 2px on all interactive elements
Transition: all 150ms ease on buttons, all 200ms ease on cards and panels
Difficulty Badges: pill shape, background 15% opacity of color + full opacity text, 6px horizontal padding, 2px vertical padding
Responsive Breakpoints
Mobile: 375px–767px — single column, sidebar hidden (hamburger menu), Monaco Editor minimum 300px height, split panel stacks vertically
Tablet: 768px–1279px — sidebar overlay on mobile pattern, condensed tables
Desktop: 1280px+ — full two-column layouts, fixed sidebars, resizable panels
Loading and Feedback States
Skeleton Loaders: every data-dependent section must have a skeleton matching the shape of real content — text lines, card outlines, table rows (use Tailwind animate-pulse)
Empty States: custom illustrated SVG + descriptive text + action CTA for: problems list (no results), submissions history (no submissions), bookmarks (none bookmarked), tutor sessions (no sessions), leaderboard (not ranked)
Error States: red-bordered error card with error icon, user-friendly message, and retry button
Confirmation Modals: required for all destructive actions (reset code, delete account, delete session, ban user)

SECURITY IMPLEMENTATION
Every protected API route validates Supabase JWT via Authorization: Bearer <token> header — reject with 401 if invalid or expired
Admin/moderator routes additionally check profiles.role from database — reject with 403 if insufficient role
RLS policies on Supabase ensure database-level enforcement even if application-level checks are bypassed
Code execution runs in Docker containers with --network none --memory 256m --cpus 0.5 --pids-limit 50 --read-only flags — writable only at /sandbox/ mount
Rate limiting enforced per user ID on authenticated routes, per IP on public/auth routes
All user input sanitized with Zod schema validation on Node.js before processing
OpenAI API key stored only as server-side environment variable in Flask — never sent to frontend
Supabase service role key used only in Node.js server — never exposed to browser
CORS configured to allow only the frontend domain origin on Node.js and Flask
HTTP-only, secure, SameSite=Strict cookies for session management
All file uploads validated: type whitelist (jpg/png/webp for avatars, csv for test cases), max size enforced server-side
Sentry DSN configured for both Node.js and Next.js — capture unhandled exceptions with request context

NON-FUNCTIONAL REQUIREMENTS
Initial Page Load: Landing page LCP under 2.5 seconds on 3G (optimized images, SSR, minimal JS bundle)
API Response Times: Questions list under 300ms (Redis cache), Dashboard stats under 500ms, Code run under 5 seconds end-to-end
Code Execution Reliability: BullMQ job retried up to 2 times on failure; if permanently failed, status set to runtime_error with message "Execution service unavailable, please try again"
Uptime Design: Stateless Node.js backend allows horizontal scaling behind Nginx load balancer; Flask workers independently scalable
Accessibility: WCAG 2.1 AA — all images have alt text, all form inputs have associated labels, color contrast ratio minimum 4.5:1 for normal text, all interactive elements keyboard navigable and screen-reader announced via ARIA labels and roles
Browser Support: Latest 2 versions of Chrome, Firefox, Safari, Edge — no IE support
Type Safety: TypeScript strict mode throughout frontend and backend-node — zero any types, no @ts-ignore comments

PROJECT DIRECTORY STRUCTURE
codeverse/
├── frontend/                    # Next.js 14 App Router
│   ├── app/
│   │   ├── (auth)/login/
│   │   ├── (auth)/signup/
│   │   ├── onboarding/
│   │   ├── dashboard/
│   │   ├── problems/
│   │   ├── problems/[slug]/
│   │   ├── tutor/
│   │   ├── analytics/
│   │   ├── leaderboard/
│   │   ├── profile/[username]/
│   │   ├── settings/
│   │   ├── admin/
│   │   └── page.tsx             # Landing page
│   ├── components/
│   │   ├── ui/                  # Reusable primitives: Button, Input, Badge, Modal, Skeleton, Toast
│   │   ├── editor/              # MonacoEditor wrapper, Toolbar, OutputConsole
│   │   ├── charts/              # Heatmap, RadarChart, LineChart, BarChart, DonutChart wrappers
│   │   ├── tutor/               # ChatMessage, ChatInput, SessionSidebar
│   │   ├── problems/            # ProblemTable, ProblemCard, FilterSidebar
│   │   ├── dashboard/           # StatsCard, GoalProgress, RecommendedProblems
│   │   └── admin/               # QuestionForm, TestCaseUpload, UserTable
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client (browser)
│   │   ├── api.ts               # Typed API client using fetch
│   │   ├── socket.ts            # Socket.io client setup
│   │   └── utils.ts             # cn(), formatDate(), formatDuration()
│   ├── stores/                  # Zustand stores: auth, editorPrefs, activeSession
│   ├── hooks/                   # Custom hooks: useAuth, useSubmission, useTutor
│   ├── types/                   # Shared TypeScript interfaces and enums
│   └── .env.example
│
├── backend-node/                # Express.js API server
│   ├── src/
│   │   ├── routes/              # auth, questions, execute, analytics, tutor, leaderboard, profile, admin
│   │   ├── middleware/          # auth.middleware.ts, role.middleware.ts, rateLimit.middleware.ts
│   │   ├── services/            # supabase.service.ts, redis.service.ts, flask.service.ts, socket.service.ts
│   │   ├── queues/              # execution.queue.ts (BullMQ), workers/execution.worker.ts
│   │   ├── validators/          # Zod schemas per route
│   │   └── app.ts               # Express app setup
│   └── .env.example
│
├── backend-flask/               # Flask microservice
│   ├── app/
│   │   ├── routes/              # execute.py, tutor.py, analysis.py
│   │   ├── services/            # docker_runner.py, openai_service.py, test_evaluator.py
│   │   └── __init__.py          # Flask app factory
│   ├── sandbox/                 # Docker build context for sandbox containers
│   │   ├── Dockerfile.python
│   │   ├── Dockerfile.cpp
│   │   ├── Dockerfile.java
│   │   ├── Dockerfile.javascript
│   │   └── Dockerfile.go
│   ├── requirements.txt
│   └── .env.example
│
├── supabase/
│   ├── migrations/              # All SQL migration files in order
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   └── 003_indexes.sql
│   └── seed.sql                 # Seed: 5 topics, 6 languages, 20 sample questions, 3 test cases each
│
├── docker-compose.yml           # All services: frontend, backend-node, backend-flask, redis
├── nginx.conf                   # Reverse proxy config
├── .github/workflows/ci.yml    # GitHub Actions: lint + typecheck + build
└── README.md                   # Full setup guide, env vars reference, deployment steps

SEED DATA REQUIREMENTS
/supabase/seed.sql must include:
Topics (15): Arrays, Strings, Linked Lists, Stacks, Queues, Recursion, Sorting, Searching, Trees, Graphs, Dynamic Programming, Greedy, Hashing, Backtracking, Bit Manipulation — each with a slug, icon name, and 1-sentence description.
Coding Languages (6): C (gcc 13), C++ (g++ 13), Java 21, Python 3.11, JavaScript (Node.js 20), Go 1.22 — each with compile_command (if applicable), run_command, file_extension, and a meaningful starter template (e.g., Python includes def solution():, C++ includes #include<iostream>).
Questions (20): Mix of easy (8), medium (8), hard (4). Cover at least 8 different topics. Each must have: title, slug, full problem description, input format, output format, constraints, 2 sample test cases (not hidden), 3 hidden test cases, basic editorial. Include questions like Two Sum, Reverse Linked List, Binary Search, Fibonacci (DP), Valid Parentheses, Merge Sort, BFS Shortest Path — do not use placeholder titles.

RESTRICTIONS — DO NOT IMPLEMENT
Do not use Create React App, Vite, or any SPA setup without SSR — Next.js 14 App Router is mandatory
Do not use Firebase, MongoDB, PlanetScale, or any database other than Supabase PostgreSQL
Do not use Judge0, Sphere Engine, or any third-party code execution API — build the Docker sandbox execution pipeline from scratch inside Flask
Do not use Material UI, Chakra UI, Ant Design, or any pre-styled component library — Tailwind CSS utility classes only
Do not store secrets, API keys, or service role keys in frontend code or committed .env files
Do not execute user code directly inside the Node.js or Flask process — always use the Docker container sandbox
Do not use any TypeScript type anywhere in frontend or backend-node — strict mode is non-negotiable
Do not skip loading states, error states, or empty states on any component that fetches data
Do not produce placeholder comments like "// TODO: implement this" or "// add logic here" — all logic must be complete
Do not mock API responses with static JSON in production code paths — all data must come from real Supabase queries
Do not build a mobile-only experience — desktop-first, fully responsive down to 375px

OUTPUT EXPECTATIONS
Deliver complete, working, production-deployable source code with:
Zero TypeScript errors in strict mode across all packages
All 13 pages fully implemented with real data and all UI states
All API endpoints implemented with full business logic, Zod validation, and error handling
Docker Compose running all services locally with a single docker compose up command
Supabase migration files executable in order to produce the complete schema with RLS
Seed script producing meaningful demo data (not lorem ipsum)
README with: prerequisites, step-by-step local setup, environment variable documentation for each service, Supabase setup instructions, and notes on production deployment
.env.example for each service listing every required variable with a description comment
/docs/api.md documenting every endpoint with method, path, auth requirement, request body schema, and example response

