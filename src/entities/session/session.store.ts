import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from './session.types';

type SessionStore = {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  sessionExpired: boolean;
  setAccessToken: (accessToken: string | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setSessionExpired: (sessionExpired: boolean) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      loading: false,
      sessionExpired: false,
      setAccessToken: (accessToken) => set({ accessToken, loading: false }),
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setSessionExpired: (sessionExpired) => set({ sessionExpired }),
      clearSession: () => set({ accessToken: null, user: null, loading: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
);
