import React, { useState, useEffect } from 'react';
import { useSessionStore } from '@store/useSessionStore';

export const LinkCard: React.FC = () => {
  const sessionId = useSessionStore((state) => state.sessionId);
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/${sessionId || ''}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center space-y-4 max-w-md">
      <p className="text-white/60 font-sans tracking-widest uppercase text-xs">
        Invite the other person
      </p>
      <div className="bg-black/40 border border-white/5 p-4 rounded-xl w-full break-all font-mono text-sm text-white/80 select-all">
        {url}
      </div>
      <button 
        onClick={handleCopy}
        className="text-accent hover:text-accent/80 transition-colors font-sans tracking-widest uppercase text-xs"
      >
        {copied ? 'Copied' : 'Copy Link'}
      </button>
    </div>
  );
};
