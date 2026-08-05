"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Train,
  Heart,
  MapPin,
  ShieldCheck,
  Radio,
  ExternalLink,
  Github,
  Sparkles,
  Navigation,
  Clock,
  Compass,
} from "lucide-react";

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function Footer() {
  const pathname = usePathname();

  if (AUTH_ROUTES.includes(pathname)) {
    return null;
  }
  return (
    <footer className="w-full px-4 pt-8 pb-28 md:pb-8 text-slate-600 dark:text-slate-400">
      <div className="glass-panel mx-auto max-w-7xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-glass border border-slate-200/60 dark:border-slate-800/60">
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 pb-8 border-b border-slate-200/80 dark:border-slate-800/80">
          {/* Column 1: Brand & Operational Status */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rail-blue text-white shadow-glow transition-transform group-hover:scale-105">
                <Train className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Rail<span className="text-rail-blue"> Track</span>
                </span>
                <span className="ml-2 rounded-full bg-rail-blue/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rail-blue">
                  LIVE
                </span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Next-generation live Indian Railways train tracking platform
              featuring vector maps, delay analytics, weather intelligence, and
              route insights.
            </p>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Systems Operational & Live Syncing</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Navigation className="h-3.5 w-3.5 text-rail-blue" />
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-1.5 hover:text-rail-blue dark:hover:text-rail-blue transition-colors"
                >
                  <Train className="h-3 w-3 text-slate-400" />
                  <span>Live Train Search</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="flex items-center gap-1.5 hover:text-rail-blue dark:hover:text-rail-blue transition-colors"
                >
                  <Heart className="h-3 w-3 text-rose-500" />
                  <span>Saved Favorite Trains</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?search=1"
                  className="flex items-center gap-1.5 hover:text-rail-blue dark:hover:text-rail-blue transition-colors"
                >
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>Station Live Boards</span>
                </Link>
              </li>
              <li>
                <a
                  href="//www.irctc.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-rail-blue dark:hover:text-rail-blue transition-colors inline-flex"
                >
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                  <span>IRCTC Official Ticket Booking</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-rail-cyan" />
              Key Capabilities
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li className="flex items-center gap-1.5">
                <Compass className="h-3 w-3 text-rail-blue" />
                <span>MapLibre Vector Map Engine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-rail-amber" />
                <span>Punctuality & Delay Analytics</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Radio className="h-3 w-3 text-rail-emerald" />
                <span>Live Weather & Terrain Insights</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-rail-cyan" />
                <span>Instant Offline Route Caching</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Disclaimer & Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-rail-blue" />
              Information & Connect
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 bg-slate-100/60 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
              <strong className="text-slate-700 dark:text-slate-300">
                Disclaimer:
              </strong>{" "}
              RailTrack is an independent informational project and is not
              affiliated with, endorsed by, or connected to Indian Railways,
              CRIS, or IRCTC.
            </p>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} RailTrack. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built for{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Indian Railways
              </span>{" "}
              passengers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
