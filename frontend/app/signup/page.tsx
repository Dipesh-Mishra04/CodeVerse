'use client';
import { useState } from 'react';
import { signUp, signInWithGoogle } from '@/lib/auth';
import Link from 'next/link';
import Hero3D from '@/components/Hero3D';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setMessage('');
    const { data, error } = await signUp(email, password);
    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      setMessage('Sign up successful! Check your email for confirmation.');
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    await signInWithGoogle(); // redirects automatically
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* 3D Animated Background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Hero3D />
      </div>

      {/* Background glow */}
      <div className="absolute z-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Overlay gradient */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-neutral-950/60 via-neutral-950/40 to-neutral-950/80" />

      {/* Signup Form */}
      <div className="relative z-10 w-full max-w-md px-6 sm:px-8 py-10">
        <div className="backdrop-blur-xl bg-neutral-900/40 border border-emerald-500/20 rounded-2xl shadow-2xl p-8 sm:p-10">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Start Coding Free
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base">Create your account and level up your skills</p>
          </div>

          {/* Error/Success Message */}
          {message && (
            <div className={`mb-6 p-3 rounded-lg text-sm ${
              message.includes('successful') 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {message}
            </div>
          )}

          {/* Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
            className="space-y-6"
          >
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all backdrop-blur-sm"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all backdrop-blur-sm"
              />
              <p className="mt-1 text-xs text-neutral-500">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all backdrop-blur-sm"
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-500 text-black font-semibold rounded-lg hover:from-emerald-400 hover:to-green-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-neutral-500">Or continue with</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-3 px-4 bg-neutral-800/50 border border-neutral-700/50 text-white font-medium rounded-lg hover:bg-neutral-800/70 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Connecting...' : 'Continue with Google'}
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-neutral-400">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
