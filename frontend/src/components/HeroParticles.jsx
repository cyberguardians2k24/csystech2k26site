import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
const PARTICLE_COUNT = isTouch ? 400 : 1500;

function Particles({ count = PARTICLE_COUNT }) {
  const ref = useRef();
  const posRef = useRef();

  const { initialPositions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const wandaRed = new THREE.Color('#C41E3A');
    const gold = new THREE.Color('#FFD700');
    const darkRed = new THREE.Color('#8B0000');
    const cyan = new THREE.Color('#00FFFF');
    const palette = [wandaRed, wandaRed, wandaRed, darkRed, gold, gold, cyan];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 40 - 10;

      const c = palette[Math.floor(Math.random() * palette.length)];
      const t = 0.5 + Math.random() * 0.5;
      colors[i3]     = c.r * t;
      colors[i3 + 1] = c.g * t;
      colors[i3 + 2] = c.b * t;
      
      sizes[i] = Math.random() * 0.25 + 0.05;
    }
    return { initialPositions: positions, colors, sizes };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current || !posRef.current) return;
    const t = clock.getElapsedTime();
    
    ref.current.rotation.y = t * 0.03;
    ref.current.rotation.z = Math.sin(t * 0.1) * 0.03;
    
    const arr = posRef.current.array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3 + 2] += 0.05 + (i % 10) * 0.01;
      arr[i3 + 1] += 0.01 + Math.sin(t + i) * 0.005;
      arr[i3] += Math.sin(t * 0.8 + i) * 0.01;
      
      if (arr[i3 + 2] > 6 || arr[i3 + 1] > 15) {
        arr[i3 + 2] = -30 - Math.random() * 10;
        arr[i3 + 1] = (Math.random() - 0.5) * 30;
        arr[i3] = (Math.random() - 0.5) * 40;
      }
    }
    posRef.current.needsUpdate = true;
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
    <div className="absolute inset-0 z-[2] pointer-events-none mix-blend-screen overflow-hidden">
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ boxShadow: 'inset 0 0 100px 50px rgba(0,0,0,0.9)' }} />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={isTouch ? 1 : [1, 1.5]}
      >
        <Particles count={PARTICLE_COUNT} />
      </Canvas>
    </div>
  );
}