import { create } from 'zustand';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt?: string;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  setUser: (user: UserProfile | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthModalOpen: false,
  setUser: (user) => set({ user, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));
