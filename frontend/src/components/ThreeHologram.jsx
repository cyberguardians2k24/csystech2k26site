import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

export function WakandaParticles({ count = 800 }) {
    const points = useRef();

    const { basePositions, particlesPosition, phaseOffsets } = useMemo(() => {
        const base = new Float32Array(count * 3);
        const dynamic = new Float32Array(count * 3);
        const phases = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const radius = 2.2 + Math.random() * 7.5;
            const angle = Math.random() * Math.PI * 2;
            const lift = (Math.random() - 0.5) * 5.6;
            const x = Math.cos(angle) * radius;
            const y = lift;
            const z = Math.sin(angle) * radius;

            base[i * 3] = x;
            base[i * 3 + 1] = y;
            base[i * 3 + 2] = z;
            dynamic[i * 3] = x;
            dynamic[i * 3 + 1] = y;
            dynamic[i * 3 + 2] = z;
            phases[i] = Math.random() * Math.PI * 2;
        }

        return { basePositions: base, particlesPosition: dynamic, phaseOffsets: phases };
    }, [count]);

    useFrame((state, delta) => {
        if (!points.current) return;

        const t = state.clock.getElapsedTime();
        const attr = points.current.geometry.attributes.position;
        const arr = attr.array;

        for (let i = 0; i < count; i++) {
            const idx = i * 3;
            const phase = phaseOffsets[i];
            arr[idx] = basePositions[idx] + Math.sin(t * 0.45 + phase) * 0.08;
            arr[idx + 1] = basePositions[idx + 1] + Math.cos(t * 0.8 + phase) * 0.12;
            arr[idx + 2] = basePositions[idx + 2] + Math.sin(t * 0.52 + phase) * 0.08;
        }

        attr.needsUpdate = true;
        points.current.rotation.y += delta * 0.03;
        points.current.rotation.x = Math.sin(t * 0.2) * 0.04;
    });

    return (
        <Points ref={points} positions={particlesPosition} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#c084fc"
                size={0.045}
                sizeAttenuation
                depthWrite={false}
                opacity={0.85}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

export function HolographicLogo() {
    const { mouse, viewport } = useThree();
    const groupRef = useRef();
    const titleRef = useRef();
    const titleGhostRef = useRef();
    const subRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const targetX = (mouse.x * viewport.width) / 18;
        const targetY = (mouse.y * viewport.height) / 24 + Math.sin(t * 1.5) * 0.06;

        if (groupRef.current) {
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
            groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.03;
            groupRef.current.scale.setScalar(1 + Math.sin(t * 1.8) * 0.015);
        }

        const flicker = 0.82 + Math.sin(t * 7.5) * 0.06 + (Math.sin(t * 17) > 0.93 ? 0.12 : 0);

        if (titleRef.current?.material) {
            titleRef.current.material.opacity = flicker;
            titleRef.current.position.x = Math.sin(t * 3) * 0.01;
        }

        if (titleGhostRef.current?.material) {
            titleGhostRef.current.material.opacity = 0.14 + Math.sin(t * 5.3) * 0.04;
            titleGhostRef.current.position.x = 0.05 + Math.sin(t * 2.2) * 0.015;
        }

        if (subRef.current?.material) {
            subRef.current.material.opacity = 0.72 + Math.sin(t * 4.2) * 0.05;
        }
    });

    return (
        <Float speed={2.2} rotationIntensity={0.08} floatIntensity={0.45}>
            <group ref={groupRef} position={[0, 0.55, 0]}>
                <Text
                    ref={titleGhostRef}
                    position={[0.05, 0.42, -0.08]}
                    fontSize={0.9}
                    maxWidth={200}
                    lineHeight={1}
                    letterSpacing={0.14}
                    textAlign="center"
                    anchorX="center"
                    anchorY="middle"
                >
                    CYSTECH
                    <meshBasicMaterial
                        color="#67e8f9"
                        transparent
                        opacity={0.16}
                        blending={THREE.AdditiveBlending}
                    />
                </Text>

                <Text
                    ref={titleRef}
                    position={[0, 0.42, 0]}
                    fontSize={0.9}
                    maxWidth={200}
                    lineHeight={1}
                    letterSpacing={0.14}
                    textAlign="center"
                    anchorX="center"
                    anchorY="middle"
                >
                    CYSTECH
                    <meshPhysicalMaterial
                        color="#f5d0fe"
                        emissive="#a855f7"
                        emissiveIntensity={1.9}
                        transmission={0.55}
                        transparent
                        opacity={0.9}
                        roughness={0.1}
                        metalness={0.15}
                    />
                </Text>

                <Text
                    ref={subRef}
                    position={[0, -0.22, 0.08]}
                    fontSize={0.42}
                    maxWidth={200}
                    letterSpacing={0.28}
                    textAlign="center"
                    anchorX="center"
                    anchorY="middle"
                >
                    2K26
                    <meshBasicMaterial
                        color="#c084fc"
                        transparent
                        opacity={0.76}
                        blending={THREE.AdditiveBlending}
                    />
                </Text>

                <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.36, 0.56, 64]} />
                    <meshBasicMaterial color="#8b5cf6" transparent opacity={0.28} side={THREE.DoubleSide} />
                </mesh>
            </group>
        </Float>
    );
}

