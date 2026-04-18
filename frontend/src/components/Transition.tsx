import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

interface TransitionProps {
  children: React.ReactNode;
  toggle: any;
}

const Transition: React.FC<TransitionProps> = ({ children, toggle }) => {
  const el = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(el.current, {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
      });
    }, el);

    return () => ctx.revert();
  }, [toggle]);

  return (
    <div ref={el} className="h-full w-full">
      {children}
    </div>
  );
};

export default Transition;
