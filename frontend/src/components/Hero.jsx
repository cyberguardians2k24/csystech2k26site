import React, { useState, useRef, useCallback, lazy, Suspense, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import heroVideo from '../../Assets/hero/cystek cdo 2 selected.mp4';
const HeroParticles = lazy(() => import('./HeroParticles'));

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const GLYPH_TONES = {
  vibranium: {
    backgroundImage: 'linear-gradient(135deg, #f5f3ff 0%, #c4b5fd 25%, #9D00FF 58%, #5b21b6 100%)',
    textShadow: '0 0 18px rgba(157,0,255,0.38)',
  },
  cyan: {
    backgroundImage: 'linear-gradient(135deg, #ecfeff 0%, #a5f3fc 35%, #00f0ff 68%, #0891b2 100%)',
    textShadow: '0 0 18px rgba(0,240,255,0.34)',
  },
  silver: {
    backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 35%, #cbd5e1 65%, #94a3b8 100%)',
    textShadow: '0 0 16px rgba(255,255,255,0.24)',
  },
};

const STATS = [
  { value: '50+', label: 'Events', glyph: '⬢', tone: 'vibranium' },
  { value: '1K+', label: 'Participants', glyph: '✦', tone: 'cyan' },
  { value: '25+', label: 'Speakers', glyph: '◈', tone: 'silver' },
  { value: '12+', label: 'Sponsors', glyph: '❖', tone: 'vibranium' },
];

// floating emoji orbs
const FLOAT_EMOJIS = [
  { glyph: '✦', tone: 'cyan', x: '8%',  y: '18%', delay: 0,   dur: 7.2, size: 'text-2xl sm:text-3xl', glow: 'rgba(0,240,255,0.35)', driftX: 18, driftY: 20, rotate: 18, blur: '0px' },
  { glyph: '⬢', tone: 'vibranium', x: '88%', y: '22%', delay: 0.6, dur: 6.8, size: 'text-2xl sm:text-3xl', glow: 'rgba(157,0,255,0.28)', driftX: -22, driftY: 16, rotate: -16, blur: '0px' },
  { glyph: '◈', tone: 'silver', x: '5%',  y: '65%', delay: 1.1, dur: 7.5, size: 'text-xl sm:text-2xl', glow: 'rgba(203,213,225,0.30)', driftX: 14, driftY: -18, rotate: 14, blur: '1px' },
  { glyph: '❖', tone: 'cyan', x: '92%', y: '70%', delay: 0.3, dur: 6.6, size: 'text-2xl sm:text-3xl', glow: 'rgba(0,240,255,0.24)', driftX: -20, driftY: -22, rotate: 15, blur: '0px' },
  { glyph: '✧', tone: 'silver', x: '50%', y: '8%',  delay: 0.8, dur: 5.8, size: 'text-xl sm:text-2xl', glow: 'rgba(255,255,255,0.28)', driftX: 0, driftY: 18, rotate: 10, blur: '0px' },
  { glyph: '◬', tone: 'vibranium', x: '18%', y: '88%', delay: 1.4, dur: 7.1, size: 'text-xl sm:text-2xl', glow: 'rgba(157,0,255,0.24)', driftX: 20, driftY: -14, rotate: -18, blur: '0px' },
  { glyph: '▣', tone: 'cyan', x: '80%', y: '85%', delay: 0.5, dur: 7.4, size: 'text-xl sm:text-2xl', glow: 'rgba(0,240,255,0.24)', driftX: -18, driftY: -12, rotate: -12, blur: '0px' },
  { glyph: '⬡', tone: 'vibranium', x: '72%', y: '12%', delay: 1.7, dur: 8.1, size: 'text-xl sm:text-2xl', glow: 'rgba(157,0,255,0.26)', driftX: -24, driftY: 18, rotate: 12, blur: '1px' },
  { glyph: '◉', tone: 'silver', x: '24%', y: '12%', delay: 1.2, dur: 7.9, size: 'text-xl sm:text-2xl', glow: 'rgba(196,181,253,0.30)', driftX: 16, driftY: 24, rotate: -14, blur: '0px' },
];

const HERO_BURST_EMOJIS = [
  { glyph: '✦', tone: 'cyan', x: -160, y: -90, delay: 0.05, rotate: -24 },
  { glyph: '✧', tone: 'silver', x: -90, y: -122, delay: 0.14, rotate: 12 },
  { glyph: '⬢', tone: 'vibranium', x: 150, y: -82, delay: 0.18, rotate: 26 },
  { glyph: '❖', tone: 'vibranium', x: 182, y: 24, delay: 0.28, rotate: -18 },
  { glyph: '◈', tone: 'silver', x: 86, y: 122, delay: 0.36, rotate: 16 },
  { glyph: '◬', tone: 'cyan', x: -136, y: 92, delay: 0.24, rotate: -12 },
];

// Staggered children wrapper
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.10, delayChildren: 0.25 } } };
const fadeBlurUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)', scale: 0.95 },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

