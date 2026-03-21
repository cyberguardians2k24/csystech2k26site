/**
 * HeroThreeScene — lazy-loaded Three.js canvas for the Hero section.
 * Keeping this in its own file lets `vendor-three` chunk load asynchronously
 * so it never blocks the first paint of the page.
 */
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EnergyPlatform, HolographicLogo, TriangularMeshCage, WakandaParticles } from './ThreeHologram';

export default function HeroThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 6.2], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <fog attach="fog" args={['#05010a', 5, 14]} />
      {/* Deep crimson sky, dark red ground */}
      <hemisphereLight skyColor="#8B0000" groundColor="#0a0200" intensity={0.6} />
      <ambientLight intensity={0.4} />
      {/* Frontal gold core reflection */}
      <pointLight position={[0, 2.5, 3]} intensity={18} color="#FFD700" distance={12} />
      <pointLight position={[-3, 1.8, 2]} intensity={8} color="#FFD700" distance={10} />
      <spotLight position={[0, 4, 3]} angle={0.45} penumbra={1} intensity={10} color="#f5d0fe" />

      <group position={[0, -0.05, 0]}>
        <WakandaParticles count={900} />
        <EnergyPlatform />
        <TriangularMeshCage />
        <HolographicLogo />
      </group>
    </Canvas>
  );
}
