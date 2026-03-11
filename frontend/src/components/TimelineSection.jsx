import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const TIMELINE = [
  { time: '08:30',  label: 'Registration & Kit Collection', icon: '◈', tag: 'GATE OPEN'   },
  { time: '09:00',  label: 'Inaugural Ceremony & Keynote',  icon: '◉', tag: 'CEREMONY'    },
  { time: '10:00',  label: 'Workshop – AI / ML Track',      icon: '⬡', tag: 'WORKSHOP'    },
  { time: '11:00',  label: 'Technical Quiz – Round 1',      icon: '◆', tag: 'COMPETITION' },
  { time: '12:30',  label: 'Lunch Break',                   icon: '◇', tag: 'BREAK'       },
  { time: '13:30',  label: 'Paper Presentation',            icon: '▲', tag: 'PRESENTATION' },
  { time: '14:00',  label: 'Hackathon Kick-off',            icon: '◉', tag: 'HACKATHON'   },
  { time: '16:00',  label: 'Workshop – Cybersecurity',      icon: '⬡', tag: 'WORKSHOP'    },
  { time: '18:00',  label: 'Cultural & Networking Hour',    icon: '◈', tag: 'NETWORKING'  },
  { time: '19:30',  label: 'Valedictory & Prize Distribution', icon: '◆', tag: 'AWARDS'   },
]

export default function TimelineSection() {
  const sectionRef = useRef(null)
  const isInView   = useInView(sectionRef, { once: false, margin: '-10%' })

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative min-h-screen py-28 bg-wakanda-black overflow-hidden"
    >
      {/* BG */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(76,29,149,0.12),transparent_70%)]" />

      <div className="relative z-10 container mx-auto px-6 max-w-4xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-vibranium-500" />
            <span className="font-mono text-vibranium-400 text-xs tracking-[0.5em]">EVENT SEQUENCE</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-vibranium-500" />
          </div>
          <h2
            className="font-orbitron font-black text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', textShadow: '0 0 40px rgba(191,0,255,0.3)' }}
          >
            DAY{' '}
            <span style={{ background: 'linear-gradient(135deg, #bf00ff, #e040fb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              TIMELINE
            </span>
          </h2>
        </motion.div>

        {/* Timeline entries */}
        <div className="relative">
          {/* Central spine */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-px"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'linear-gradient(180deg, transparent, #bf00ff, #da00ff, transparent)',
              transformOrigin: 'top',
              boxShadow: '0 0 8px #bf00ff',
            }}
          />

          <div className="space-y-0">
            {TIMELINE.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ item, index, isInView }) {
  const isLeft  = index % 2 === 0
  const ref     = useRef(null)
  const inV     = useInView(ref, { once: false, margin: '-10%' })

  return (
    <div ref={ref} className="relative flex items-center" style={{ minHeight: 100 }}>

      {/* Left side */}
      <div className={`flex-1 pr-10 ${isLeft ? 'flex justify-end' : ''}`}>
        {isLeft && (
          <TimelineCard item={item} index={index} inView={inV} side="left" />
        )}
      </div>

      {/* Centre node */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={inV ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div
          className="w-5 h-5 rounded-full border-2 border-vibranium-500 flex items-center justify-center"
          style={{ background: '#050508', boxShadow: '0 0 12px #bf00ff, 0 0 24px rgba(191,0,255,0.4)' }}
        >
          <div className="w-2 h-2 rounded-full bg-vibranium-400 animate-pulse-slow" />
        </div>
      </motion.div>

      {/* Right side */}
      <div className={`flex-1 pl-10 ${!isLeft ? '' : ''}`}>
        {!isLeft && (
          <TimelineCard item={item} index={index} inView={inV} side="right" />
        )}
      </div>
    </div>
  )
}

function TimelineCard({ item, index, inView, side }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? 40 : -40 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: side === 'left' ? 40 : -40 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="holo-panel rounded-sm p-5 max-w-xs group hover:shadow-vibranium transition-all duration-300"
      style={{ border: '1px solid rgba(191,0,255,0.25)' }}
      whileHover={{ scale: 1.03 }}
    >
      {/* Tag + time on same row */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-mono text-xs px-2 py-0.5 tracking-widest"
          style={{ background: 'rgba(191,0,255,0.15)', color: '#bf00ff', border: '1px solid rgba(191,0,255,0.3)' }}
        >
          {item.tag}
        </span>
        <span className="font-orbitron text-vibranium-400 text-sm font-bold">{item.time}</span>
      </div>

      {/* Content */}
      <div className="flex items-start gap-3 mt-3">
        <span className="text-vibranium-500 text-lg mt-0.5">{item.icon}</span>
        <p className="font-rajdhani text-white/80 text-base leading-snug">{item.label}</p>
      </div>

      {/* Glow bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vibranium-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
}
