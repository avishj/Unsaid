import React from 'react';
import { useSessionStore } from '@store/useSessionStore';
import { AppPhase } from '@shared/types';

const PhaseRouter: React.FC = () => {
  const phase = useSessionStore((state) => state.phase);

  return (
    <div className="relative h-screen w-screen flex items-center justify-center">
      {phase === AppPhase.LANDING && <div>Landing (Coming Soon)</div>}
      {phase === AppPhase.WAITING && <div>Waiting for partner...</div>}
      {phase === AppPhase.ACTIVE && <div>Active Session (Unburdening)</div>}
      {phase === AppPhase.SYNTHESIS && <div>Synthesizing shared truth...</div>}
      {phase === AppPhase.REVEAL && <div>Revelation</div>}
      {phase === AppPhase.ERROR && <div>An error occurred.</div>}
    </div>
  );
};

export default PhaseRouter;
