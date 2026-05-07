import type { Request, Response, NextFunction } from "express";
import type { User } from "@supabase/supabase-js";
import { supabaseAdmin, supabaseAnon } from "../lib/supabase.js";

export type AuthedRequest = Request & { user?: User | null };

function toBaseUsername(user: User): string {
  const raw =
    user.user_metadata?.username ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "user";

  return String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 24) || "user";
}

async function ensureProfileRows(user: User) {
  const { data: existingProfile, error: profileLookupError } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileLookupError) {
    throw new Error(profileLookupError.message);
  }

  if (!existingProfile) {
    const username = `${toBaseUsername(user)}_${user.id.slice(0, 8)}`;
    const { error: profileInsertError } = await supabaseAdmin.from("profiles").insert({
      id: user.id,
      username,
    });

    if (profileInsertError) {
      throw new Error(profileInsertError.message);
    }
  }

  const { error: streakError } = await supabaseAdmin.from("streaks").upsert(
    {
      user_id: user.id,
      current_streak: 0,
      longest_streak: 0,
    },
    { onConflict: "user_id" }
  );

  if (streakError) {
    throw new Error(streakError.message);
  }

  const { error: leaderboardError } = await supabaseAdmin.from("leaderboard").upsert(
    {
      user_id: user.id,
      total_solved: 0,
      accuracy_percent: 0,
      current_streak: 0,
    },
    { onConflict: "user_id" }
  );

  if (leaderboardError) {
    throw new Error(leaderboardError.message);
  }
}

export async function optionalAuth(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    req.user = null;
    return next();
  }
  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data.user) {
    req.user = null;
    return next();
  }
  try {
    await ensureProfileRows(data.user);
  } catch {
    req.user = null;
    return next();
  }
  req.user = data.user;
  next();
}

export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  try {
    await ensureProfileRows(data.user);
  } catch (bootstrapError) {
    const message =
      bootstrapError instanceof Error
        ? bootstrapError.message
        : "Failed to initialize user profile";
    res.status(500).json({ error: message });
    return;
  }
  req.user = data.user;
  next();
}
