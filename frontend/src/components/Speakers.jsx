import React from 'react';
import { motion } from 'framer-motion';

export default function Speakers() {
  return (
    <section id="speakers" className="section-shell relative py-16 md:py-32 bg-wakanda-dark text-slate-50 overflow-hidden" style={{ perspective: '1200px' }}>
      <div className="absolute inset-0 bg-holo-grid bg-grid-sm opacity-[0.04] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-[#C41E3A]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-[#FFD700]/7 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16 text-center flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#C41E3A]/25 bg-[#120400]/65 backdrop-blur-xl mb-5 panel-sheen">
            <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
            <span className="text-sm font-mono tracking-[0.25em] text-[#E8A000] uppercase font-bold">Masterminds</span>
          </div>
          <h3 className="text-5xl md:text-7xl font-black font-heading tracking-tighter uppercase mb-4 text-white leading-[0.95]">
            Guest{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #C41E3A 0%, #C41E3A 46%, #FFD700 100%)' }}
            >
              Speakers
            </span>
          </h3>
          <p className="max-w-2xl text-white/42 font-mono tracking-[0.18em] uppercase text-xs leading-relaxed">
            Learn directly from innovators shaping future-ready systems, cybersecurity strategy, product engineering, and next-generation digital experiences.
          </p>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center py-16"
        >
          {/* Animated holographic rings */}
          <div className="relative w-40 h-40 mx-auto mb-10 flex items-center justify-center">
            {[1, 0.65, 0.38].map((s, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-[#C41E3A]/35"
                style={{ width: `${s * 160}px`, height: `${s * 160}px` }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360, opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'linear' }}
              />
            ))}
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl select-none z-10"
            >
              🎤
            </motion.div>
          </div>

          <motion.p
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-mono text-[10px] tracking-[0.45em] uppercase text-[#C41E3A]/70 mb-4"
          >
            Transmission incoming
          </motion.p>

          <h3 className="font-heading font-black text-white text-3xl sm:text-4xl tracking-tight mb-3 text-center">
            Coming{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #C41E3A, #FFD700)' }}
            >
              Soon
            </span>
          </h3>

          <p className="text-white/40 font-mono text-sm text-center max-w-sm tracking-wide leading-relaxed">
            Our guest speakers are being confirmed.<br />Stay tuned for the announcement.
          </p>

          {/* Pulsing dot pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-dashed border-[#C41E3A]/25 bg-[#C41E3A]/5 text-white/40 font-mono text-xs tracking-widest uppercase backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#C41E3A]/80 animate-pulse" />
            Speakers to be Announced Soon
            <span className="w-2 h-2 rounded-full bg-[#FFD700]/80 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </motion.div>

          {/* Decorative pulsing line */}
          <motion.div
            animate={{ scaleX: [0.4, 1, 0.4], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-8 h-px w-48 bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
