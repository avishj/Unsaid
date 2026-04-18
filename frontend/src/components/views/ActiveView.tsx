import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useSessionStore } from '@store/useSessionStore';
import { WSMessageType, AppPhase } from '@shared/types';
import { useAudioVisualizer } from '@hooks/useAudioVisualizer';

interface ActiveViewProps {
  sendMessage: (type: WSMessageType, payload: any) => void;
}

const zenPrompts = [
  "take a breath.",
  "i hear you.",
  "is there more to that feeling?",
  "what are you feeling right now?",
  "take your time.",
  "it's safe here.",
  "let it out, everything is heard.",
];

export const ActiveView: React.FC<ActiveViewProps> = ({ sendMessage }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [zenPrompt, setZenPrompt] = useState<string | null>(null);
  const { transcript, setTranscript, partnerStatus, setPhase, setIsRecording } = useSessionStore();
  
  // Real-time audio intensity for the orb
  const rms = useAudioVisualizer();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.active-textarea', {
        opacity: 0,
        y: 30,
        duration: 1.4,
        ease: 'expo.out',
      });
      gsap.from('.active-controls', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.5,
        ease: 'expo.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    silenceTimer.current = setTimeout(() => {
      const prompt = zenPrompts[Math.floor(Math.random() * zenPrompts.length)];
      setZenPrompt(prompt);
      setTimeout(() => setZenPrompt(null), 5000);
    }, 8000);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
    sendMessage(WSMessageType.STATUS_UPDATE, { status: e.target.value ? 'typing' : 'idle' });
    resetSilenceTimer();
  };

  const handleSubmit = () => {
    if (!transcript.trim()) return;
    setIsRecording(false);
    sendMessage(WSMessageType.SUBMIT_TRANSCRIPT, { text: transcript });
    setPhase(AppPhase.SYNTHESIS);
  };

  // Auto-start recording on mount for the visualizer
  useEffect(() => {
    setIsRecording(true);
    return () => setIsRecording(false);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center h-full gap-6 px-6 max-w-2xl mx-auto w-full relative z-20">
      {partnerStatus !== 'idle' && (
        <div className="flex items-center gap-2 text-foreground/30 text-[10px] tracking-[0.3em] uppercase absolute top-12">
          <span className="w-1.5 h-1.5 rounded-full bg-accent/40 animate-ping" />
          partner is {partnerStatus}
        </div>
      )}

      {zenPrompt && (
        <p className="text-foreground/30 text-sm font-serif italic tracking-wide animate-pulse absolute top-24">
          {zenPrompt}
        </p>
      )}

      <textarea
        ref={textRef}
        value={transcript}
        onChange={handleTextChange}
        placeholder="say what you never could..."
        className="active-textarea w-full flex-1 max-h-[40vh] min-h-[150px] bg-transparent border-none outline-none resize-none text-foreground/70 text-xl md:text-2xl font-serif leading-relaxed tracking-wide placeholder:text-foreground/10 text-center mt-20"
        autoFocus
      />

      <div className="active-controls flex items-center gap-4 w-full justify-center pb-12">
        <button
          onClick={handleSubmit}
          disabled={!transcript.trim()}
          className="px-10 py-4 border border-white/10 rounded-full text-foreground/40 text-[10px] tracking-[0.3em] uppercase backdrop-blur-md bg-white/[0.02] hover:bg-white/[0.05] hover:text-foreground/80 hover:border-white/20 transition-all duration-700 disabled:opacity-10 cursor-pointer"
        >
          i've said enough
        </button>
      </div>
    </div>
  );
};
