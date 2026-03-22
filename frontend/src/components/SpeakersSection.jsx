import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function SpeakersSection() {
  const sectionRef = useRef(null)
  const isInView   = useInView(sectionRef, { once: false, margin: '-10%' })

  return (
    <section
      ref={sectionRef}
      id="speakers"
      className="relative min-h-screen py-28 bg-wakanda-dark overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(196,30,58,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(255,215,0,0.1),transparent_60%)]" />

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
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', textShadow: '0 0 40px rgba(196,30,58,0.3)' }}
          >
            KEYNOTE{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #C41E3A, #FFD700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              SPEAKERS
            </span>
          </h2>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center py-20 px-6"
        >
          {/* Animated holographic rings */}
          <div className="relative w-40 h-40 mx-auto mb-10 flex items-center justify-center">
            {[1, 0.65, 0.38].map((s, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-vibranium/40"
                style={{ width: `${s * 160}px`, height: `${s * 160}px` }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360, opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'linear' }}
              />
            ))}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl select-none z-10"
            >
              🎤
            </motion.div>
          </div>

          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-mono text-[10px] tracking-[0.45em] uppercase text-vibranium-400 mb-4"
          >
            Transmission incoming
          </motion.p>

          <h3 className="font-heading font-black text-white text-3xl sm:text-4xl tracking-tight mb-3">
            Coming{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #C41E3A, #FFD700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Soon
            </span>
          </h3>

          <p className="text-white/40 font-mono text-sm text-center max-w-sm tracking-wide">
            Our keynote speakers are being confirmed.<br />Stay tuned for the announcement.
          </p>

          {/* Decorative pulsing line */}
          <motion.div
            animate={{ scaleX: [0.4, 1, 0.4], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-10 h-px w-48 bg-gradient-to-r from-transparent via-vibranium to-transparent"
          />
        </motion.div>
      </div>
    </section>
  )
}
