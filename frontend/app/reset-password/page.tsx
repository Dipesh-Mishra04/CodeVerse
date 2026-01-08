"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMessage("You can now reset your password.");
      }
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully");
      setTimeout(() => router.push("/login"), 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleUpdatePassword}
        className="w-full max-w-md space-y-6 rounded-xl border border-neutral-800 bg-neutral-900 p-8"
      >
        <h1 className="text-2xl font-bold">Reset Password</h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3"
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3"
          required
        />

        <button className="w-full rounded-lg bg-emerald-500 py-3 font-semibold text-black">
          Update Password
        </button>

        {message && <p className="text-sm text-neutral-400">{message}</p>}
      </form>
    </div>
  );
}
