'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Train, User, Phone, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useRegister } from '@/hooks/useAuth';
import { validateEmail, validatePhone, validateStrongPassword } from '@/lib/validations';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !phoneNumber.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!validatePhone(phoneNumber)) {
      setErrorMessage('Please enter a valid phone number (10-15 digits).');
      return;
    }

    const passwordCheck = validateStrongPassword(password);
    if (!passwordCheck.isValid) {
      setErrorMessage(passwordCheck.message || 'Password does not meet complexity requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Confirm password does not match the password.');
      return;
    }

    try {
      await registerMutation.mutateAsync({
        fullName,
        phoneNumber,
        email,
        password,
        confirmPassword,
      });
      router.push('/');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
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
              Create Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Join RailTrack for real-time tracking, delay alerts & saved train routes
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
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full rounded-xl bg-slate-100/70 dark:bg-slate-800/60 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 outline-none focus:border-rail-blue focus:ring-1 focus:ring-rail-blue transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  required
                  className="w-full rounded-xl bg-slate-100/70 dark:bg-slate-800/60 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 outline-none focus:border-rail-blue focus:ring-1 focus:ring-rail-blue transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
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

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full rounded-xl bg-slate-100/70 dark:bg-slate-800/60 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 outline-none focus:border-rail-blue focus:ring-1 focus:ring-rail-blue transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-rail-blue py-3 text-xs font-bold text-white shadow-glow transition-all hover:bg-sky-600 active:scale-98 disabled:opacity-70 cursor-pointer mt-4"
            >
              {registerMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-rail-blue hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
