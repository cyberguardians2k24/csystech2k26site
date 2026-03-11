import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * ClawTransition renders a full-screen Black Panther–style claw-slash reveal
 * that triggers whenever the `trigger` prop becomes `true`.
 */
export default function ClawTransition({ trigger, color = '#bf00ff' }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!trigger) return
    setShow(true)
    const t = setTimeout(() => setShow(false), 1400)
    return () => clearTimeout(t)
  }, [trigger])

  // Five claw slash paths (SVG diagonal lines that expand from centre)
  const claws = [
    'M 50 50 L 0 0',
    'M 50 50 L 25 0',
    'M 50 50 L 50 0',
    'M 50 50 L 75 0',
    'M 50 50 L 100 0',
  ]

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Cinematic shutter wipe */}
          <div className="absolute inset-0 flex flex-col">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="flex-1"
                style={{
                  background: `linear-gradient(90deg, transparent, ${color}14, transparent)`,
                  borderTop: i > 0 ? `1px solid ${color}22` : 'none',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [0, 1, 0.2], opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.65, delay: i * 0.05, times: [0, 0.45, 1], ease: 'easeOut' }}
              />
            ))}
          </div>

          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Glow background flash */}
            <motion.rect
              x="0" y="0" width="100" height="100"
              fill={color}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.2, 0.08, 0] }}
              transition={{ duration: 0.5, times: [0, 0.2, 0.6, 1] }}
            />

            {/* Five claw slashes */}
            {claws.map((_, i) => (
              <motion.line
                key={i}
                x1="50" y1="100"
                x2={20 + i * 15} y2="0"
                stroke={color}
                strokeWidth="0.8"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 0.8, 0] }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.04,
                  times: [0, 0.3, 0.7, 1],
                  ease: 'easeOut',
                }}
                style={{ filter: `drop-shadow(0 0 3px ${color})` }}
              />
            ))}

            {/* Horizontal split lines */}
            {[30, 50, 70].map((y, i) => (
              <motion.line
                key={`h-${i}`}
                x1="0" y1={y}
                x2="100" y2={y}
                stroke={color}
                strokeWidth="0.2"
                strokeOpacity="0.3"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.06 }}
              />
            ))}

            {/* Center pulse ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="10"
              fill="none"
              stroke={color}
              strokeWidth="0.35"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 2.4], opacity: [0.7, 0] }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            />
          </svg>

          {/* Screen-edge glow flares */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${color}22 0%, transparent 60%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, times: [0, 0.3, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
