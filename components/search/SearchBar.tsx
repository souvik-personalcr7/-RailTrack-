'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch?: () => void;
  onFocus?: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  onFocus,
  inputRef,
  className,
  placeholder = 'Enter train number or name ...',
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div
      className={cn(
        'glass-panel relative flex items-center rounded-2xl p-2 pl-4 shadow-glass transition-all duration-300 focus-within:border-rail-blue/50 focus-within:shadow-glow',
        className
      )}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 outline-none dark:text-white dark:placeholder-slate-500"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex-shrink-0 mr-1"
          title="Clear input"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Clickable Search icon button on the right side */}
      <button
        type="button"
        onClick={() => onSearch && onSearch()}
        className="flex items-center gap-1.5 rounded-xl bg-rail-blue px-3.5 py-2 text-xs font-bold text-white shadow-glow transition-all hover:bg-sky-600 active:scale-95 flex-shrink-0 cursor-pointer"
        title="Search Train"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </div>
  );
}

