"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password reset email sent. Check your inbox.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md space-y-6 rounded-xl border border-neutral-800 bg-neutral-900 p-8"
      >
        <h1 className="text-2xl font-bold">Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3"
          required
        />

        <button
          disabled={loading}
          className="w-full rounded-lg bg-emerald-500 py-3 font-semibold text-black"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && <p className="text-sm text-neutral-400">{message}</p>}
      </form>
    </div>
  );
}
