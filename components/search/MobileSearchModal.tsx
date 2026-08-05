'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Train,
  ArrowRight,
  Loader2,
  AlertCircle,
  History,
  Sparkles,
} from 'lucide-react';
import { useSearchStore } from '@/store/search';
import { useTrainSearch } from '@/hooks/useTrainSearch';
import { SearchResult } from '@/types/train';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export function MobileSearchModal() {
  const router = useRouter();
  const { isSearchOpen, closeSearch, recentSearches, addRecentSearch } = useSearchStore();
  const [inputValue, setInputValue] = useState('');
  const debouncedQuery = useDebounce(inputValue, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults, isLoading, isError } = useTrainSearch(debouncedQuery);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setInputValue('');
    }
  }, [isSearchOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  const handleSelectTrain = (train: SearchResult) => {
    addRecentSearch(train);
    closeSearch();
    setInputValue('');
    router.push(`/train/${train.number}`);
  };

  const handleSearchSubmit = () => {
    const q = inputValue.trim();
    if (!q) return;
    const first = searchResults?.[0];
    if (first && (first.number === q || first.name.toLowerCase().includes(q.toLowerCase()))) {
      handleSelectTrain(first);
    } else {
      closeSearch();
      setInputValue('');
      router.push(`/train/${q}`);
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 w-full max-h-[85vh] flex flex-col rounded-t-[2.5rem] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 p-5 shadow-2xl overflow-hidden"
          >
            {/* Sheet Handle */}
            <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700 mb-4 flex-shrink-0" />

            {/* Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rail-blue/10 text-rail-blue font-bold">
                  <Train className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Search Trains
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Live status, route & delays
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeSearch}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input Field */}
            <div className="mt-4 relative flex-shrink-0">
              <div className="glass-panel flex items-center gap-2 rounded-2xl p-2 pl-4 border border-rail-blue/40 shadow-glow ring-1 ring-rail-blue/20">
                <Search className="h-4 w-4 text-rail-blue flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchSubmit();
                    }
                  }}
                  placeholder="Enter train number or name..."
                  className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 outline-none dark:text-white dark:placeholder-slate-500"
                />

                {inputValue && (
                  <button
                    type="button"
                    onClick={() => setInputValue('')}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="flex items-center gap-1 rounded-xl bg-rail-blue px-3.5 py-2 text-xs font-bold text-white shadow-glow transition-all hover:bg-sky-600 active:scale-95 flex-shrink-0"
                >
                  {isLoading && inputValue ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span>Search</span>
                  )}
                </button>
              </div>
            </div>

            {/* Popular Quick Chips */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs flex-shrink-0 scrollbar-none">
              <span className="text-slate-400 font-semibold text-[11px] flex-shrink-0 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-rail-amber" /> Popular:
              </span>
              {['12951', '22436', '12301', '12621'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setInputValue(num);
                    inputRef.current?.focus();
                  }}
                  className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 font-mono font-bold text-slate-700 dark:text-slate-300 hover:bg-rail-blue hover:text-white transition-colors flex-shrink-0"
                >
                  #{num}
                </button>
              ))}
            </div>

            {/* Scrollable Results & History Container */}
            <div className="mt-3 flex-1 overflow-y-auto space-y-3 pr-1">
              {/* Direct train number match action */}
              {inputValue && /^\d{4,5}$/.test(inputValue.trim()) && (
                <button
                  type="button"
                  onClick={() => {
                    closeSearch();
                    router.push(`/train/${inputValue.trim()}`);
                  }}
                  className="w-full flex items-center justify-between gap-3 rounded-xl p-3 bg-rail-blue/10 border border-rail-blue/30 text-rail-blue text-xs font-bold hover:bg-rail-blue hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Train className="h-4 w-4" />
                    <span>Track train #{inputValue.trim()} live →</span>
                  </div>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Error State */}
              {isError && (
                <div className="flex items-center gap-2 py-4 text-center justify-center text-xs text-rose-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>Unable to fetch train information. Please try again.</span>
                </div>
              )}

              {/* Loading skeleton */}
              {isLoading && (
                <div className="space-y-2 py-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-14 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse"
                    />
                  ))}
                </div>
              )}

              {/* No search results */}
              {!isLoading && !isError && inputValue && searchResults && searchResults.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-500">
                  No trains found matching &quot;<strong>{inputValue}</strong>&quot;.
                </div>
              )}

              {/* Matching Live Results */}
              {searchResults && searchResults.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Matching Trains
                  </p>
                  {searchResults.map((train) => (
                    <button
                      key={train.id}
                      type="button"
                      onClick={() => handleSelectTrain(train)}
                      className="w-full glass-panel group flex items-center justify-between rounded-2xl p-3 text-left transition-all hover:bg-rail-blue/10 hover:border-rail-blue/40"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-rail-blue/10 text-rail-blue group-hover:bg-rail-blue group-hover:text-white transition-colors">
                          <Train className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-rail-blue/15 px-2 py-0.5 font-mono text-xs font-bold text-rail-blue dark:bg-rail-blue/25 flex-shrink-0">
                              #{train.number}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                              {train.name}
                            </span>
                          </div>
                          {(train.origin.name || train.destination.name) && (
                            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              <span>{train.origin.name}</span>
                              <ArrowRight className="h-2.5 w-2.5 flex-shrink-0 text-slate-400" />
                              <span>{train.destination.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0 group-hover:text-rail-blue group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              )}

              {/* Recent Searches (when search query is empty) */}
              {!inputValue && recentSearches.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <History className="h-3 w-3 text-rail-blue" />
                      Recent Searches
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {recentSearches.map((train) => (
                      <button
                        key={train.id}
                        type="button"
                        onClick={() => handleSelectTrain(train)}
                        className="w-full glass-panel group flex items-center justify-between rounded-xl p-2.5 text-left transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Train className="h-4 w-4 text-rail-blue flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="font-mono text-[11px] font-bold text-rail-blue">
                              #{train.number}
                            </span>
                            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                              {train.name}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
