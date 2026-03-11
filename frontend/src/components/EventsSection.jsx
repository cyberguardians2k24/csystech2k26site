import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EVENTS = [
  {
    id: 1,
    icon: '◈',
    category: 'TECHNICAL',
    title: 'Paper Presentation',
    desc: 'Present your research on cutting-edge topics. Showcase innovations in AI, cybersecurity, blockchain, and emerging technologies.',
    details: ['Individual / Team of 2', '10-min presentation + Q&A', 'Prize: ₹15,000'],
    color: '#bf00ff',
    angle: -8,
  },
  {
    id: 2,
    icon: '⬡',
    category: 'CODING',
    title: 'Hackathon',
    desc: '24-hour coding sprint. Build disruptive solutions to real-world problems. Innovation, execution, and impact all judged.',
    details: ['Teams of 2–4', '24 Hours', 'Prize: ₹30,000'],
    color: '#7c3aed',
    angle: 4,
  },
  {
    id: 3,
    icon: '◉',
    category: 'KNOWLEDGE',
    title: 'Technical Quiz',
    desc: 'Test your tech knowledge across CS fundamentals, current affairs in technology, logical reasoning, and aptitude.',
    details: ['Individual / Pair', '3 Rounds', 'Prize: ₹10,000'],
    color: '#a855f7',
    angle: -4,
  },
  {
    id: 4,
    icon: '◆',
    category: 'SKILL',
    title: 'Workshops',
    desc: 'Hands-on sessions led by industry experts on AI/ML, Cloud Computing, Cybersecurity, and Web3 technologies.',
    details: ['30 Seats per batch', '3-Hour Sessions', 'Certificate + Kit'],
    color: '#9333ea',
    angle: 8,
  },
]

export default function EventsSection() {
  const sectionRef = useRef(null)
  const isInView   = useInView(sectionRef, { once: false, margin: '-10%' })

  const container = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  }

  const card = {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section
      ref={sectionRef}
      id="events"
      className="relative py-24 bg-wakanda-black overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(76,29,149,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(191,0,255,0.08),transparent_55%)]" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-vibranium-700/40 to-transparent" />

      <div className="relative z-10 container mx-auto px-6 max-w-7xl">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-vibranium-500" />
            <span className="font-mono text-vibranium-400 text-xs tracking-[0.5em]">EVENTS</span>
          </div>
          <h2 className="mt-5 font-orbitron font-black text-white" style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.6rem)' }}>
            Choose Your{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #bf00ff, #e040fb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Arena
            </span>
          </h2>
          <p className="mt-3 max-w-2xl font-rajdhani text-white/55 text-lg">
            Technical challenges, coding battles, knowledge rounds, and hands-on workshops.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {EVENTS.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              variants={card}
            />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-12"
        >
          <a href="#register" className="btn-neon inline-flex gap-3">
            <span>Register For Events</span>
            <span className="text-vibranium-400">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function EventCard({ event, variants }) {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="group"
    >
      <div
        className="holo-panel rounded-sm p-7 h-full relative overflow-hidden"
        style={{
          border: '1px solid rgba(191,0,255,0.22)',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-xs tracking-[0.45em] text-vibranium-400/80">
              {event.category}
            </div>
            <h3 className="mt-2 font-orbitron font-bold text-white text-lg leading-tight">
              {event.title}
            </h3>
          </div>
          <div
            className="flex h-10 w-10 items-center justify-center border border-vibranium-700/40 text-vibranium-300"
            style={{ boxShadow: 'inset 0 0 18px rgba(191,0,255,0.08)' }}
          >
            <span className="text-lg">{event.icon}</span>
          </div>
        </div>

        <p className="mt-4 font-rajdhani text-white/55 text-sm leading-relaxed">
          {event.desc}
        </p>

        {/* Details list */}
        <ul className="mt-5 space-y-1.5">
          {event.details.map((d, i) => (
            <li key={i} className="flex items-center gap-2 font-mono text-xs text-white/40">
              <span className="text-vibranium-400">›</span>
              {d}
            </li>
          ))}
        </ul>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vibranium-600/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Floating register link */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <a
            href="#register"
            className="font-mono text-xs tracking-widest"
            style={{ color: event.color }}
          >
            REGISTER →
          </a>
        </div>
      </div>
    </motion.div>
  )
}
