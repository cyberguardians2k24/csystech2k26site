import React, { useState, useRef, useCallback, lazy, Suspense, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import heroVideo from '../../Assets/hero/cystek cdo 2 selected.mp4';
import { EVENT_STATS } from '../data/events';
import { SPEAKERS } from '../data/speakers';
import { SPONSOR_TIERS, countSponsors } from '../data/sponsors';
import { api } from '../lib/api';
const HeroParticles = lazy(() => import('./HeroParticles'));

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

// ─── Event date ──────────────────────────────────────────────────────────────
const EVENT_DATE = new Date('2026-04-08T09:00:00+05:30');

const GLYPH_TONES = {
  vibranium: {
    backgroundImage: 'linear-gradient(135deg, #fef2f2 0%, #fca5a5 25%, #C41E3A 58%, #991b1b 100%)',
    textShadow: '0 0 18px rgba(196, 30, 58,0.38)',
  },
  cyan: {
    backgroundImage: 'linear-gradient(135deg, #fffbeb 0%, #fde68a 35%, #FFD700 68%, #b45309 100%)',
    textShadow: '0 0 18px rgba(255, 215, 0,0.34)',
  },
  silver: {
    backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 35%, #cbd5e1 65%, #94a3b8 100%)',
    textShadow: '0 0 16px rgba(255,255,255,0.24)',
  },
};

function formatCount(value) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') return value.toLocaleString('en-IN');
  return String(value);
}

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, target - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(id);
  }, [target]);
  const totalSeconds = Math.floor(timeLeft / 1000);
  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

// Staggered children wrapper
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.10, delayChildren: 0.25 } } };
const fadeBlurUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)', scale: 0.95 },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

