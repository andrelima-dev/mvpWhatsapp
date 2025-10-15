'use client';

import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from '@mvp/types';

type SessionData = {
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  } | null;
};

interface SessionState extends SessionData {
  setSession: (payload: SessionData) => void;
  clearSession: () => void;
}

const creator: StateCreator<SessionState> = set => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  setSession: (payload: SessionData) => set(payload),
  clearSession: () => set({ accessToken: null, refreshToken: null, user: null }),
});

export const useSessionStore = create<SessionState>()(
  persist(creator, {
    name: 'session-storage',
    partialize: (state): Partial<SessionState> => ({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
      user: state.user,
    }),
  }),
);
