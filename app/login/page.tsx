'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Train, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useLogin } from '@/hooks/useAuth';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      router.push(callbackUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="glass-panel mx-auto rounded-3xl p-6 sm:p-10 shadow-glass border border-slate-200/60 dark:border-slate-800/60 space-y-6">
      {/* Header & Logo */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rail-blue text-white shadow-glow transition-transform group-hover:scale-105">
            <Train className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Rail<span className="text-rail-blue"> Track</span>
          </span>
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white pt-2">
          Welcome Back
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sign in to your account to save trains & track live journeys
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-medium text-rose-600 dark:text-rose-400"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full rounded-xl bg-slate-100/70 dark:bg-slate-800/60 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 outline-none focus:border-rail-blue focus:ring-1 focus:ring-rail-blue transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-rail-blue hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl bg-slate-100/70 dark:bg-slate-800/60 pl-10 pr-10 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 outline-none focus:border-rail-blue focus:ring-1 focus:ring-rail-blue transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-rail-blue py-3 text-xs font-bold text-white shadow-glow transition-all hover:bg-sky-600 active:scale-98 disabled:opacity-70 cursor-pointer mt-2"
        >
          {loginMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-bold text-rail-blue hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Suspense fallback={<div className="glass-panel p-8 text-center text-xs text-slate-400">Loading Sign In...</div>}>
          <LoginFormContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
