'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useMemo } from 'react';
import { LiveJourney } from '@/types/train';
import { WeatherData } from '@/lib/openweather';

export interface StationWeatherData {
  current?: WeatherData;
  next?: WeatherData;
  dest?: WeatherData;
}

export function useWeather(journey: LiveJourney) {
  // Memoize key stations to keep query key references stable
  const stations = useMemo(() => {
    if (!journey || !journey.stations || journey.stations.length === 0) {
      return { currSt: undefined, nextSt: undefined, destSt: undefined };
    }
    const currSt = journey.currentStation || journey.previousStation || journey.stations[0];
    const nextSt = journey.nextStation || journey.stations[journey.stations.length - 1];
    const destSt = journey.stations[journey.stations.length - 1];
    return { currSt, nextSt, destSt };
  }, [journey]);

  const { currSt, nextSt, destSt } = stations;
  const trainIdentifier = journey?.trainId || journey?.number || 'default';

  // Construct stable query key for deduplication and caching
  const queryKey = useMemo(
    () => ['weather', trainIdentifier, currSt?.code, nextSt?.code, destSt?.code],
    [trainIdentifier, currSt?.code, nextSt?.code, destSt?.code]
  );

  const query = useQuery<StationWeatherData>({
    queryKey,
    queryFn: async ({ signal }) => {
      if (!currSt && !nextSt && !destSt) {
        return {};
      }

      const fetchStation = async (st?: typeof currSt) => {
        if (
          !st ||
          typeof st.lat !== 'number' ||
          typeof st.lng !== 'number' ||
          st.lat === 0 ||
          st.lng === 0 ||
          isNaN(st.lat) ||
          isNaN(st.lng)
        ) {
          if (process.env.NODE_ENV === 'development' && st?.code) {
            console.warn(
              `[useWeather] Skipping weather API call for station ${st.code} (${st.name}) due to missing/invalid coordinates: lat=${st.lat}, lng=${st.lng}`
            );
          }
          return undefined;
        }

        try {
          const res = await fetch(
            `/api/weather?lat=${st.lat}&lng=${st.lng}&name=${encodeURIComponent(
              st.name || ''
            )}&code=${encodeURIComponent(st.code || '')}`,
            { signal }
          );
          if (!res.ok) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(
                `[useWeather] Weather fetch failed with status ${res.status} for station ${st.code}`
              );
            }
            return undefined;
          }
          const json = await res.json();
          return json.success ? (json.data as WeatherData) : undefined;
        } catch (err: any) {
          if (err.name === 'AbortError') {
            throw err;
          }
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[useWeather] Weather request error for station ${st.code}:`, err);
          }
          return undefined;
        }
      };

      const [current, next, dest] = await Promise.all([
        fetchStation(currSt),
        fetchStation(nextSt),
        fetchStation(destSt),
      ]);

      return { current, next, dest };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache freshness
    gcTime: 15 * 60 * 1000, // 15 minutes garbage collection time
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
    placeholderData: keepPreviousData,
    enabled: Boolean(journey && journey.stations && journey.stations.length > 0),
  });

  return {
    weatherData: query.data || {},
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
