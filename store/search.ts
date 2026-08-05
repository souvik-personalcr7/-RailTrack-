import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchResult } from '@/types/train';

interface SearchState {
  recentSearches: SearchResult[];
  addRecentSearch: (train: SearchResult) => void;
  clearRecentSearches: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [],
      addRecentSearch: (train) =>
        set((state) => {
          const filtered = state.recentSearches.filter(
            (t) => t.id !== train.id && t.number !== train.number
          );
          return { recentSearches: [train, ...filtered].slice(0, 6) };
        }),
      clearRecentSearches: () => set({ recentSearches: [] }),
      isSearchOpen: false,
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
    }),
    {
      name: 'railtrack-recent-searches',
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
