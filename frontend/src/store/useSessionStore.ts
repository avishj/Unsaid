import { create } from 'zustand';
import { AppPhase } from '@shared/types';

interface SessionState {
  phase: AppPhase;
  sessionId: string | null;
  userId: string | null;
  transcript: string;
  partnerStatus: 'typing' | 'speaking' | 'idle';
  story: string[] | null;
  sentiment: string | null;
  isRecording: boolean;
  setPhase: (phase: AppPhase) => void;
  setSessionId: (id: string) => void;
  setUserId: (id: string) => void;
  setTranscript: (text: string) => void;
  appendTranscript: (text: string) => void;
  setPartnerStatus: (status: 'typing' | 'speaking' | 'idle') => void;
  setStory: (story: string[]) => void;
  setSentiment: (sentiment: string) => void;
  setIsRecording: (isRecording: boolean) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  phase: AppPhase.LANDING,
  sessionId: null,
  userId: null,
  transcript: '',
  partnerStatus: 'idle',
  story: null,
  sentiment: null,
  isRecording: false,
  setPhase: (phase: AppPhase) => set({ phase }),
  setSessionId: (sessionId: string) => set({ sessionId }),
  setUserId: (userId: string) => set({ userId }),
  setTranscript: (transcript: string) => set({ transcript }),
  appendTranscript: (text: string) => set((state) => ({ transcript: state.transcript + text })),
  setPartnerStatus: (partnerStatus: 'typing' | 'speaking' | 'idle') => set({ partnerStatus }),
  setStory: (story: string[]) => set({ story }),
  setSentiment: (sentiment: string) => set({ sentiment }),
  setIsRecording: (isRecording: boolean) => set({ isRecording }),
}));
