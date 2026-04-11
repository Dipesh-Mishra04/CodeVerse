'use client';

import { supabase } from "@/lib/supabaseClient";
import { UserProfile } from "@/features/dashboard/types";

const TABLE_NAME = "user_profiles";

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116" || error.code === "42P01") {
      return null;
    }

    // Gracefully continue dashboard if profile table or policies are not ready yet.
    console.warn("Profile read skipped:", {
      code: error.code,
      message: error.message,
    });
    return null;
  }

  return data as UserProfile;
};

export const saveUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .upsert(profile, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as UserProfile;
};
