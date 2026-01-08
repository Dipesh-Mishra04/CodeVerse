'use client';

import { useEffect, useState } from 'react';
import { getUser, signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getUser();
      setUser(u);
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">
        Welcome, {user.email}
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
