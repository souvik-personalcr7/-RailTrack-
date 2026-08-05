'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Train, Mail, KeyRound, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useResetPassword } from '@/hooks/useAuth';
import { validateStrongPassword } from '@/lib/validations';

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !otp.trim() || !newPassword || !confirmPassword) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    if (otp.trim().length !== 6 || !/^\d{6}$/.test(otp.trim())) {
      setErrorMessage('Please enter a valid 6-digit numeric OTP code.');
      return;
    }

    const passwordCheck = validateStrongPassword(newPassword);
    if (!passwordCheck.isValid) {
      setErrorMessage(passwordCheck.message || 'Password does not meet complexity requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Confirm password does not match the new password.');
      return;
    }

    try {
      const res = await resetPasswordMutation.mutateAsync({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
        confirmPassword,
      });
      setSuccessMessage(res.message || 'Password reset successfully.');

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Password reset failed. Invalid or expired OTP.');
    }
  };

  return (
    <div className="glass-panel mx-auto rounded-3xl p-6 sm:p-8 shadow-glass border border-slate-200/60 dark:border-slate-800/60 space-y-6">
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
          Reset Password
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter the 6-digit OTP code sent to your email and choose your new password
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
          <span>{successMessage} Redirecting to login...</span>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Email Field */}
        <div className="space-y-1">
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

        {/* OTP Code */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            6-Digit OTP Code
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              required
              className="w-full rounded-xl bg-slate-100/70 dark:bg-slate-800/60 pl-10 pr-4 py-2.5 text-xs font-mono font-bold tracking-widest text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 outline-none focus:border-rail-blue focus:ring-1 focus:ring-rail-blue transition-all"
            />
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters (numbers or letters)"
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

        {/* Confirm New Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              className="w-full rounded-xl bg-slate-100/70 dark:bg-slate-800/60 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 outline-none focus:border-rail-blue focus:ring-1 focus:ring-rail-blue transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-rail-blue py-3 text-xs font-bold text-white shadow-glow transition-all hover:bg-sky-600 active:scale-98 disabled:opacity-70 cursor-pointer mt-4"
        >
          {resetPasswordMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Reset Password</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
        Remembered your password?{' '}
        <Link href="/login" className="font-bold text-rail-blue hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Suspense fallback={<div className="glass-panel p-8 text-center text-xs text-slate-400">Loading Reset Password...</div>}>
          <ResetPasswordFormContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
