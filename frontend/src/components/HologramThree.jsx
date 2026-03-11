import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { useMousePosition } from '../hooks/useMousePosition'

function makeRadialTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0.0, 'rgba(255,255,255,1)')
  g.addColorStop(0.18, 'rgba(224,64,251,0.95)')
  g.addColorStop(0.45, 'rgba(191,0,255,0.35)')
  g.addColorStop(1.0, 'rgba(191,0,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function LensFlares() {
  const group = useRef()
  const texture = useMemo(() => makeRadialTexture(), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!group.current) return
    group.current.children.forEach((s, i) => {
      const phase = t * 0.9 + i * 1.7
      s.material.opacity = 0.12 + (Math.sin(phase) * 0.5 + 0.5) * 0.18
      const scale = 0.9 + (Math.sin(phase * 1.2) * 0.5 + 0.5) * 0.8
      s.scale.setScalar(scale)
    })
  })

  return (
    <group ref={group}>
      {[
        { pos: [2.4, 0.8, 1.2], color: '#bf00ff' },
        { pos: [-2.2, -0.6, 1.6], color: '#e040fb' },
        { pos: [0.2, 1.9, 0.9], color: '#da00ff' },
      ].map((f, i) => (
        <sprite key={i} position={f.pos}>
          <spriteMaterial
            map={texture}
            color={f.color}
            transparent
            opacity={0.22}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  )
}

// ─── Rotating energy rings ─────────────────────────────────────────────────
function EnergyRings() {
  const group = useRef()
  const ring1 = useRef()
  const ring2 = useRef()
  const ring3 = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (group.current) {
      group.current.rotation.y = t * 0.3
    }
    if (ring1.current) { ring1.current.rotation.x = t * 0.5; ring1.current.rotation.z = t * 0.2 }
    if (ring2.current) { ring2.current.rotation.x = -t * 0.4; ring2.current.rotation.y = t * 0.6 }
    if (ring3.current) { ring3.current.rotation.z = t * 0.7; ring3.current.rotation.x = t * 0.1 }
  })

  const ringMat = (opacity = 0.7) => (
    <meshStandardMaterial
      color="#bf00ff"
      emissive="#6a0080"
      emissiveIntensity={2}
      transparent
      opacity={opacity}
      wireframe
    />
  )

  return (
    <group ref={group}>
      <Torus ref={ring1} args={[2.2, 0.02, 8, 100]} rotation={[0.5, 0, 0]}>
        {ringMat(0.8)}
      </Torus>
      <Torus ref={ring2} args={[2.6, 0.015, 8, 100]} rotation={[1, 0.5, 0]}>
        {ringMat(0.5)}
      </Torus>
      <Torus ref={ring3} args={[3.0, 0.01, 8, 100]} rotation={[0, 1, 0.5]}>
        {ringMat(0.4)}
      </Torus>
    </group>
  )
}

// ─── Holographic core sphere ───────────────────────────────────────────────
function HologramCore({ mouseNorm }) {
  const meshRef = useRef()
  const shellRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.4 + mouseNorm.x * 0.5
      meshRef.current.rotation.x = mouseNorm.y * 0.3
    }
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.22
      shellRef.current.scale.setScalar(1.08 + Math.sin(t * 2.2) * 0.035)
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.2, 2]} />
          <MeshDistortMaterial
            color="#bf00ff"
            emissive="#4a0080"
            emissiveIntensity={1.5}
            distort={0.25}
            speed={3}
            transparent
            opacity={0.85}
            wireframe
          />
        </mesh>

        <mesh ref={shellRef}>
          <sphereGeometry args={[1.55, 36, 36]} />
          <meshBasicMaterial color="#da00ff" transparent opacity={0.09} wireframe />
        </mesh>
      </group>
    </Float>
  )
}

function LightPillars() {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.14
      groupRef.current.children.forEach((child, i) => {
        child.scale.y = 0.75 + Math.sin(t * 1.8 + i) * 0.2
      })
    }
  })

  return (
    <group ref={groupRef}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2
        const radius = 3.4
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[0, -angle, 0]}
          >
            <cylinderGeometry args={[0.035, 0.035, 3.6, 8]} />
            <meshBasicMaterial color="#bf00ff" transparent opacity={0.22} />
          </mesh>
        )
      })}
    </group>
  )
}

function OrbitShards() {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.5
      groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2
        const radius = 2.8 + (i % 3) * 0.45
        const y = ((i % 5) - 2) * 0.32
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]} rotation={[0.6, angle, 0.25]}>
            <octahedronGeometry args={[0.08 + (i % 2) * 0.03, 0]} />
            <meshStandardMaterial color="#e040fb" emissive="#7a00b0" emissiveIntensity={1.8} metalness={0.2} roughness={0.35} transparent opacity={0.85} />
          </mesh>
        )
      })}
    </group>
  )
}

// ─── Particle field ────────────────────────────────────────────────────────
function HoloParticles() {
  const ref = useRef()
  const count = 480

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.random() * Math.PI
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.cos(phi)
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      // Purple shades
      col[i * 3]     = 0.5 + Math.random() * 0.5   // R
      col[i * 3 + 1] = 0                             // G
      col[i * 3 + 2] = 0.7 + Math.random() * 0.3   // B
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.08
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]}    />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

// ─── Outer scene wrapper reading mouse ────────────────────────────────────
function HoloScene({ normalizedPos }) {
  const { camera } = useThree()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    camera.position.x += (normalizedPos.x * 1.6 + Math.sin(t * 0.35) * 0.2 - camera.position.x) * 0.04
    camera.position.y += (normalizedPos.y * 1.1 + Math.cos(t * 0.42) * 0.15 - camera.position.y) * 0.04
    camera.position.z += (6.8 + Math.sin(t * 0.28) * 0.18 - camera.position.z) * 0.03
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <fog attach="fog" args={['#050508', 7, 15]} />
      <ambientLight intensity={0.24} />
      <pointLight position={[5, 5, 5]}  color="#bf00ff" intensity={3.4}  />
      <pointLight position={[-5, -5, 5]} color="#da00ff" intensity={2.3} />
      <spotLight position={[0, 6, 2]} color="#e040fb" intensity={1.2} angle={0.5} penumbra={0.7} />
      <HologramCore mouseNorm={normalizedPos} />
      <EnergyRings />
      <LightPillars />
      <OrbitShards />
      <HoloParticles />
      <LensFlares />
    </>
  )
}

// ─── Exported component ────────────────────────────────────────────────────
export default function HologramThree({ className = '', style = {} }) {
  const { normalizedPos } = useMousePosition()

  return (
    <div className={`pointer-events-none ${className}`} style={style}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <HoloScene normalizedPos={normalizedPos} />
      </Canvas>
    </div>
  )
}
