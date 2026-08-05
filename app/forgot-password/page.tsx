'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Train, Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForgotPassword } from '@/hooks/useAuth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    try {
      const res = await forgotPasswordMutation.mutateAsync({ email });
      setSuccessMessage(res.message || '6-digit OTP sent to your email.');

      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP. Please check your email and try again.');
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
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
              Forgot Password
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your email address and we&apos;ll send you a 6-digit OTP code to reset your password
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

          {/* Success Banner */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>{successMessage} Redirecting to reset page...</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-rail-blue py-3 text-xs font-bold text-white shadow-glow transition-all hover:bg-sky-600 active:scale-98 disabled:opacity-70 cursor-pointer mt-2"
            >
              {forgotPasswordMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Send 6-Digit OTP</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
            Remembered your password?{' '}
            <Link href="/login" className="font-bold text-rail-blue hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
