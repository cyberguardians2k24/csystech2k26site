import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { EVENT_STATS } from '../data/events';

// ── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function EnergyReveal() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'center center'] });

  const pathLength1 = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const pathLength2 = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);
  const pathLength3 = useTransform(scrollYProgress, [0.2, 1], [0, 1]);
  const pathLength4 = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0.4, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0.4, 1], [40, 0]);

  return (
    <section ref={containerRef} className="section-shell relative py-20 md:py-36 lg:py-40 bg-wakanda-dark overflow-hidden flex items-center justify-center md:min-h-screen">
      <div className="absolute inset-0 mesh-fade opacity-20 pointer-events-none" />
      <div className="absolute left-[8%] top-16 w-72 h-72 rounded-full bg-vibranium/10 blur-[120px] pointer-events-none hidden md:block" />
      <div className="absolute right-[10%] bottom-12 w-72 h-72 rounded-full bg-holo-cyan/8 blur-[120px] pointer-events-none hidden md:block" />

      {/* SVG Energy Web */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          width="100%" height="100%"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0"
        >
          {/* Main sweeping curves */}
          <motion.path
            d="M -100,400 C 200,200 400,700 600,400 C 800,100 1000,600 1300,400"
            fill="none" stroke="#9D00FF" strokeWidth="3" strokeLinecap="round"
            style={{ pathLength: pathLength1 }}
            className="drop-shadow-[0_0_12px_rgba(157,0,255,0.9)]"
          />
          <motion.path
            d="M -100,500 C 300,300 500,700 700,450 C 900,200 1100,650 1300,500"
            fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeLinecap="round"
            style={{ pathLength: pathLength2 }}
            className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
            opacity={0.7}
          />
          {/* Diagonal energy strikes */}
          <motion.path
            d="M 0,0 C 200,150 400,50 600,300 C 800,550 1000,200 1200,400"
            fill="none" stroke="#9D00FF" strokeWidth="1" strokeLinecap="round"
            style={{ pathLength: pathLength3 }}
            className="drop-shadow-[0_0_6px_rgba(157,0,255,0.6)]"
            opacity={0.4}
          />
          <motion.path
            d="M 1200,0 C 1000,200 800,100 600,350 C 400,600 200,250 0,450"
            fill="none" stroke="#6B00BE" strokeWidth="1" strokeLinecap="round"
            style={{ pathLength: pathLength4 }}
            opacity={0.35}
          />
          {/* Grid intersection dots */}
          {[200, 400, 600, 800, 1000].map((x, i) => (
            <motion.circle
              key={i}
              cx={x} cy={400 + Math.sin(i) * 60}
              r="3"
              fill="#9D00FF"
              className="drop-shadow-[0_0_6px_rgba(157,0,255,1)]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.5], scale: [0, 1.5, 1] }}
              transition={{ delay: 1.5 + i * 0.2, duration: 0.8 }}
            />
          ))}
        </svg>
      </div>

      {/* Content Panel */}
      <motion.div
        style={{ opacity, y }}
        className="panel-sheen relative z-10 max-w-5xl mx-auto px-6 text-center holographic-panel p-12 md:p-16 border-vibranium/30 shadow-vibranium-glow"
      >
        <div className="absolute inset-0 mesh-fade opacity-30 pointer-events-none" />
        {/* Corner brackets — gold (BP detail) */}
        <span className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: 'rgba(157,0,255,0.7)' }} />
        <span className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: 'rgba(157,0,255,0.7)' }} />
        <span className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: 'rgba(157,0,255,0.7)' }} />
        <span className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: 'rgba(157,0,255,0.7)' }} />

        <div className="flex items-center gap-4 justify-center mb-6">
          <div className="h-px w-8 bg-vibranium" />
          <p className="font-mono text-xs tracking-[0.25em] text-vibranium uppercase text-glow-vibranium">Sympho Pulse Matrix</p>
          <div className="h-px w-8 bg-vibranium" />
        </div>

        <h2 className="text-4xl md:text-6xl font-black font-heading tracking-tighter uppercase mb-6 text-white text-glow-vibranium">
          A <span className="bp-vibranium-text">Sympho Experience</span>
        </h2>
        <p className="text-base md:text-xl text-white/60 font-mono tracking-wide leading-relaxed max-w-2xl mx-auto">
          Immersive visuals, electric competition, signature stage energy, and next-gen campus atmosphere — crafted to feel cinematic from the first scroll to the final registration tap.
        </p>

        {/* Animated Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {[
            { target: EVENT_STATS.totalCount, suffix: '', label: 'Events', gold: false },
            { target: EVENT_STATS.technicalCount, suffix: '', label: 'Technical', gold: false },
            { target: 99, suffix: 'K+', label: 'Prize Pool ₹', gold: true },
            { target: 700, suffix: '+', label: 'Participants', gold: false },
          ].map(({ target, suffix, label, gold }, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, scale: 1.03 }}
              className={`panel-sheen rounded-[1.6rem] px-5 py-6 border ${gold ? 'border-vibranium/35 bg-vibranium/6' : 'border-vibranium/14 bg-white/[0.02]'} flex flex-col items-center justify-center`}
            >
              {gold ? (
                <span className="text-4xl md:text-5xl font-black font-heading bp-vibranium-text text-glow-vibranium">
                  <AnimatedCounter target={target} suffix={suffix} />
                </span>
              ) : (
                <span className="text-4xl md:text-5xl font-black font-heading text-vibranium-light text-glow-vibranium">
                  <AnimatedCounter target={target} suffix={suffix} />
                </span>
              )}
              <span className={`text-xs font-mono uppercase tracking-widest mt-2 ${gold ? 'text-vibranium/70' : 'text-white/40'}`}>{label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
