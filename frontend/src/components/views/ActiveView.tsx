import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useSessionStore } from '@store/useSessionStore';
import { WSMessageType } from '@shared/types';
import { AppPhase } from '@shared/types';

interface ActiveViewProps {
  sendMessage: (type: WSMessageType, payload: any) => void;
}

const zenPrompts = [
  "take a breath.",
  "i hear you.",
  "is there more?",
  "what are you feeling right now?",
  "take your time.",
  "it's safe here.",
  "let it out.",
];

export const ActiveView: React.FC<ActiveViewProps> = ({ sendMessage }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [zenPrompt, setZenPrompt] = useState<string | null>(null);
  const { transcript, setTranscript, partnerStatus, setPhase, isRecording, setIsRecording } = useSessionStore();
  const [useVoice, setUseVoice] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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
    }, 6000);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
    sendMessage(WSMessageType.STATUS_UPDATE, { status: 'typing' });
    resetSilenceTimer();
  };

  const handleSubmit = () => {
    if (!transcript.trim()) return;
    sendMessage(WSMessageType.SUBMIT_TRANSCRIPT, { text: transcript });
    setPhase(AppPhase.SYNTHESIS);
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center h-full gap-6 px-6 max-w-2xl mx-auto w-full">
      {partnerStatus !== 'idle' && (
        <div className="flex items-center gap-2 text-foreground/30 text-xs tracking-[0.2em] uppercase">
          <span className="w-2 h-2 rounded-full bg-accent/60 animate-pulse" />
          partner is {partnerStatus}
        </div>
      )}

      {zenPrompt && (
        <p className="text-foreground/30 text-sm font-serif italic tracking-wide animate-pulse">
          {zenPrompt}
        </p>
      )}

      <textarea
        ref={textRef}
        value={transcript}
        onChange={handleTextChange}
        placeholder="say what you never could..."
        className="active-textarea w-full flex-1 max-h-[50vh] min-h-[200px] bg-transparent border-none outline-none resize-none text-foreground/80 text-lg md:text-xl font-serif leading-relaxed tracking-wide placeholder:text-foreground/15"
        autoFocus
      />

      <div className="active-controls flex items-center gap-4 w-full justify-center pb-8">
        <button
          onClick={handleSubmit}
          disabled={!transcript.trim()}
          className="px-8 py-3 border border-foreground/10 rounded-full text-foreground/60 text-sm tracking-[0.2em] uppercase backdrop-blur-sm bg-white/[0.02] hover:bg-white/[0.05] hover:border-foreground/20 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
        >
          i've said it all
        </button>
      </div>
    </div>
  );
};

export default ActiveView;
