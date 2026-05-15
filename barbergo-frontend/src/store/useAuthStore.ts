import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from '@/types';

/* ═══════════════════════════════════════════
   Auth Store — Zustand + localStorage persist
   Stores the JWT and user info from AuthResponse
   ═══════════════════════════════════════════ */

interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: Role;
  profilePicture?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      updateUser: (user) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : null,
        })),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
