'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, Heart, BellRing, Sparkles, X, UserPlus, LogIn, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];
const DISMISS_KEY = 'railtrack_auth_prompt_dismissed';

export function AuthPromptModal() {
  const pathname = usePathname();
  const { user, isLoading, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuthStore();

  // Auto-open modal after delay if user is not logged in and hasn't dismissed in session
  useEffect(() => {
    if (isLoading || user) return;
    if (AUTH_ROUTES.includes(pathname)) return;

    const isDismissed = sessionStorage.getItem(DISMISS_KEY) === 'true';
    if (!isDismissed) {
      const timer = setTimeout(() => {
        openAuthModal();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, pathname, openAuthModal]);

  // Don't render modal on auth pages or if user is logged in
  if (user || AUTH_ROUTES.includes(pathname)) {
    return null;
  }

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, 'true');
    closeAuthModal();
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-white z-10"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-rail-blue/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close modal"
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer z-20"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header / Logo Icon */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rail-blue to-sky-400 text-white shadow-glow">
                <Train className="h-7 w-7" />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950">
                  <Sparkles className="h-3 w-3 fill-slate-950" />
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-white">
                  Join RailTrack Today
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  Sign in or create an account to unlock real-time train alerts and save favorite routes.
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="my-6 space-y-3 rounded-2xl bg-slate-800/50 p-4 border border-slate-700/50">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-rail-blue/20 text-rail-blue">
                  <Heart className="h-4 w-4 fill-rail-blue/30" />
                </div>
                <span>Save your regular train routes & station boards</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                  <BellRing className="h-4 w-4" />
                </div>
                <span>Get real-time delay analytics & weather alerts</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span>Sync your favorites seamlessly across devices</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2.5">
              <Link
                href="/login"
                onClick={closeAuthModal}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-rail-blue py-3 px-4 text-xs font-bold text-white shadow-glow transition-all hover:bg-sky-500 active:scale-98"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In to Account</span>
                <ArrowRight className="h-3.5 w-3.5 ml-auto" />
              </Link>

              <Link
                href="/register"
                onClick={closeAuthModal}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 py-3 px-4 text-xs font-bold text-slate-200 transition-all active:scale-98"
              >
                <UserPlus className="h-4 w-4 text-sky-400" />
                <span>Create Free Account</span>
              </Link>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-full py-2 text-center text-[11px] font-medium text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
