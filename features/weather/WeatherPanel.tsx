'use client';

import React, { memo } from 'react';
import { CloudSun, RefreshCw } from 'lucide-react';
import { LiveJourney } from '@/types/train';
import { WeatherCard } from './WeatherCard';
import { useWeather } from './useWeather';
import { cn } from '@/utils/cn';

interface WeatherPanelProps {
  journey: LiveJourney;
}

export const WeatherPanel = memo(function WeatherPanel({ journey }: WeatherPanelProps) {
  const { weatherData, isLoading, isFetching, refetch } = useWeather(journey);

  if (isLoading && !weatherData.current) {
    return (
      <div className="glass-panel rounded-3xl p-6 text-center text-xs text-slate-400">
        Loading live OpenWeather intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-sm sm:text-base md:text-lg text-slate-900 dark:text-white whitespace-nowrap min-w-0">
          <CloudSun className="h-5 w-5 shrink-0 text-amber-500" />
          <span className="whitespace-nowrap">Smart Travel Companion Weather</span>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white glass-panel rounded-xl transition-all disabled:opacity-50"
          title="Refresh Weather Data"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin text-amber-500')} />
          {/* <span>{isFetching ? 'Refreshing...' : 'Refresh'}</span> */}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {weatherData.current && (
          <WeatherCard label="Current Station Weather" weather={weatherData.current} />
        )}
        {weatherData.next && (
          <WeatherCard label="Next Station Weather" weather={weatherData.next} />
        )}
        {weatherData.dest && (
          <WeatherCard label="Destination Weather" weather={weatherData.dest} />
        )}
      </div>
    </div>
  );
});

