'use client';

import { useEffect, useState } from 'react';
import { getUser, getUserName, signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const u = await getUser();
        if (u) {
          setUser(u);
          // Get username from user metadata
          const userName = await getUserName();
          setUsername(userName || u.email?.split('@')[0] || 'User');
        } else {
          // No user found, redirect to login
          router.push('/login?redirect=/dashboard');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/login?redirect=/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-400">
        <div className="text-center">
          <div className="mb-4">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">
        Welcome, {username}
      </h1>

      <button
        onClick={handleSignOut}
        className="rounded bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700"
      >
        Sign Out
      </button>
    </div>
  );
}
