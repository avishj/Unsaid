import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { useSessionStore } from '@store/useSessionStore';

export const RevealView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const story = useSessionStore((s) => s.story);
  const [currentIndex, setCurrentState] = useState(0);

  useLayoutEffect(() => {
    if (!story?.length) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from('.reveal-intro', {
        opacity: 0,
        y: 20,
        duration: 2,
        ease: 'expo.out',
      });

      story.forEach((_, i) => {
        tl.fromTo(
          `.story-line-${i}`,
          { opacity: 0, y: 10 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1.5, 
            ease: 'power2.out',
          },
          "+=1"
        );
        
        if (i < story.length - 1) {
          tl.to(`.story-line-${i}`, {
            opacity: 0,
            duration: 1,
            ease: 'power2.in',
          }, "+=3");
        }
      });

      tl.from('.reveal-outro', {
        opacity: 0,
        duration: 2,
        ease: 'expo.out',
      }, "+=2");
    }, containerRef);

    return () => ctx.revert();
  }, [story]);

  if (!story) return null;

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center h-full gap-10 px-6 max-w-2xl mx-auto relative">
      <p className="reveal-intro font-sans text-[10px] tracking-[0.4em] uppercase text-foreground/20 absolute top-12">
        the shared truth
      </p>
      
      <div className="flex items-center justify-center min-h-[200px]">
        {story.map((line, i) => (
          <p
            key={i}
            className={`story-line-${i} absolute font-serif text-xl md:text-3xl font-extralight leading-relaxed tracking-wide text-foreground/80 text-center opacity-0`}
          >
            {line}
          </p>
        ))}
      </div>

      <div className="reveal-outro flex flex-col items-center gap-6 absolute bottom-12">
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-foreground/40">
          you are not as far apart as you thought.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="text-foreground/20 hover:text-foreground/60 transition-colors font-sans text-[9px] tracking-[0.2em] uppercase"
        >
          close room
        </button>
      </div>
    </div>
  );
};