export function EnergyPlatform() {
    const ringA = useRef();
    const ringB = useRef();
    const ringC = useRef();
    const coreGlow = useRef();

    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime();

        if (ringA.current) ringA.current.rotation.z += delta * 0.24;
        if (ringB.current) ringB.current.rotation.z -= delta * 0.18;
        if (ringC.current) {
            ringC.current.rotation.y += delta * 0.16;
            ringC.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.9) * 0.12;
        }

        if (coreGlow.current) {
            coreGlow.current.scale.setScalar(1 + Math.sin(t * 2.4) * 0.06);
            coreGlow.current.material.opacity = 0.18 + Math.sin(t * 2.4) * 0.05;
        }
    });

    return (
        <group position={[0, -1.55, 0]}>
            <mesh position={[0, -0.25, 0]}>
                <cylinderGeometry args={[1.85, 2.2, 0.4, 6]} />
                <meshStandardMaterial color="#09030f" emissive="#190028" emissiveIntensity={0.8} metalness={0.7} roughness={0.25} />
            </mesh>

            <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[1.8, 64]} />
                <meshBasicMaterial color="#4c1d95" transparent opacity={0.14} side={THREE.DoubleSide} />
            </mesh>

            <mesh ref={coreGlow} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.6, 1.45, 64]} />
                <meshBasicMaterial color="#a855f7" transparent opacity={0.2} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
            </mesh>

            <mesh position={[0, 0.62, 0]}>
                <cylinderGeometry args={[0.82, 1.25, 1.8, 36, 1, true]} />
                <meshBasicMaterial color="#7c3aed" transparent opacity={0.06} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
            </mesh>

            <mesh ref={ringA} position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.62, 0.06, 18, 120]} />
                <meshStandardMaterial color="#c084fc" emissive="#a855f7" emissiveIntensity={2} metalness={0.4} roughness={0.15} />
            </mesh>

            <mesh ref={ringB} position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.1, 0.04, 16, 100]} />
                <meshBasicMaterial color="#67e8f9" transparent opacity={0.45} blending={THREE.AdditiveBlending} />
            </mesh>

            <mesh ref={ringC} position={[0, 0.78, 0]} rotation={[Math.PI / 2, Math.PI / 2, 0]}>
                <torusGeometry args={[0.84, 0.03, 16, 100]} />
                <meshBasicMaterial color="#d8b4fe" transparent opacity={0.34} blending={THREE.AdditiveBlending} />
            </mesh>

            <mesh position={[0, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2.2, 3.1, 64]} />
                <meshBasicMaterial color="#581c87" transparent opacity={0.1} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}

export function TriangularMeshCage() {
    const outerRef = useRef();
    const innerRef = useRef();

    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime();

        if (outerRef.current) {
            outerRef.current.rotation.y += delta * 0.16;
            outerRef.current.rotation.z = Math.sin(t * 0.9) * 0.18;
            outerRef.current.scale.setScalar(1 + Math.sin(t * 2.2) * 0.025);
            outerRef.current.material.opacity = 0.2 + Math.sin(t * 2.8) * 0.05;
        }

        if (innerRef.current) {
            innerRef.current.rotation.x -= delta * 0.12;
            innerRef.current.rotation.y += delta * 0.08;
            innerRef.current.material.opacity = 0.12 + Math.cos(t * 2.4) * 0.04;
        }
    });

    return (
        <group position={[0, 0.65, 0]}>
            <mesh ref={outerRef}>
                <octahedronGeometry args={[1.6, 0]} />
                <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.22} blending={THREE.AdditiveBlending} />
            </mesh>

            <mesh ref={innerRef} scale={0.78}>
                <icosahedronGeometry args={[1.22, 0]} />
                <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.14} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
}
