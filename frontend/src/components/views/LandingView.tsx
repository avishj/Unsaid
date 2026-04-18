import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useSessionStore } from '@store/useSessionStore';
import { useWebSocket } from '@hooks/useWebSocket';
import { AppPhase, WSMessageType } from '@shared/types';

export const LandingView: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const { sendMessage } = useWebSocket();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.headline', {
        opacity: 0,
        y: 50,
        duration: 2,
        ease: 'expo.out',
      });
      gsap.from('.cta', {
        opacity: 0,
        duration: 1,
        delay: 1,
        ease: 'power2.inOut',
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="flex flex-col items-center justify-center space-y-12">
      <h1 className="headline text-6xl md:text-8xl font-serif font-extralight tracking-widest text-foreground">
        Unsaid
      </h1>
      <p className="cta text-foreground/60 font-sans tracking-widest uppercase text-sm text-center">
        Every conflict has two stories.<br/>Find where they meet.
      </p>
      <button 
        onClick={() => sendMessage(WSMessageType.CREATE_ROOM, {})}
        className="cta px-8 py-3 border border-foreground/20 bg-foreground/5 backdrop-blur-sm rounded-full 
                   text-foreground/80 hover:bg-foreground/10 hover:border-foreground/40 
                   transition-all duration-500 font-sans tracking-widest uppercase text-xs cursor-pointer"
      >
        Start Session
      </button>
    </div>
  );
};