function GlitchTitle({ ready }) {
  return (
    <div className="relative overflow-visible py-3 flex justify-center items-center">
      {/* Deep red chaos aura behind text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute w-[120%] h-[120%] bg-vibranium/20 blur-[60px] rounded-full chaos-aura z-0 pointer-events-none"
      />
      
      {/* 3D Gold Shimmering Title */}
      <motion.h1
        initial={{ y: '20%', opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative z-10 block text-[13vw] sm:text-[9.5vw] md:text-[7vw] lg:text-[6vw] font-heading font-black uppercase leading-[1.16] tracking-tight gold-metallic-text select-none pt-[0.06em] pb-[0.16em]"
      >
        CYSTECH2K26
      </motion.h1>
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

// ─── HUD corner brackets ──────────────────────────────────────────────────────
function HudCorners({ ready }) {
  const SIZE = 36;
  const THICKNESS = 2;
  const COLOR = 'rgba(196,30,58,0.6)';
  const corner = (pos) => {
    const [y, x] = pos.split('-');
    return (
      <motion.div
        key={pos}
        className="absolute"
        style={{
          [y]: 24, [x]: 24,
          width: SIZE, height: SIZE,
          borderTop: y === 'top' ? `${THICKNESS}px solid ${COLOR}` : 'none',
          borderBottom: y === 'bottom' ? `${THICKNESS}px solid ${COLOR}` : 'none',
          borderLeft: x === 'left' ? `${THICKNESS}px solid ${COLOR}` : 'none',
          borderRight: x === 'right' ? `${THICKNESS}px solid ${COLOR}` : 'none',
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={ready ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
    );
  };
  return (
    <div className="absolute inset-0 pointer-events-none z-[6]">
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner)}
    </div>
  );
}

// ─── Countdown unit ───────────────────────────────────────────────────────────
function CountUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <motion.span
        key={value}
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="font-heading font-black text-white text-xl sm:text-2xl leading-none tabular-nums"
        style={{ textShadow: '0 0 20px rgba(196,30,58,0.7)' }}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="font-mono text-[7px] tracking-[0.25em] uppercase text-white/35 mt-0.5">{label}</span>
    </div>
  );
}

// ─── Vertical side data column (desktop only) ─────────────────────────────────
function SideDataColumn({ ready, side = 'left' }) {
  const lines = side === 'left'
    ? ['08 APR 2026', 'DEPT. OF C.S.', 'OFFLINE MODE', 'OPEN TO ALL']
    : ['CYSTECH 2K26', 'EDITION IV', 'TAMBARAM', 'CHENNAI-601301'];
  return (
    <motion.div
      className={`absolute top-1/2 -translate-y-1/2 ${side === 'left' ? 'left-5' : 'right-5'} z-[5] hidden lg:flex flex-col items-center gap-3 pointer-events-none`}
      initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
      animate={ready ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#C41E3A]/40 to-transparent" />
      {lines.map((line, i) => (
        <motion.span
          key={line}
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1.8 + i * 0.1 }}
          className="font-mono text-[9px] tracking-[0.28em] uppercase text-white/25"
          style={{ writingMode: 'vertical-lr', letterSpacing: '0.3em' }}
        >
          {line}
        </motion.span>
      ))}
      <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#C41E3A]/40 to-transparent" />
    </motion.div>
  );
}

// ─── Burst emoji ring ─────────────────────────────────────────────────────────
function HexagonGrid({ ready }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={ready ? { opacity: 0.15 } : {}}
      transition={{ duration: 2, delay: 1 }}
      className="absolute inset-0 pointer-events-none z-[1] overflow-hidden"
    >
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.923' viewBox='0 0 60 103.923' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 17.32v34.641L30 69.282 0 51.961V17.32z' fill='none' stroke='%23C41E3A' stroke-opacity='0.2' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 138.56px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
    </motion.div>
  );
}

function RadarSweep({ ready }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={ready ? { opacity: 1 } : {}}
      transition={{ duration: 1, delay: 2 }}
      className="absolute inset-0 pointer-events-none z-[2] flex items-center justify-center overflow-hidden"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="w-[150vw] h-[150vw] max-w-[1200px] max-h-[1200px] rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent 70%, rgba(196,30,58,0.1) 95%, rgba(196,30,58,0.4) 100%)',
        }}
      />
    </motion.div>
  );
}
const HERO_BURST_EMOJIS = [
  { glyph: '✦', tone: 'gold', x: -160, y: -90, delay: 0.05, rotate: -24 },
  { glyph: '✧', tone: 'silver', x: -90, y: -122, delay: 0.14, rotate: 12 },
  { glyph: '⬢', tone: 'vibranium', x: 150, y: -82, delay: 0.18, rotate: 26 },
  { glyph: '❖', tone: 'vibranium', x: 182, y: 24, delay: 0.28, rotate: -18 },
  { glyph: '◈', tone: 'silver', x: 86, y: 122, delay: 0.36, rotate: 16 },
  { glyph: '◬', tone: 'gold', x: -136, y: 92, delay: 0.24, rotate: -12 },
];

function EmojiBurst({ ready }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-[3] hidden -translate-x-1/2 -translate-y-1/2 md:block">
      {HERO_BURST_EMOJIS.map((item) => (
        <motion.span
          key={`${item.glyph}-${item.x}-${item.y}`}
          className="absolute left-0 top-0 text-2xl"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.5, rotate: 0 }}
          animate={ready ? {
            opacity: [0, 0.8, 0.2, 0],
            x: [0, item.x * 0.4, item.x],
            y: [0, item.y * 0.4, item.y],
            scale: [0.5, 1.4, 0.8],
            rotate: [0, item.rotate * 2, item.rotate * 4],
          } : {}}
          transition={{ duration: 2.5, delay: 0.65 + item.delay, ease: "easeOut" }}
        >
          <span className="text-vibranium-gold drop-shadow-[0_0_12px_rgba(196,30,58,0.8)] blur-[1px]">{item.glyph}</span>
        </motion.span>
      ))}
    </div>
  );
}

