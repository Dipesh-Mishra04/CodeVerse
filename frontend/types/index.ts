export type Difficulty = "easy" | "medium" | "hard";

export type SkillLevel = "beginner" | "intermediate" | "advanced";

export type SubmissionStatus =
  | "pending"
  | "running"
  | "accepted"
  | "wrong_answer"
  | "time_limit_exceeded"
  | "memory_limit_exceeded"
  | "compilation_error"
  | "runtime_error";

export type Topic = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  questionCount?: number;
};

export type CodingLanguage = {
  id: string;
  name: string;
  slug: string;
  version: string;
  template_code: string;
  file_extension: string;
};

export type QuestionSummary = {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topic: Pick<Topic, "id" | "name" | "slug">;
  company_tags: string[];
  is_premium: boolean;
  status: "solved" | "attempted" | "unsolved";
  bookmarked: boolean;
};

export type QuestionDetail = {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  description: string;
  topic: Pick<Topic, "id" | "name" | "slug">;
  company_tags: string[];
  constraints: string | null;
  input_format: string | null;
  output_format: string | null;
  sample_input: string | null;
  sample_output: string | null;
  editorial: string | null;
  is_premium: boolean;
  related_topic_slugs: string[];
  user_solved: boolean;
};

export type DashboardStats = {
  greeting_name: string;
  total_solved: number;
  current_streak: number;
  accuracy_percent: number;
  time_spent_today_minutes: number;
  goal_daily: number;
  goal_progress: number;
  trend: {
    solved_vs_yesterday_pct: number;
    streak_vs_yesterday_pct: number;
    accuracy_vs_yesterday_pct: number;
    time_vs_yesterday_pct: number;
  };
  weakness_topics: { slug: string; name: string; accuracy: number }[];
  recent_submissions: {
    id: string;
    question_slug: string;
    question_title: string;
    language: string;
    status: SubmissionStatus;
    submitted_at: string;
  }[];
  recommended: QuestionSummary[];
  heatmap: { date: string; count: number }[];
  radar: { topic: string; accuracy: number }[];
};

export type LeaderboardEntry = {
  rank: number;
  user_id: string;
  username: string;
  avatar_url: string | null;
  college: string | null;
  total_solved: number;
  accuracy_percent: number;
  current_streak: number;
};

export type TutorSession = {
  id: string;
  title: string;
  question_title: string | null;
  question_slug: string | null;
  updated_at: string;
};

export type TutorMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};
