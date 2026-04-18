import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { BreathingOrb } from './BreathingOrb';

export const Scene: React.FC = () => {
  const [fov, setFov] = useState(45);

  useEffect(() => {
    const handleResize = () => {
      setFov(window.innerWidth < 768 ? 60 : 45);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-background">
      <Canvas camera={{ position: [0, 0, 5], fov }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <BreathingOrb />
        </Suspense>
        <EffectComposer>
          <Bloom 
            intensity={1.5} 
            luminanceThreshold={0.1} 
            luminanceSmoothing={0.9} 
          />
          <Noise opacity={0.05} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
