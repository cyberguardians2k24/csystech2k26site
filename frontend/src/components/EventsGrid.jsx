import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ALL_EVENTS, CATEGORY_META, EVENT_STATS, FEATURED_HOME_EVENTS } from '../data/events';

const getRegistrationPath = (event) => (
  event?.category === 'technical' ? '/register' : `/register/${event.id}`
);

function PosterModal({ ev, isOpen, onClose }) {
  if (!isOpen || !ev.poster) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-2xl w-full"
        >
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white/60 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>

          <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-black/40">
            <img
              src={ev.poster}
              alt={`${ev.title} poster - full view`}
              className="w-full h-auto rounded-3xl"
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 pb-6 px-6"
            >
              <h3 className="text-2xl md:text-3xl font-heading font-black text-white mb-3">
                {ev.title}
              </h3>
              <p className="text-white/70 text-sm md:text-base mb-4">{ev.tagline}</p>

              <Link
                to={getRegistrationPath(ev)}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#C41E3A]/40 bg-[linear-gradient(135deg,rgba(255,215,0,0.25),rgba(139,0,0,0.22))] text-white font-heading font-bold tracking-[0.12em] uppercase text-xs shadow-[0_0_30px_rgba(255,215,0,0.2)] hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.35)] transition-all duration-300"
              >
                Register Now
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const FILTERS = [
  { id: 'all', label: 'All Programs' },
  { id: 'technical', label: 'Technical' },
  { id: 'non-technical', label: 'Non-Technical' },
];

function EventCard({ ev, i }) {
  const [expanded, setExpanded] = useState(false);
  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [isDesktopInteraction, setIsDesktopInteraction] = useState(false);
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 150, damping: 18, mass: 0.4 });
  const springY = useSpring(my, { stiffness: 150, damping: 18, mass: 0.4 });
  const rx = useTransform(springY, [-0.5, 0.5], ['2deg', '-2deg']);
  const ry = useTransform(springX, [-0.5, 0.5], ['-2deg', '2deg']);
  const glowX = useTransform(springX, [-0.5, 0.5], ['35%', '65%']);
  const glowY = useTransform(springY, [-0.5, 0.5], ['35%', '65%']);

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetMove = () => {
    mx.set(0);
    my.set(0);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
    const handleChange = () => setIsDesktopInteraction(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: i * 0.07, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      whileHover={isDesktopInteraction ? { y: -3 } : undefined}
      style={isDesktopInteraction ? { rotateX: rx, rotateY: ry } : undefined}
      onMouseMove={isDesktopInteraction ? handleMove : undefined}
      onMouseLeave={isDesktopInteraction ? resetMove : undefined}
      className={`group panel-sheen relative flex flex-col justify-between p-5 sm:p-7 md:p-8 rounded-[2rem] border border-white/8 bg-[#0a0200]/72 backdrop-blur-2xl overflow-hidden cursor-pointer ${ev.span}`}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(196,30,58,0.18),transparent_24%),radial-gradient(circle_at_85%_85%,rgba(232,160,0,0.12),transparent_26%)] opacity-70 pointer-events-none" />
      <div className={`absolute inset-0 bg-gradient-to-br ${ev.color} opacity-[0.08] group-hover:opacity-[0.16] transition-opacity duration-500 pointer-events-none`} />
      <div className="absolute inset-0 bg-holo-grid bg-grid-sm opacity-[0.04] group-hover:opacity-[0.12] transition-opacity pointer-events-none" />
      <div className="absolute inset-0 rounded-[2rem] border border-transparent group-hover:border-vibranium/30 transition-colors duration-500 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <motion.div
          className="absolute inset-0 rounded-[2rem]"
          style={{
            background: isDesktopInteraction
              ? `radial-gradient(circle at ${glowX} ${glowY}, rgba(196,30,58,0.16), rgba(0,0,0,0) 42%)`
              : 'radial-gradient(circle at 50% 50%, rgba(196,30,58,0.16), rgba(0,0,0,0) 42%)',
          }}
        />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-4 min-h-[9.5rem]">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full border border-[#C41E3A]/30 bg-[#C41E3A]/10 font-mono text-[10px] tracking-[0.22em] uppercase text-[#E8A000]">
              {ev.tag}
            </span>
            <span className={`px-3 py-1 rounded-full border font-mono text-[10px] tracking-[0.22em] uppercase ${CATEGORY_META[ev.category].chip}`}>
              {CATEGORY_META[ev.category].shortLabel}
            </span>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-white/30">Featured Protocol</p>
            <h4 className="mt-2 text-2xl sm:text-3xl md:text-[2.1rem] font-black font-heading tracking-tight text-white mb-4">
              {ev.title}
            </h4>
            <p className="mt-2 text-sm font-mono text-[#C41E3A]/80 uppercase tracking-[0.18em] leading-relaxed">{ev.tagline}</p>
          </div>
        </div>

        <div className="relative shrink-0">
          <div className="absolute inset-[-10px] rounded-full border border-[#C41E3A]/25 slow-spin" />
          <div className="absolute inset-[-4px] rounded-full border border-[#FFD700]/25 slow-spin" style={{ animationDirection: 'reverse', animationDuration: '10s' }} />
          <div className="w-14 h-14 rounded-full border border-[#C41E3A]/35 bg-black/30 shadow-[0_0_30px_rgba(196,30,58,0.22)] flex items-center justify-center text-2xl">
            {ev.icon}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-7 flex-1">
        {ev.poster && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            onClick={(e) => {
              e.stopPropagation();
              setPosterModalOpen(true);
            }}
            whileHover={isDesktopInteraction ? { scale: 1.015 } : undefined}
            className="relative mb-5 overflow-hidden rounded-2xl cursor-pointer"
          >
            <motion.img
              src={ev.poster}
              alt={`${ev.title} poster`}
              className="w-full aspect-[4/3] object-cover object-top rounded-2xl border border-white/15"
              loading="lazy"
              whileHover={isDesktopInteraction ? { scale: 1.025 } : undefined}
              transition={{ duration: 0.25 }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              whileHover={isDesktopInteraction ? { opacity: 1 } : undefined}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/20 via-black/40 to-black/60 flex flex-col items-center justify-center"
            >
              <motion.div className="text-center">
                <p className="text-white font-heading font-bold text-lg mb-2">Expand View</p>
                <p className="text-white/70 text-xs font-mono tracking-widest">CLICK TO ENLARGE</p>
                <Link
                  to={getRegistrationPath(ev)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full border border-[#C41E3A]/40 bg-[linear-gradient(135deg,rgba(255,215,0,0.24),rgba(139,0,0,0.22))] text-white font-heading font-bold tracking-[0.12em] uppercase text-[10px] shadow-[0_0_24px_rgba(255,215,0,0.18)]"
                >
                  Register Now
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        <p className="text-sm md:text-[15px] text-white/60 leading-relaxed max-w-lg">{ev.desc}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 items-stretch">
          {[
            { label: 'Prize', value: ev.prize, tone: 'text-[#C41E3A]' },
            { label: 'Team', value: ev.teamSize, tone: 'text-[#FFD700]' },
            { label: 'Mode', value: ev.mode, tone: 'text-[#E8A000]' },
            { label: 'Venue', value: ev.venue.split(',')[0], tone: 'text-white/75' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-3 overflow-hidden">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/30 shrink-0 mb-1.5">{item.label}</p>
              <p className={`text-sm font-heading font-bold leading-tight break-words whitespace-normal ${item.tone}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.22em] uppercase text-[#fde68a]">
          <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
          Engage Protocol
        </div>
        <button type="button" onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }} className="px-4 py-2 rounded-full border border-[#C41E3A]/24 bg-[#C41E3A]/8 text-[#FFD700] font-mono text-[10px] tracking-[0.22em] uppercase">
          {expanded ? 'Collapse' : 'Open'}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 overflow-hidden"
          >
            <div className="mt-6 border-t border-[#C41E3A]/14 pt-5">
              <div className="grid gap-5 md:grid-cols-[1.5fr_0.9fr]">
                <div className="space-y-6">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#E8A000] mb-3">Rules / Storyline</p>
                    <ul className="space-y-2.5">
                      {ev.rules.slice(0, 4).map((rule, ri) => (
                        <li key={ri} className="flex gap-2 text-white/58 text-sm leading-relaxed">
                          <span className="text-[#FFD700] mt-0.5">▸</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {ev.topics && (
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#E8A000] mb-3">Suggested Topics</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        {ev.topics.map((topic, ti) => (
                          <li key={ti} className="flex gap-2 text-white/58 text-xs leading-relaxed">
                            <span className="text-[#FFD700]">◈</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="rounded-[1.6rem] border border-[#C41E3A]/20 bg-black/25 px-4 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/30 mb-3">Mission Data</p>
                  <div className="space-y-2 text-sm text-white/60">
                    <div className="flex items-center justify-between gap-3"><span>Date</span><span className="text-[#E8A000] text-right">{ev.date}</span></div>
                    <div className="flex items-center justify-between gap-3"><span>Duration</span><span className="text-[#fde68a] text-right">{ev.duration}</span></div>
                    <div className="flex items-center justify-between gap-3"><span>Venue</span><span className="text-[#f5deb0] text-right">{ev.venue}</span></div>
                  </div>
                </div>
              </div>

              <Link to={getRegistrationPath(ev)} onClick={(e) => e.stopPropagation()} className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#C41E3A]/30 bg-[linear-gradient(135deg,rgba(255,215,0,0.20),rgba(139,0,0,0.18))] text-white font-heading font-bold tracking-[0.18em] uppercase text-xs shadow-[0_0_30px_rgba(255,215,0,0.16)] md:hover:scale-[1.02] transition-all duration-300">
                Register Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PosterModal ev={ev} isOpen={posterModalOpen} onClose={() => setPosterModalOpen(false)} />
    </motion.article>
  );
}

export default function EventsGrid() {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const visibleEvents = useMemo(() => {
    if (filter === 'all') return FEATURED_HOME_EVENTS;
    return ALL_EVENTS.filter((event) => event.category === filter);
  }, [filter]);

  return (
    <section id="events" className="section-shell relative py-18 md:py-32 bg-wakanda-dark text-slate-50 overflow-hidden">
      <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-[#C41E3A]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFD700]/7 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 mesh-fade opacity-[0.12] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#C41E3A]/25 bg-[#120400]/65 backdrop-blur-xl mb-5 panel-sheen">
                <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#E8A000]">Featured Event Systems</span>
              </div>

              <h3 className="text-3xl sm:text-4xl md:text-7xl font-black font-heading tracking-tighter uppercase leading-[0.95]">
                Holographic <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #8B0000 0%, #C41E3A 46%, #FFD700 100%)' }}>Event Arena</span>
              </h3>
              <p className="mt-5 max-w-2xl text-white/45 font-body text-base md:text-lg leading-relaxed">
                Premium technical and non-technical experiences presented like mission modules — glowing interfaces, interactive depth, smooth tilt, and cinematic reveal states.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto">
              {[
                { label: 'Programs', value: EVENT_STATS.totalCount, tone: 'text-[#C41E3A]' },
                { label: 'Prize Pool', value: EVENT_STATS.totalPrizePoolLabel, tone: 'text-[#fde68a]' },
                { label: 'Tracks', value: '2', tone: 'text-[#E8A000]' },
              ].map((item) => (
                <div key={item.label} className="panel-sheen rounded-[1.4rem] border border-white/8 bg-white/[0.03] px-2 sm:px-4 py-3 sm:py-4 text-center">
                  <p className="font-mono text-[8px] sm:text-[9px] tracking-[0.24em] uppercase text-white/30">{item.label}</p>
                  <p className={`mt-1 sm:mt-2 text-lg sm:text-2xl md:text-3xl font-heading font-black ${item.tone}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] p-1.5 panel-sheen">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id)}
                  className={`px-5 py-2.5 rounded-full text-[11px] font-mono tracking-[0.24em] uppercase transition-all duration-300 ${filter === item.id
                      ? 'bg-[linear-gradient(135deg,rgba(196,30,58,0.72),rgba(232,160,0,0.26))] text-white shadow-[0_0_24px_rgba(196,30,58,0.24)]'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-white/30">
              Tilt, hover, expand, and register through mission cards
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[minmax(290px,auto)]" style={{ perspective: '1400px' }}>
          {visibleEvents.map((ev, i) => <EventCard key={ev.id} ev={ev} i={i} />)}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }} className="mt-14 grid md:grid-cols-2 gap-4">
          <button onClick={() => navigate('/technical')} className="panel-sheen group rounded-[2rem] border border-[#C41E3A]/28 bg-[#120400]/72 px-6 py-6 text-left md:hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-[#E8A000]">Technical Track</p>
                <h4 className="mt-2 text-2xl font-heading font-black text-white">Dive into Core Innovation</h4>
                <p className="mt-2 text-white/45 text-sm">Bug Bash, research, security, quiz rounds, and skill-based execution modules.</p>
              </div>
              <div className="w-14 h-14 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 flex items-center justify-center text-2xl">🔬</div>
            </div>
          </button>

          <button onClick={() => navigate('/non-technical')} className="panel-sheen group rounded-[2rem] border border-[#C41E3A]/25 bg-[#0a0810]/74 px-6 py-6 text-left md:hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-[#f5deb0]">Stage / Arena Track</p>
                <h4 className="mt-2 text-2xl font-heading font-black text-white">Enter the Crowd-Energy Zone</h4>
                <p className="mt-2 text-white/45 text-sm">Sports, gaming, film, fun rounds, and non-stop campus energy experiences.</p>
              </div>
              <div className="w-14 h-14 rounded-full border border-[#C41E3A]/30 bg-[#C41E3A]/10 flex items-center justify-center text-2xl">🎭</div>
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
