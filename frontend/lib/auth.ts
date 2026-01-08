'use client';
import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';

export const signUp = async (email: string, password: string, username?: string) => {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        username: username || email.split('@')[0], // Use email prefix if no username
      }
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
};

export const getUserName = async (): Promise<string | null> => {
  const user = await getUser();
  if (!user) return null;
  
  // Get username from user metadata
  const username = user.user_metadata?.username || user.user_metadata?.full_name || user.email?.split('@')[0] || null;
  return username;
};
