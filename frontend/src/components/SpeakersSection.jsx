import React, { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const SPEAKERS = [
  {
    id: 1,
    name: 'Dr. Arjun Mehta',
    role: 'AI Research Director',
    org: 'Tech Wakanda Labs',
    topic: 'Future of Generative AI',
    avatar: 'AM',
    color: '#bf00ff',
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    id: 2,
    name: 'Dr. Priya Nair',
    role: 'Quantum Computing Lead',
    org: 'IIT Chennai',
    topic: 'Quantum Algorithms & Cryptography',
    avatar: 'PN',
    color: '#7c3aed',
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    id: 3,
    name: 'Kiran Sharma',
    role: 'CTO',
    org: 'Cybersec Dynamics',
    topic: 'Zero-Trust Security Architecture',
    avatar: 'KS',
    color: '#a855f7',
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    id: 4,
    name: 'Ms. Ananya Das',
    role: 'ML Engineer',
    org: 'Google DeepMind India',
    topic: 'Neural Architecture Search',
    avatar: 'AD',
    color: '#9333ea',
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    id: 5,
    name: 'Rahul Verma',
    role: 'Blockchain Architect',
    org: 'Web3 Ventures',
    topic: 'Decentralized Identity Systems',
    avatar: 'RV',
    color: '#6d28d9',
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    id: 6,
    name: 'Dr. Meena Joseph',
    role: 'Cloud Infrastructure',
    org: 'Microsoft Azure',
    topic: 'Edge AI & Cloud Continuum',
    avatar: 'MJ',
    color: '#c084fc',
    socials: { linkedin: '#', twitter: '#' },
  },
]

export default function SpeakersSection() {
  const sectionRef = useRef(null)
  const isInView   = useInView(sectionRef, { once: false, margin: '-10%' })
  const [selected, setSelected] = useState(null)

  return (
    <section
      ref={sectionRef}
      id="speakers"
      className="relative min-h-screen py-28 bg-wakanda-dark overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(76,29,149,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(100,0,150,0.1),transparent_60%)]" />

      <div className="relative z-10 container mx-auto px-6 max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-vibranium-500" />
            <span className="font-mono text-vibranium-400 text-xs tracking-[0.5em]">VISIONARIES</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-vibranium-500" />
          </div>
          <h2
            className="font-orbitron font-black text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', textShadow: '0 0 40px rgba(191,0,255,0.3)' }}
          >
            KEYNOTE{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #bf00ff, #e040fb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              SPEAKERS
            </span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPEAKERS.map((speaker, i) => (
            <SpeakerCard
              key={speaker.id}
              speaker={speaker}
              index={i}
              isInView={isInView}
              isSelected={selected === speaker.id}
              onSelect={() => setSelected(selected === speaker.id ? null : speaker.id)}
            />
          ))}
        </div>
      </div>

      {/* Speaker detail modal */}
      <AnimatePresence>
        {selected && (
          <SpeakerModal
            speaker={SPEAKERS.find(s => s.id === selected)}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function SpeakerCard({ speaker, index, isInView, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer group"
      style={{ transformStyle: 'preserve-3d', perspective: 800 }}
    >
      <motion.div
        animate={{
          rotateY: hovered ? 5 : 0,
          rotateX: hovered ? -5 : 0,
          scale: hovered ? 1.03 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="holo-panel rounded-sm p-8 h-full relative overflow-hidden"
        style={{
          border: `1px solid ${speaker.color}44`,
          boxShadow: hovered
            ? `0 0 40px ${speaker.color}44, 0 20px 40px rgba(0,0,0,0.4)`
            : `0 0 20px ${speaker.color}11`,
        }}
      >
        {/* Holographic shimmer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${speaker.color}08 0%, transparent 50%, ${speaker.color}08 100%)`,
          }}
        />

        {/* Floating avatar */}
        <motion.div
          animate={{ y: hovered ? -8 : 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="relative mb-6"
        >
          {/* Rings */}
          <div className="relative w-20 h-20 mx-auto">
            <div
              className="absolute inset-0 rounded-full border animate-pulse-slow"
              style={{ border: `1px solid ${speaker.color}55`, transform: 'scale(1.3)' }}
            />
            <div
              className="absolute inset-0 rounded-full border opacity-50"
              style={{ border: `1px solid ${speaker.color}33`, transform: 'scale(1.6)' }}
            />
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center font-orbitron font-black text-white text-xl relative z-10"
              style={{
                background: `linear-gradient(135deg, ${speaker.color}44, ${speaker.color}88)`,
                boxShadow: `0 0 20px ${speaker.color}55`,
                border: `2px solid ${speaker.color}`,
              }}
            >
              {speaker.avatar}
            </div>
          </div>
        </motion.div>

        {/* Info */}
        <div className="text-center space-y-2">
          <div className="font-mono text-xs tracking-[0.3em]" style={{ color: `${speaker.color}99` }}>
            {speaker.org}
          </div>
          <h3 className="font-orbitron font-bold text-white text-base">{speaker.name}</h3>
          <div className="font-rajdhani text-white/50 text-sm">{speaker.role}</div>
        </div>

        {/* Topic badge */}
        <div
          className="mt-5 px-3 py-2 text-center font-mono text-xs tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{
            background: `${speaker.color}15`,
            border: `1px solid ${speaker.color}44`,
            color: speaker.color,
          }}
        >
          "{speaker.topic}"
        </div>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${speaker.color}, transparent)` }}
        />

        {/* View more hint */}
        <div className="absolute top-3 right-3 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: speaker.color }}>
          VIEW ›
        </div>
      </motion.div>
    </motion.div>
  )
}

function SpeakerModal({ speaker, onClose }) {
  if (!speaker) return null
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 holo-panel rounded-sm p-10 max-w-md w-full"
        style={{ border: `1px solid ${speaker.color}88`, boxShadow: `0 0 60px ${speaker.color}44` }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 font-mono text-white/50 hover:text-white transition-colors text-sm"
        >
          ✕
        </button>
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center font-orbitron font-black text-white text-2xl mx-auto mb-6"
          style={{ background: `linear-gradient(135deg, ${speaker.color}66, ${speaker.color})`, border: `2px solid ${speaker.color}` }}
        >
          {speaker.avatar}
        </div>
        <div className="text-center space-y-3">
          <div className="font-mono text-xs tracking-[0.3em]" style={{ color: speaker.color }}>{speaker.org}</div>
          <h3 className="font-orbitron font-bold text-white text-xl">{speaker.name}</h3>
          <div className="font-rajdhani text-white/60">{speaker.role}</div>
          <div className="mt-4 p-4 text-sm font-rajdhani text-white/70 leading-relaxed"
            style={{ background: `${speaker.color}10`, border: `1px solid ${speaker.color}33` }}>
            <strong style={{ color: speaker.color }}>Topic:</strong><br />
            {speaker.topic}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
