import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import { useSessionStore } from '@store/useSessionStore';
import { AppPhase } from '@shared/types';

export const BreathingOrb: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const { phase, sentiment } = useSessionStore();

  const config = useMemo(() => {
    switch (phase) {
      case AppPhase.SYNTHESIS:
        return { color: '#333333', speed: 5, distort: 0.8 };
      case AppPhase.REVEAL:
        return { color: sentiment === 'warm' ? '#443322' : '#223344', speed: 1.5, distort: 0.3 };
      default:
        return { color: '#1a1a1a', speed: 2, distort: 0.4 };
    }
  }, [phase, sentiment]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.distort = THREE.MathUtils.lerp(
        materialRef.current.distort,
        config.distort + Math.sin(time) * 0.1,
        0.05
      );
      materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, config.speed, 0.05);
      materialRef.current.color.lerp(new THREE.Color(config.color), 0.05);
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.1;
      meshRef.current.rotation.y = time * 0.15;
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
      
      if (phase === AppPhase.ACTIVE) {
        meshRef.current.position.lerp(new THREE.Vector3(1.5, 1, 0), 0.05);
      } else {
        meshRef.current.position.lerp(new THREE.Vector3(0, 0, 0), 0.05);
      }
    }
  });

  return (
    <Icosahedron args={[2, 64]} ref={meshRef}>
      <MeshDistortMaterial
        ref={materialRef}
        color={config.color}
        roughness={0.1}
        metalness={0.8}
        distort={config.distort}
        speed={config.speed}
      />
    </Icosahedron>
  );
};
