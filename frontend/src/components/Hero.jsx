import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import heroVideo from '../../Assets/hero/cystek cdo 2 selected.mp4';

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/* ── letter array for stagger animation ── */
const TITLE_CHARS = 'CYSTECH 2K26'.split('');

const STATS = [
  { value: '50+',  label: 'Events'       },
  { value: '1K+',  label: 'Participants' },
  { value: '25+',  label: 'Speakers'     },
  { value: '12+',  label: 'Sponsors'     },
];

/* ── HUD corner bracket ── */
function Corner({ pos }) {
  const classes = {
    tl: 'top-5 left-5   border-t-2 border-l-2',
    tr: 'top-5 right-5  border-t-2 border-r-2',
    bl: 'bottom-5 left-5  border-b-2 border-l-2',
    br: 'bottom-5 right-5 border-b-2 border-r-2',
  }[pos];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 0.6, scale: 1 }}
      transition={{ duration: 0.7, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute w-7 h-7 border-white/40 rounded-[2px] pointer-events-none ${classes}`}
    />
  );
}

/* ── floating glow orb ── */
function FloatOrb({ top, left, right, bottom, size, color, delay }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, top, left, right, bottom, background: color }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.42, 0.18, 0.42, 0], y: [0, -34, -14, -36, 0] }}
      transition={{ duration: 10, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function Hero() {
  const [videoReady, setVideoReady] = useState(false);
  const navigate = useNavigate();
  const heroRef  = useRef(null);

  /* ── data-strip ticker ── */
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!videoReady) return;
    const id = setInterval(() => setTick(t => (t + 1) % 100), 120);
    return () => clearInterval(id);
  }, [videoReady]);

  /* ── scroll-parallax (skip on mobile — useSpring runs a RAF loop) ── */
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const rawY  = useTransform(scrollYProgress, [0, 1], ['0%', isTouch ? '0%' : '-20%']);
  const rawOp = useTransform(scrollYProgress, [0, 0.52], [1, isTouch ? 1 : 0]);
  const rawSc = useTransform(scrollYProgress, [0, 0.52], [1, isTouch ? 1 : 0.94]);
  const yText = useSpring(rawY, { stiffness: 55, damping: 18 });

  return (
    <section ref={heroRef} className="relative h-screen bg-black overflow-hidden">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ─── Video ─────────────────────────────────── */}
        <motion.video
          src={heroVideo}
          autoPlay loop muted playsInline preload="auto"
          onLoadedData={() => setVideoReady(true)}
          initial={{ opacity: 0, scale: 1.07 }}
          animate={{ opacity: videoReady ? 1 : 0, scale: videoReady ? 1 : 1.045 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* spinner */}
        <AnimatePresence>
          {!videoReady && (
            <motion.div exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black z-50">
              <div className="w-14 h-14 rounded-full border border-white/15 border-t-white animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Gradient overlays ─────────────────────── */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,0,5,0.65)_0%,rgba(0,0,0,0.15)_28%,rgba(0,0,0,0.15)_60%,rgba(3,0,5,0.90)_100%)] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none
          bg-[radial-gradient(ellipse_90%_55%_at_50%_55%,rgba(255,255,255,0.06),transparent_55%),
              radial-gradient(circle_at_18%_16%,rgba(226,232,240,0.10),transparent_30%),
              radial-gradient(circle_at_82%_82%,rgba(255,255,255,0.05),transparent_30%)]" />
        <div className="absolute inset-0 scanlines opacity-[0.07] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-48
          bg-gradient-to-t from-wakanda-dark via-wakanda-dark/75 to-transparent pointer-events-none" />

        {/* ─── Floating orbs (desktop only) ────────── */}
        {!isTouch && <>
          <FloatOrb top="14%" left="6%"  size={300} delay={0.5}
            color="radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)" />
          <FloatOrb top="18%" right="8%" size={220} delay={2.2}
            color="radial-gradient(circle, rgba(203,213,225,0.15), transparent 70%)" />
          <FloatOrb bottom="20%" right="20%" size={170} delay={4.0}
            color="radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%)" />
        </>}

        {/* ─── Pulse rings (desktop only) ────────────── */}
        {!isTouch && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[0, 1.0, 2.0].map((delay, i) => (
              <motion.div key={i}
                className="absolute rounded-full border border-white/14"
                initial={{ width: 160, height: 160, opacity: 0.55 }}
                animate={{ width: [160, 640], height: [160, 640], opacity: [0.5, 0] }}
                transition={{ duration: 4.5, delay, repeat: Infinity, ease: 'easeOut' }}
              />
            ))}
          </div>
        )}

        {/* ─── HUD corners ───────────────────────────── */}
        {['tl','tr','bl','br'].map(p => <Corner key={p} pos={p} />)}

        {/* ─── HUD data strip – top ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: videoReady ? 0.5 : 0, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="absolute top-[4.6rem] left-0 right-0 flex justify-between px-9 sm:px-14 pointer-events-none"
        >
          <span className="font-mono text-[9px] tracking-[0.28em] text-white/50 uppercase">
            SYS::ONLINE // PKT::{tick.toString().padStart(2,'0')}%
          </span>
          <span className="font-mono text-[9px] tracking-[0.28em] text-white/45 uppercase">
            CYSTECH 2K26 // SYMPOSIUM
          </span>
        </motion.div>

        {/* ─── Parallax text block ───────────────────── */}
        <motion.div
          style={{ y: yText, opacity: rawOp, scale: rawSc }}
          className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 text-center"
        >
          {/* status badge */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: videoReady ? 1 : 0, y: 0 }}
            transition={{ duration: 0.9, delay: 0.34 }}
            className="mb-6 rounded-full border border-white/18 bg-white/6 px-5 py-2 backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
              <span className="font-mono text-[9.5px] tracking-[0.38em] uppercase text-white/90">
                Symposium Experience Online
              </span>
              <span className="font-mono text-[9px] tracking-[0.18em] text-white/40">// 2026</span>
            </div>
          </motion.div>

          {/* ── Letter-by-letter animated title ── */}
          <div className="relative">
            {/* ambient glow halo behind title */}
            <div className="absolute inset-0 -m-12 rounded-full
              bg-[radial-gradient(ellipse_85%_55%,rgba(255,255,255,0.14),rgba(203,213,225,0.08)_50%,transparent_72%)]
              blur-3xl pointer-events-none" />

            <h1 className="relative flex flex-wrap justify-center leading-none font-black uppercase select-none"
              style={{ perspective: '800px' }}
              aria-label="CYSTECH 2K26"
            >
              {TITLE_CHARS.map((char, i) => (
                char === ' '
                  ? <span key={i} className="w-[0.3em]" />
                  : (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 48, rotateX: -60 }}
                      animate={videoReady
                        ? { opacity: 1, y: 0, rotateX: 0 }
                        : {}}
                      transition={{ duration: 0.72, delay: 0.44 + i * 0.056, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ scale: 1.10, textShadow: '0 0 60px rgba(255,255,255,0.95)' }}
                      className="inline-block text-[13vw] sm:text-[10.5vw] md:text-[7.2vw] lg:text-[6vw] hero-letter"
                      style={{
                        backgroundImage: 'linear-gradient(160deg, #ffffff 0%, #f8fafc 18%, #e2e8f0 38%, #ffffff 55%, #cbd5e1 72%, #ffffff 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        textShadow: '0 0 48px rgba(255,255,255,0.30), 0 0 90px rgba(226,232,240,0.18)',
                      }}
                    >
                      {char}
                    </motion.span>
                  )
              ))}
            </h1>
          </div>

          {/* tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: videoReady ? 1 : 0, y: 0 }}
            transition={{ duration: 0.9, delay: 1.26 }}
            className="mt-3 font-mono text-[10px] sm:text-[11px] tracking-[0.34em] uppercase text-white/65"
          >
            Future.&nbsp;&nbsp;Power.&nbsp;&nbsp;Innovation.&nbsp;&nbsp;One&nbsp;Stage.
          </motion.p>

          {/* animated divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: videoReady ? 1 : 0, opacity: videoReady ? 1 : 0 }}
            transition={{ duration: 1.1, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 w-52 h-px origin-center
              bg-gradient-to-r from-transparent via-white/45 to-transparent"
          />

          {/* sub description */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: videoReady ? 1 : 0, y: 0 }}
            transition={{ duration: 0.9, delay: 1.52 }}
            className="mt-5 max-w-xl text-sm md:text-base text-white/50 leading-relaxed"
          >
            Enter the official digital gateway of CYSTECH 2K26 — where elite events,
            cinematic energy, and next-level technology converge.
          </motion.p>

          {/* ── CTA buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: videoReady ? 1 : 0, y: 0 }}
            transition={{ duration: 0.9, delay: 1.68 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            {/* Primary */}
            <button
              onClick={() => navigate('/register')}
              className="group relative overflow-hidden rounded-full px-9 py-3
                font-mono text-[10.5px] tracking-[0.26em] uppercase font-bold text-black
                transition-all duration-300 hover:scale-105
                hover:shadow-[0_0_36px_rgba(255,255,255,0.55)]"
              style={{ background: 'linear-gradient(90deg,#ffffff 0%,#cbd5e1 100%)' }}
            >
              <span className="relative z-10">Register Now</span>
              {/* shimmer sweep */}
              <span className="absolute inset-0 bg-white/25 -translate-x-full group-hover:translate-x-full
                transition-transform duration-500 skew-x-12 pointer-events-none" />
            </button>

            {/* Ghost */}
            <button
              onClick={() => navigate('/events/technical')}
              className="rounded-full px-9 py-3 font-mono text-[10.5px] tracking-[0.26em]
                uppercase text-white/85 border border-white/30 bg-white/6
                backdrop-blur-sm transition-all duration-300 hover:scale-105
                hover:bg-white/12 hover:border-white/60
                hover:shadow-[0_0_24px_rgba(255,255,255,0.18)]"
            >
              Explore Events
            </button>
          </motion.div>

          {/* ── Stats row ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: videoReady ? 1 : 0, y: 0 }}
            transition={{ duration: 0.9, delay: 1.88 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-5 sm:gap-10"
          >
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && (
                  <span className="hidden sm:block w-px h-8 bg-white/15" />
                )}
                <div className="text-center">
                  <div className="font-heading text-2xl sm:text-3xl font-black text-transparent bg-clip-text"
                    style={{ backgroundImage: 'linear-gradient(135deg, #ffffff, #94a3b8)' }}>
                    {s.value}
                  </div>
                  <div className="font-mono text-[8.5px] tracking-[0.26em] uppercase text-white/40 mt-0.5">
                    {s.label}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>

        {/* ─── Scroll indicator ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 2.2 }}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-mono text-[8px] tracking-[0.42em] uppercase text-white/30">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-white/18 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-white/70" />
          </motion.div>
        </motion.div>

        {/* ─── HUD data strip – bottom ───────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady ? 0.42 : 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="absolute bottom-[4.6rem] left-0 right-0 flex justify-between px-9 sm:px-14 pointer-events-none"
        >
          <span className="font-mono text-[8px] tracking-[0.22em] text-white/40 uppercase">
            VENUE :: TBA / MAR 2026
          </span>
          <span className="font-mono text-[8px] tracking-[0.22em] text-white/35 uppercase">
            V2.6.0 // BUILD::STABLE
          </span>
        </motion.div>

      </div>
    </section>
  );
}
