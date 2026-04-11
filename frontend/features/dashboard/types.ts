export type DashboardSection =
  | "overview"
  | "profile"
  | "mini-leetcode"
  | "ai-tutor"
  | "problems"
  | "submissions"
  | "roadmap"
  | "leaderboard"
  | "community"
  | "bookmarks"
  | "settings";

export interface UserProfile {
  user_id: string;
  full_name: string;
  email: string;
  date_of_birth: string;
  college: string;
  course: string;
  graduation_year: string;
  profile_photo_url: string;
  bio: string;
  github_url: string;
  linkedin_url: string;
  updated_at?: string;
}

export const emptyProfile = (userId: string, email: string): UserProfile => ({
  user_id: userId,
  full_name: "",
  email,
  date_of_birth: "",
  college: "",
  course: "",
  graduation_year: "",
  profile_photo_url: "",
  bio: "",
  github_url: "",
  linkedin_url: "",
});
