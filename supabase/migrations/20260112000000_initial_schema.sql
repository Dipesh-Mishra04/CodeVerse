-- CodeVerse initial schema (see Roadmap.md)
-- Run via Supabase CLI or SQL Editor after linking project.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Extended profile (auth.users managed by Supabase Auth)
CREATE TABLE public.profiles (
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

CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INTEGER
);

CREATE TABLE public.coding_languages (
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

CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  topic_id UUID REFERENCES public.topics(id),
  company_tags TEXT[],
  constraints TEXT,
  input_format TEXT,
  output_format TEXT,
  sample_input TEXT,
  sample_output TEXT,
  editorial TEXT,
  is_premium BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.test_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  is_hidden BOOLEAN DEFAULT true,
  weight INTEGER DEFAULT 1,
  display_order INTEGER
);

CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  question_id UUID REFERENCES public.questions(id),
  language_id UUID REFERENCES public.coding_languages(id),
  code TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending','running','accepted','wrong_answer','time_limit_exceeded',
    'memory_limit_exceeded','compilation_error','runtime_error'
  )),
  total_test_cases INTEGER,
  passed_test_cases INTEGER,
  score NUMERIC(5,2),
  submitted_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.submission_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
  test_case_id UUID REFERENCES public.test_cases(id),
  actual_output TEXT,
  is_passed BOOLEAN,
  execution_time_ms INTEGER,
  memory_used_kb INTEGER,
  error_message TEXT
);

CREATE TABLE public.daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  date DATE NOT NULL,
  time_spent_minutes INTEGER DEFAULT 0,
  questions_solved INTEGER DEFAULT 0,
  submissions_made INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

CREATE TABLE public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE
);

CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  question_id UUID REFERENCES public.questions(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, question_id)
);

CREATE TABLE public.tutor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  question_id UUID REFERENCES public.questions(id),
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.tutor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.tutor_sessions(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  badge_name TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) UNIQUE,
  total_solved INTEGER DEFAULT 0,
  accuracy_percent NUMERIC(5,2) DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.reported_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  question_id UUID REFERENCES public.questions(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','resolved','dismissed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.user_topic_interests (
  user_id UUID REFERENCES public.profiles(id),
  topic_id UUID REFERENCES public.topics(id),
  PRIMARY KEY (user_id, topic_id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reported_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_topic_interests ENABLE ROW LEVEL SECURITY;
