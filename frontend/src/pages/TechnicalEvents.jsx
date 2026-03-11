import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENT_STATS, TECHNICAL_EVENTS } from '../data/events';

// ── Re-usable EventCard (same style as EventsGrid) ─────────────────────────
function EventCard({ event, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={`relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br ${event.color}/10 backdrop-blur-sm group hover:border-white/25 transition-all duration-500`}
    >
      {/* gradient shard */}
      <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />

      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-holo-cyan/80 uppercase">{event.tag}</span>
            <h3 className="text-2xl font-heading font-bold text-white mt-1 leading-tight">{event.title}</h3>
            <p className="text-sm text-white/50 italic mt-0.5">{event.tagline}</p>
          </div>
          <span className="text-4xl ml-4 shrink-0">{event.icon}</span>
        </div>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed flex-1">{event.desc}</p>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { label: 'Mode', value: event.mode },
            { label: 'Team', value: event.teamSize },
            { label: 'Duration', value: event.duration },
          ].map(({ label, value }) => (
            <span key={label} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 flex items-center gap-1">
              <span className="text-white/30">{label}:</span> {value}
            </span>
          ))}
        </div>

        {/* Prize */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase">Total Prize Pool</p>
            <p className="text-2xl font-heading font-black text-vibranium">{event.prize}</p>
          </div>
          <button
            onClick={() => setExpanded((x) => !x)}
            className="text-xs px-4 py-2 rounded-full border border-vibranium/40 text-vibranium hover:bg-vibranium/20 transition-all duration-300 font-medium"
          >
            {expanded ? 'Hide Rules ↑' : 'View Rules ↓'}
          </button>
        </div>

        {/* Expanded rules */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-white/10 pt-4 space-y-3">
                {/* Rule list */}
                <ul className="space-y-1.5">
                  {event.rules.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                      <span className="text-holo-cyan mt-0.5 shrink-0">›</span>
                      {r}
                    </li>
                  ))}
                </ul>
                {/* Venue + date */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-1 text-xs text-white/50">
                  <p><span className="text-white/30">Venue:</span> {event.venue}</p>
                  <p><span className="text-white/30">Date:</span> {event.date}</p>
                </div>
                {/* Prize breakdown */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { place: '1st', amount: event.firstPrize, color: 'text-vibranium border-vibranium/30' },
                    { place: '2nd', amount: event.secondPrize, color: 'text-white/70 border-white/20' },
                    { place: '3rd', amount: event.thirdPrize, color: 'text-vibranium-light border-vibranium-light/30' },
                  ].map(({ place, amount, color }) => (
                    <div key={place} className={`rounded-xl border p-2 text-center ${color} bg-white/[0.02]`}>
                      <p className="text-[10px] opacity-60">{place} Place</p>
                      <p className="font-bold text-sm">{amount}</p>
                    </div>
                  ))}
                </div>
                {/* Coordinators */}
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase mb-1">Coordinators</p>
                  <div className="flex flex-wrap gap-2">
                    {event.coordinators.map((c) => (
                      <a
                        key={c.phone}
                        href={`tel:${c.phone}`}
                        className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-holo-cyan hover:border-holo-cyan/30 transition-colors flex items-center gap-1.5"
                      >
                        <span>📞</span> {c.name}
                      </a>
                    ))}
                  </div>
                </div>
                {/* Register CTA */}
                <Link
                  to={`/register/${event.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="block w-full text-center py-3 rounded-full bg-vibranium/20 border border-vibranium/50 text-white font-bold font-mono tracking-widest uppercase text-xs hover:bg-vibranium hover:shadow-vibranium-glow transition-all duration-300"
                >
                  Register Now ⚡
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function TechnicalEvents() {
  return (
    <div className="min-h-screen bg-wakanda-dark text-slate-50 font-body overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-vibranium/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-holo-cyan/8 rounded-full blur-[100px]" />
      </div>

      {/* Hero banner */}
      <section className="relative z-10 pt-28 pb-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-[10px] font-mono tracking-[0.3em] text-holo-cyan uppercase mb-4 border border-holo-cyan/20 px-4 py-1.5 rounded-full bg-holo-cyan/5">
            CYSTECH 2K26
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-black tracking-tight leading-none mb-4">
            <span className="bg-gradient-to-r from-vibranium via-holo-cyan to-vibranium-light bg-clip-text text-transparent">
              Technical
            </span>
            <br />
            Events
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Posters, bug hunting, secure web testing, fast coding, and quiz warfare — five sharp technical arenas built for serious competitors.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 mt-12"
        >
          {[
            { value: String(EVENT_STATS.technicalCount), label: 'Events' },
            { value: EVENT_STATS.technicalPrizePoolLabel, label: 'Total Prize Pool' },
            { value: '2', label: 'Days' },
            { value: '350+', label: 'Expected Participants' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-heading font-black text-white">{value}</p>
              <p className="text-xs text-white/40 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Event grid */}
      <section className="relative z-10 px-4 md:px-8 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TECHNICAL_EVENTS.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 text-center pb-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-vibranium/20 rounded-2xl bg-vibranium/5 max-w-lg mx-auto p-8"
        >
          <p className="text-white/60 mb-2 text-sm">Ready to compete?</p>
          <h2 className="text-2xl font-heading font-bold text-white mb-4">Secure your spot now</h2>
          <Link
            to="/#register"
            className="inline-block px-8 py-3 rounded-full bg-vibranium/20 border border-vibranium/50 text-white font-medium hover:bg-vibranium hover:shadow-vibranium-glow transition-all duration-300"
          >
            Register →
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
