import React from 'react';
import { LinkCard } from '../ui/LinkCard';

export const WaitingView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      <LinkCard />
      <p className="text-white/40 font-sans tracking-widest uppercase text-[10px] animate-pulse">
        Waiting for partner to join...
      </p>
    </div>
  );
};
