import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

export const BreathingOrb: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.distort = 0.4 + Math.sin(time) * 0.1;
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.1;
      meshRef.current.rotation.y = time * 0.15;
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Icosahedron args={[2, 64]} ref={meshRef}>
      <MeshDistortMaterial
        ref={materialRef}
        color="#1a1a1a"
        roughness={0.1}
        metalness={0.8}
        distort={0.4}
        speed={2}
      />
    </Icosahedron>
  );
};
