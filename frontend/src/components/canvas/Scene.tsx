import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { BreathingOrb } from './BreathingOrb';

export const Scene: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-background">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <BreathingOrb />
        </Suspense>
      </Canvas>
    </div>
  );
};
