import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

export const BreathingOrb: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <Icosahedron args={[2, 64]} ref={meshRef}>
      <MeshDistortMaterial
        color="#1a1a1a"
        roughness={0.1}
        metalness={0.8}
        distort={0.4}
        speed={2}
      />
    </Icosahedron>
  );
};
