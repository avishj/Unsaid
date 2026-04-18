import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export const SynthesisView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.synthesis-text', {
        opacity: 0,
        y: 30,
        duration: 2,
        ease: 'expo.out',
      });
      gsap.to('.synthesis-dots span', {
        opacity: 0.2,
        stagger: 0.4,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center h-full gap-6 px-6">
      <p className="synthesis-text font-serif text-xl md:text-2xl font-extralight tracking-widest text-foreground/50 text-center">
        weaving your stories together
      </p>
      <div className="synthesis-dots flex gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
      </div>
    </div>
  );
};

export default SynthesisView;
