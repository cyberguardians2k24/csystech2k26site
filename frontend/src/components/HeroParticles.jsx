import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 220;

function Particles() {
  const ref = useRef();

  const posRef = useRef();

  const { initialPositions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const wandaRed = new THREE.Color('#C41E3A');
    const gold = new THREE.Color('#FFD700');
    const darkRed = new THREE.Color('#8B0000');
    const palette = [wandaRed, wandaRed, darkRed, gold];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 25;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      const c = palette[Math.floor(Math.random() * palette.length)];
      const t = 0.5 + Math.random() * 0.5;
      colors[i3]     = c.r * t;
      colors[i3 + 1] = c.g * t;
      colors[i3 + 2] = c.b * t;
      
      sizes[i] = Math.random() * 0.15 + 0.05;
    }
    return { initialPositions: positions, colors, sizes };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    
    // Slow overall mesh rotation
    ref.current.rotation.y = t * 0.04;
    ref.current.rotation.z = Math.sin(t * 0.2) * 0.05;
    
    // Ember drift logic
    if (posRef.current) {
      const arr = posRef.current.array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        // Drift upwards
        arr[i3 + 1] += 0.015 + Math.sin(t + i) * 0.005;
        // Swirl / sway x and z
        arr[i3] += Math.sin(t * 0.5 + i) * 0.008;
        arr[i3 + 2] += Math.cos(t * 0.3 + i) * 0.005;
        
        // Wrap around vertically
        if (arr[i3 + 1] > 10) {
          arr[i3 + 1] = -10;
          arr[i3] = (Math.random() - 0.5) * 25;
        }
      }
      posRef.current.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" ref={posRef} args={[initialPositions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.72}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroParticles() {
  return (
    <div className="absolute inset-0 z-[2] pointer-events-none opacity-90 mix-blend-screen">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 65 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
