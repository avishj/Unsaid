import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useSessionStore } from '@store/useSessionStore';
import { useWebSocket } from '@hooks/useWebSocket';
import { AppPhase } from '@shared/types';
import { LandingView } from './views/LandingView';
import { WaitingView } from './views/WaitingView';
import { ActiveView } from './views/ActiveView';
import { SynthesisView } from './views/SynthesisView';
import { RevealView } from './views/RevealView';
import { useAmbientDrone } from '@hooks/useAmbientDrone';

const PhaseRouter: React.FC = () => {
  const phase = useSessionStore((state) => state.phase);
  const prevPhaseRef = useRef(phase);
  const contentRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useWebSocket();
  
  useAmbientDrone();

  useLayoutEffect(() => {
    if (prevPhaseRef.current !== phase && contentRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }
      );
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  const renderPhase = () => {
    switch (phase) {
      case AppPhase.LANDING:
        return <LandingView />;
      case AppPhase.WAITING:
        return <WaitingView />;
      case AppPhase.ACTIVE:
        return <ActiveView sendMessage={sendMessage} />;
      case AppPhase.SYNTHESIS:
        return <SynthesisView />;
      case AppPhase.REVEAL:
        return <RevealView />;
      case AppPhase.ERROR:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="font-serif text-foreground/40 text-lg tracking-widest text-center">something went wrong.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={contentRef} className="relative z-10 h-full w-full flex items-center justify-center">
      {renderPhase()}
    </div>
  );
};

export default PhaseRouter;
