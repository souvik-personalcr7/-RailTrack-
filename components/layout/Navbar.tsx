'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Train, Heart, Sun, Moon, User as UserIcon, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { useFavoritesStore } from '@/store/favorites';
import { useAuthStore } from '@/store/auth';
import { useUser, useLogout } from '@/hooks/useAuth';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { favorites } = useFavoritesStore();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  useUser(); // Triggers session fetch on mount

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      window.location.href = '/login';
    }
  };

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      const isDark = document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  if (AUTH_ROUTES.includes(pathname)) {
    return null;
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const links = [
    { href: '/favorites', label: 'Favorites', icon: Heart, exact: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 pb-2">
      <div className="glass-panel mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-6 py-3 shadow-glass">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rail-blue text-white shadow-glow transition-transform group-hover:scale-105">
            <Train className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Rail<span className="text-rail-blue"> Track</span>
            </span>
            <span className="hidden sm:inline-block ml-2 rounded-full bg-rail-blue/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rail-blue">
              LIVE
            </span>
          </div>
        </Link>

        {/* Navigation Links, Theme Toggle & Auth */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Theme Toggle (Sun/Moon) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Day mode' : 'Switch to Dark mode'}
            title={theme === 'dark' ? 'Switch to Day mode' : 'Switch to Dark mode'}
            className="relative flex items-center gap-1.5 rounded-xl px-1.5 sm:px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            {mounted && theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
                <span className="hidden sm:inline">Day</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300 transition-transform duration-300 hover:-rotate-12" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {links.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            const isFav = href === '/favorites';

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex items-center gap-2 rounded-xl px-2 sm:px-3.5 py-2 text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
                {isFav && favorites.length > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
              </Link>
            );
          })}

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1.5 rounded-xl bg-rail-blue/10 px-3 py-2 text-xs font-bold text-rail-blue border border-rail-blue/20">
                <UserIcon className="h-3.5 w-3.5" />
                <span className="max-w-[100px] truncate">{user.fullName.split(' ')[0]}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                title="Sign Out"
                className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold bg-rail-blue text-white shadow-glow transition-all hover:bg-sky-600 active:scale-95',
                pathname === '/login' && 'ring-2 ring-rail-blue'
              )}
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