export default function Hero() {
  const [videoReady, setVideoReady] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });
  const [btnHovered, setBtnHovered] = useState(false);
  const [participantCount, setParticipantCount] = useState(null);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const countdown = useCountdown(EVENT_DATE.getTime());

  useEffect(() => {
    let mounted = true;
    api.getStats()
      .then((stats) => {
        if (!mounted) return;
        setParticipantCount(typeof stats?.totalParticipants === 'number' ? stats.totalParticipants : null);
      })
      .catch(() => {
        if (!mounted) return;
        setParticipantCount(null);
      });
      
    return () => { mounted = false; };
  }, []);

  const mouseX = useSpring(0, { stiffness: 100, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 30 });

  const handleMouseMove = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    
    // Calculate normalized 3D tilt coordinates (-1 to 1)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 20); // max 10 degrees tilt
    mouseY.set(y * -20);
  }, [mouseX, mouseY]);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const stats = [
    { value: formatCount(EVENT_STATS.totalCount), label: 'Events', glyph: '⬢', tone: 'vibranium' },
    { value: formatCount(participantCount), label: 'Participants', glyph: '✦', tone: 'gold' },
    { value: formatCount(SPEAKERS.length), label: 'Speakers', glyph: '◈', tone: 'silver' },
    (() => {
      const sponsorCount = countSponsors(SPONSOR_TIERS);
      return {
        value: sponsorCount > 0 ? formatCount(sponsorCount) : 'TBA',
        label: 'Sponsors',
        glyph: '❖',
        tone: 'vibranium',
      };
    })(),
  ];

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
            autoPlay muted playsInline preload="auto"
            onLoadedData={() => setVideoReady(true)}
            onEnded={() => setVideoEnded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
          />
        </motion.div>

        {/* Loading spinner */}
        <AnimatePresence>
          {!videoReady && (
            <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
              <div className="relative w-16 h-16">
                 <div className="absolute inset-0 border-[3px] border-t-[#C41E3A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_1s_linear_infinite]" />
                 <div className="absolute inset-2 border-[2px] border-t-vibranium border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
              </div>
              <p className="mt-4 font-mono text-[9px] tracking-[0.4em] text-[#C41E3A] uppercase animate-pulse">Initializing Chaos Engine...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <HexagonGrid ready={videoReady} />
        <RadarSweep ready={videoReady} />

        {/* ── Cinematic light leaks ─────────────────────────────────────────── */}
        <motion.div
          animate={{ opacity: [0, 0.4, 0.2, 0.4], scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#C41E3A]/20 blur-[130px] pointer-events-none mix-blend-screen z-[2]"
        />
        <motion.div
          animate={{ opacity: [0, 0.3, 0.5, 0.3], scale: [1, 1.4, 1.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 2 }}
          className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-[#FFD700]/15 blur-[160px] pointer-events-none mix-blend-screen z-[2]"
        />
        <motion.div
          animate={{ opacity: [0, 0.25, 0.1, 0.25] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 4 }}
          className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-[#E8A000]/10 blur-[140px] pointer-events-none mix-blend-screen z-[3]"
        />

        {/* ── Cinematic vignette ───────────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.95) 100%)',
          }}
        />

        {/* ── Scanline flicker ─────────────────────────────────────────────── */}
        <div className="absolute inset-0 scanlines opacity-[0.08] pointer-events-none z-[4]" />

        {/* ── Horizontal crimson light streak (top) ───────────────────────── */}
        <motion.div
          animate={{ opacity: [0.0, 0.25, 0.0], scaleX: [0.7, 1.1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[12%] left-1/2 -translate-x-1/2 h-px w-[60vw] max-w-3xl pointer-events-none z-[3]"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(196,30,58,0.55),rgba(232,160,0,0.4),transparent)' }}
        />

        {/* ── Mouse spotlight ──────────────────────────────────────────────── */}
        {!isTouch && (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: spotlight.x
                ? `radial-gradient(600px circle at ${spotlight.x}px ${spotlight.y}px, rgba(196,30,58,0.10), transparent 55%)`
                : 'none',
              transition: 'background 60ms linear',
            }}
          />
        )}

        {/* ── Bottom fade ──────────────────────────────────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-[3]" />

        {/* ── HUD corner brackets ──────────────────────────────────────────── */}
        <HudCorners ready={videoReady} />

        {/* ── Vertical side columns ─────────────────────────────────────────── */}
        <SideDataColumn ready={videoReady} side="left" />
        <SideDataColumn ready={videoReady} side="right" />

        {/* ── Main content ─────────────────────────────────────────────────── */}
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
            whileHover={{ scale: 1.07, boxShadow: '0 0 20px rgba(196, 30, 58,0.4)' }}
            className="mb-8 rounded-full border border-[#C41E3A]/50 bg-[#C41E3A]/10 px-5 py-2 cursor-default"
          >
            <div className="flex items-center gap-3">
              <motion.span
                className="w-2 h-2 rounded-full bg-[#FFD700]"
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <VibraniumGlyph glyph="◈" tone="vibranium" className="text-sm" />
              <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/90 font-bold">
                Registration Open
              </span>
              <span className="font-mono text-[9px] text-[#C41E3A]/80 font-bold">2026</span>
            </div>
          </motion.div>

          <div className="h-32 mb-8 flex items-center justify-center pointer-events-none">
            <AnimatePresence>
              {videoEnded && (
                <motion.div
                  key="hero-title"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <GlitchTitle ready={true} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA buttons */}
          <motion.div variants={fadeBlurUp} className="flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: '0 0 40px rgba(196, 30, 58,0.8), 0 0 80px rgba(196, 30, 58,0.3)',
              }}
              whileTap={{ scale: 0.93 }}
              onHoverStart={() => setBtnHovered(true)}
              onHoverEnd={() => setBtnHovered(false)}
              onClick={() => navigate('/register')}
              className="relative rounded-full px-10 py-3.5 font-mono text-[11px] tracking-[0.25em] uppercase font-black overflow-hidden bg-[#C41E3A] text-white shadow-[0_0_28px_rgba(196,30,58,0.5)]"
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
                <span className="text-lg">✧</span>
                <span>Register Now</span>
              </span>
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/technical')}
              className="chaos-button-hover rounded-full px-10 py-3.5 font-mono text-[11px] tracking-[0.25em] uppercase text-vibranium-gold border border-vibranium-gold/30 bg-vibranium/10 font-bold transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">◈</span>
                <span>Explore Events</span>
              </span>
            </motion.button>
          </motion.div>

          {/* Stats — 3D Tilt pop-in */}
          <motion.div 
            variants={fadeBlurUp} 
            style={{ rotateX: mouseY, rotateY: mouseX, transformPerspective: 1000 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md px-8 py-5 shadow-[0_0_50px_rgba(196,30,58,0.15)]"
          >
            {stats.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <span className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-[#C41E3A]/40 to-transparent" />}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={videoReady ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ delay: 1.0 + i * 0.1, duration: 0.6, type: 'spring', stiffness: 300, damping: 18 }}
                  whileHover={{ scale: 1.15, y: -4, filter: 'brightness(1.5)' }}
                  className="text-center cursor-default min-w-[80px]"
                >
                  <div className="mb-0.5">
                    <VibraniumGlyph glyph={s.glyph} tone={s.tone} className="text-xl drop-shadow-[0_0_8px_currentColor]" />
                  </div>
                  <div className="font-heading text-2xl sm:text-4xl font-black text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                    {s.value}
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/50 mt-1">
                    {s.label}
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Bottom "REGISTRATION OPEN" floating pill ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={videoReady ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-8 right-8 z-[5] hidden md:flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#C41E3A]/50 bg-[#030005]/80 backdrop-blur-md"
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-[#FFD700]"
            animate={{ scale: [1, 1.8, 1], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">Registration Open</span>
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 0 20px rgba(196, 30, 58,0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="px-4 py-1.5 rounded-full bg-[#C41E3A] text-white font-mono text-[9px] tracking-[0.15em] uppercase font-black"
          >
            Register Now
          </motion.button>
        </motion.div>

        {/* ── Scroll indicator ─────────────────────────────────────────────── */}
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
              className="w-1 h-2 rounded-full bg-[#C41E3A]"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