function GlitchTitle({ ready }) {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    if (!ready) return;
    const fire = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 180);
    };
    fire();
    const id = setInterval(fire, 3800);
    return () => clearInterval(id);
  }, [ready]);

  return (
    <div className="relative overflow-hidden">
      <motion.h1
        initial={{ y: '105%', opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="text-[13vw] sm:text-[9.5vw] md:text-[7vw] lg:text-[6vw] font-heading font-black uppercase leading-none tracking-tight hero-shimmer-text select-none"
      >
        CYSTECH 2K26
      </motion.h1>
      {/* glitch layers */}
      <AnimatePresence>
        {glitch && (
          <>
            <motion.h1
              key="g1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="absolute inset-0 text-[13vw] sm:text-[9.5vw] md:text-[7vw] lg:text-[6vw] font-heading font-black uppercase leading-none tracking-tight pointer-events-none select-none"
              style={{ color: '#00f0ff', left: '3px', top: '-2px', clipPath: 'inset(0 0 60% 0)' }}
            >
              CYSTECH 2K26
            </motion.h1>
            <motion.h1
              key="g2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.10, delay: 0.04 }}
              className="absolute inset-0 text-[13vw] sm:text-[9.5vw] md:text-[7vw] lg:text-[6vw] font-heading font-black uppercase leading-none tracking-tight pointer-events-none select-none"
              style={{ color: '#FF00AA', left: '-3px', top: '2px', clipPath: 'inset(60% 0 0 0)' }}
            >
              CYSTECH 2K26
            </motion.h1>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function VibraniumGlyph({ glyph, tone = 'vibranium', className = '', style }) {
  const toneStyle = GLYPH_TONES[tone] ?? GLYPH_TONES.vibranium;

  return (
    <span
      className={`inline-block select-none bg-clip-text text-transparent ${className}`}
      style={{
        ...toneStyle,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        ...style,
      }}
    >
      {glyph}
    </span>
  );
}

function FloatingEmoji({ item, index }) {
  return (
    <motion.div
      className="absolute z-[3] pointer-events-none select-none"
      style={{ left: item.x, top: item.y }}
      initial={{ opacity: 0, scale: 0.4, rotate: item.rotate * -0.3 }}
      animate={{
        opacity: [0, 0.95, 0.72, 0.95],
        x: [0, item.driftX, item.driftX * -0.45, 0],
        y: [0, item.driftY * -1, item.driftY, 0],
        rotate: [item.rotate * -0.4, item.rotate, item.rotate * -0.7, 0],
        scale: [0.85, 1.16, 0.96, 1.06],
      }}
      transition={{
        duration: item.dur,
        repeat: Infinity,
        delay: item.delay + index * 0.04,
        ease: 'easeInOut',
      }}
    >
      <motion.div
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/6 backdrop-blur-md sm:h-16 sm:w-16"
        animate={{
          boxShadow: [
            `0 0 0 rgba(255,255,255,0), 0 0 16px ${item.glow}`,
            `0 0 24px ${item.glow}, 0 0 44px ${item.glow}`,
            `0 0 12px ${item.glow}, 0 0 28px ${item.glow}`,
          ],
          borderColor: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.24)', 'rgba(255,255,255,0.12)'],
        }}
        transition={{ duration: item.dur * 0.6, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}
      >
        <div
          className="absolute inset-[6px] rounded-full"
          style={{ background: `radial-gradient(circle, ${item.glow}, transparent 72%)` }}
        />
        <motion.span
          className={`${item.size} relative z-10 block`}
          style={{ filter: `blur(${item.blur})` }}
          animate={{ y: [0, -4, 0, 3, 0], scale: [1, 1.08, 1, 0.98, 1] }}
          transition={{ duration: item.dur * 0.5, repeat: Infinity, ease: 'easeInOut', delay: item.delay * 0.8 }}
        >
          <VibraniumGlyph glyph={item.glyph} tone={item.tone} className="block" />
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

function EmojiBurst({ ready }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-[3] hidden -translate-x-1/2 -translate-y-1/2 md:block">
      {HERO_BURST_EMOJIS.map((item) => (
        <motion.span
          key={`${item.glyph}-${item.x}-${item.y}`}
          className="absolute left-0 top-0 text-2xl"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.2, rotate: 0 }}
          animate={ready ? {
            opacity: [0, 1, 0.85, 0],
            x: [0, item.x * 0.3, item.x],
            y: [0, item.y * 0.3, item.y],
            scale: [0.2, 1.15, 0.92],
            rotate: [0, item.rotate, item.rotate * 1.3],
          } : {}}
          transition={{ duration: 1.55, delay: 0.65 + item.delay, ease: [0.16, 1, 0.3, 1] }}
        >
          <VibraniumGlyph glyph={item.glyph} tone={item.tone} className="text-2xl sm:text-3xl" />
        </motion.span>
      ))}
    </div>
  );
}

export default function Hero() {
  const [videoReady, setVideoReady] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });
  const [btnHovered, setBtnHovered] = useState(false);
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section ref={heroRef} className="relative h-screen bg-black overflow-hidden" onMouseMove={!isTouch ? handleMouseMove : undefined}>
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Three.js floating particles */}
        {!isTouch && (
          <Suspense fallback={null}>
            <HeroParticles />
          </Suspense>
        )}

        {/* Video with parallax zoom */}
        <motion.div style={{ scale: videoScale, opacity: videoOpacity }} className="absolute inset-0">
          <video
            src={heroVideo}
            autoPlay loop muted playsInline preload="auto"
            onLoadedData={() => setVideoReady(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
          />
        </motion.div>

        {/* Loading spinner */}
        <AnimatePresence>
          {!videoReady && (
            <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center bg-black z-50">
              <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/80 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating emoji orbs */}
        {videoReady && !isTouch && FLOAT_EMOJIS.map((item, index) => (
          <FloatingEmoji key={`${item.glyph}-${item.x}-${item.y}`} item={item} index={index} />
        ))}

        {/* Mouse-tracking spotlight */}
        {!isTouch && (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: spotlight.x
                ? `radial-gradient(800px circle at ${spotlight.x}px ${spotlight.y}px, rgba(157,0,255,0.14), transparent 55%)`
                : 'none',
              transition: 'background 60ms linear',
            }}
          />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-[#030005]/95 pointer-events-none" />

        {/* Content */}
        <motion.div
          style={{ y: contentY }}
          variants={stagger}
          initial="hidden"
          animate={videoReady ? 'visible' : 'hidden'}
          className="absolute inset-0 z-[4] flex flex-col items-center justify-center px-6 text-center"
        >
          <EmojiBurst ready={videoReady} />

          {/* Badge */}
          <motion.div
            variants={fadeBlurUp}
            whileHover={{ scale: 1.07, boxShadow: '0 0 20px rgba(157,0,255,0.4)' }}
            className="mb-6 rounded-full border border-[#9D00FF]/50 bg-[#9D00FF]/10 px-5 py-2 cursor-default"
          >
            <div className="flex items-center gap-3">
              <motion.span
                className="w-2 h-2 rounded-full bg-[#00f0ff]"
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <VibraniumGlyph glyph="◈" tone="vibranium" className="text-sm" />
              <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/90 font-bold">
                Registration Open
              </span>
              <span className="font-mono text-[9px] text-[#9D00FF]/80 font-bold">2026</span>
            </div>
          </motion.div>

          {/* Glitch Title */}
          <motion.div variants={fadeBlurUp}>
            <GlitchTitle ready={videoReady} />
          </motion.div>

          {/* Tagline */}
          <motion.div variants={fadeBlurUp} className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'Innovation' },
              { glyph: '✦', tone: 'cyan' },
              { label: 'Technology' },
              { glyph: '⬢', tone: 'vibranium' },
              { label: 'One Stage', accent: true },
            ].map((item, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={videoReady ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`font-mono uppercase tracking-[0.2em] text-[11px] ${
                  item.glyph ? 'text-lg' :
                  item.accent ? 'text-[#9D00FF] font-black' : 'text-white/60'
                }`}
              >
                {item.glyph ? <VibraniumGlyph glyph={item.glyph} tone={item.tone} className="text-lg" /> : item.label}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div variants={fadeBlurUp} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: '0 0 40px rgba(157,0,255,0.8), 0 0 80px rgba(157,0,255,0.3)',
              }}
              whileTap={{ scale: 0.93 }}
              onHoverStart={() => setBtnHovered(true)}
              onHoverEnd={() => setBtnHovered(false)}
              onClick={() => document.querySelector('#register')?.scrollIntoView({ behavior: 'smooth' })}
              className="relative rounded-full px-10 py-3.5 font-mono text-[11px] tracking-[0.25em] uppercase font-black overflow-hidden bg-[#9D00FF] text-white shadow-[0_0_28px_rgba(157,0,255,0.5)]"
            >
              <AnimatePresence>
                {btnHovered && (
                  <motion.span
                    key="ripple"
                    className="absolute inset-0 bg-white/20 rounded-full"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                <VibraniumGlyph glyph="⬢" tone="silver" className="text-sm" />
                <span>Register Now</span>
              </span>
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.08,
                borderColor: 'rgba(0,240,255,0.6)',
                boxShadow: '0 0 24px rgba(0,240,255,0.2)',
                color: '#00f0ff',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/technical')}
              className="rounded-full px-10 py-3.5 font-mono text-[11px] tracking-[0.25em] uppercase text-white/80 border border-white/25 bg-white/5 font-bold transition-colors duration-200"
            >
              <span className="flex items-center gap-2">
                <VibraniumGlyph glyph="✦" tone="cyan" className="text-sm" />
                <span>Explore Events</span>
              </span>
            </motion.button>
          </motion.div>

          {/* Stats — bouncy pop-in */}
          <motion.div variants={fadeBlurUp} className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <span className="hidden sm:block w-px h-8 bg-white/10" />}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={videoReady ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ delay: 1.0 + i * 0.1, duration: 0.6, type: 'spring', stiffness: 300, damping: 18 }}
                  whileHover={{ scale: 1.15, y: -4 }}
                  className="text-center cursor-default"
                >
                  <div className="mb-0.5">
                    <VibraniumGlyph glyph={s.glyph} tone={s.tone} className="text-lg" />
                  </div>
                  <div className="font-heading text-2xl sm:text-3xl font-black text-white">
                    {s.value}
                  </div>
                  <div className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-white/40 mt-0.5">
                    {s.label}
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom "REGISTRATION OPEN" floating pill */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={videoReady ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-8 right-8 z-[5] hidden md:flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#9D00FF]/50 bg-[#030005]/80 backdrop-blur-md"
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-[#00f0ff]"
            animate={{ scale: [1, 1.8, 1], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">Registration Open</span>
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 0 20px rgba(157,0,255,0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.querySelector('#register')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-4 py-1.5 rounded-full bg-[#9D00FF] text-white font-mono text-[9px] tracking-[0.15em] uppercase font-black"
          >
            Register Now
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={videoReady ? { opacity: 1 } : {}}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-2 pointer-events-none"
        >
          <motion.span
            className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/30"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll
          </motion.span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 rounded-full bg-[#9D00FF]"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
