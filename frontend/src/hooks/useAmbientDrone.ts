import { useEffect, useRef } from 'react';

export const useAmbientDrone = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const startDrone = () => {
    if (audioCtxRef.current) return;

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const createOscillator = (freq: number, type: OscillatorType, volume: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      return { osc, gain };
    };

    // Low drone frequencies
    createOscillator(60, 'sine', 0.1);
    createOscillator(62, 'sine', 0.05);
    createOscillator(120, 'sine', 0.02);
  };

  useEffect(() => {
    const handleInteraction = () => {
      startDrone();
      window.removeEventListener('click', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);
};
