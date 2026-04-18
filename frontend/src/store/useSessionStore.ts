import { create } from 'zustand';
import { AppPhase } from '@shared/types';

interface SessionState {
  phase: AppPhase;
  sessionId: string | null;
  userId: string | null;
  transcript: string;
  partnerStatus: 'typing' | 'speaking' | 'idle';
  story: string[] | null;
  setPhase: (phase: AppPhase) => void;
  setSessionId: (id: string) => void;
  setUserId: (id: string) => void;
  setTranscript: (text: string) => void;
  setPartnerStatus: (status: 'typing' | 'speaking' | 'idle') => void;
  setStory: (story: string[]) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  phase: AppPhase.LANDING,
  sessionId: null,
  userId: null,
  transcript: '',
  partnerStatus: 'idle',
  story: null,
  setPhase: (phase: AppPhase) => set({ phase }),
  setSessionId: (sessionId: string) => set({ sessionId }),
  setUserId: (userId: string) => set({ userId }),
  setTranscript: (transcript: string) => set({ transcript }),
  setPartnerStatus: (partnerStatus: 'typing' | 'speaking' | 'idle') => set({ partnerStatus }),
  setStory: (story: string[]) => set({ story }),
}));
