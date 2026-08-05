'use client';

import { useQuery } from '@tanstack/react-query';
import { LiveJourney } from '@/types/train';
import { ApiResponse } from '@/types/api';

async function fetchLiveJourney(trainId: string): Promise<LiveJourney> {
  const res = await fetch(`/api/train/${trainId}`);
  const json: ApiResponse<LiveJourney> = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.error || 'Failed to fetch live journey');
  }
  return json.data;
}

export function useLiveJourney(trainId: string) {
  return useQuery({
    queryKey: ['liveJourney', trainId],
    queryFn: () => fetchLiveJourney(trainId),
    enabled: Boolean(trainId),
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}



