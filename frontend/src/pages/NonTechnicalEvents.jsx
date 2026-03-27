import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EVENT_STATS, NON_TECHNICAL_EVENTS } from '../data/events';
import { SYMPOSIUM_INFO } from '../data/symposium';

// ── Re-usable EventCard ────────────────────────────────────────────────────
function EventCard({ event, index }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={`relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm group hover:border-white/20 hover:shadow-[0_0_28px_rgba(196,30,58,0.20)] transition-all duration-300 h-full`}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
    >
      {/* Front Side */}
      <motion.div
        className="relative z-10 p-6 flex flex-col h-full w-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-vibranium/80 uppercase">{event.tag}</span>
            <h3 className="text-2xl font-heading font-bold text-white mt-1 leading-tight">{event.title}</h3>
            <p className="text-sm text-white/50 italic mt-0.5">{event.tagline}</p>
          </div>
          <span className="text-4xl ml-4 shrink-0">{event.icon}</span>
        </div>

        {event.poster && (
          <Link
            to={`/register/${event.id}`}
            onClick={(e) => e.stopPropagation()}
            className="mb-4 overflow-hidden rounded-xl border border-white/10 group/poster relative block"
          >
            <img src={event.poster} alt={`${event.title} poster`} className="w-full aspect-[4/3] object-cover object-top" loading="lazy" />
            <motion.div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/poster:opacity-100 transition-opacity duration-300">
              <span className="text-white font-bold font-mono tracking-widest uppercase text-sm">Register Now ⚡</span>
            </motion.div>
          </Link>
        )}

        <p className="text-white/60 text-sm leading-relaxed flex-1">{event.desc}</p>

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

        <div className="mt-4 flex items-center justify-between">
          <div>
            {event.prize !== 'CASH PRIZE' && (
              <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
                {event.prize.startsWith('₹') ? 'CASH PRIZE' : 'Total Prize Pool'}
              </p>
            )}
            <p className="text-2xl font-heading font-black text-vibranium">{event.prize}</p>
          </div>
          <button
            onClick={() => setIsFlipped(true)}
            className="text-xs px-4 py-2 rounded-full border border-vibranium/40 text-vibranium hover:bg-vibranium/20 transition-all duration-300 font-medium"
          >
            View Rules ↓
          </button>
        </div>
      </motion.div>

      {/* Back Side */}
      <motion.div
        className="absolute inset-0 p-6 flex flex-col w-full h-full rounded-2xl bg-gradient-to-br from-vibranium/5 to-vibranium/5 backdrop-blur-sm border border-white/10"
        animate={{ rotateY: isFlipped ? 0 : 180 }}
        transition={{ duration: 0.6 }}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-heading font-bold text-white">Event Details</h4>
          <button
            onClick={() => setIsFlipped(false)}
            className="text-xs px-4 py-2 rounded-full border border-vibranium/40 text-vibranium hover:bg-vibranium/20 transition-all duration-300 font-medium"
          >
            ↑ Back
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {/* Rule list */}
          <div>
            <p className="text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">Rules</p>
            <ul className="space-y-1.5">
              {event.rules.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                  <span className="text-vibranium mt-0.5 shrink-0">›</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Venue + date */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-1 text-xs text-white/50">
            <p><span className="text-white/30">Venue:</span> {event.venue}</p>
            <p><span className="text-white/30">Date:</span> {event.date}</p>
          </div>

          {/* Prize pool */}
          <div className="rounded-xl border border-[#C41E3A]/30 bg-[#C41E3A]/10 p-3 text-center">
            {event.prize !== 'CASH PRIZE' && (
              <p className="text-[10px] tracking-[0.2em] font-mono uppercase text-[#FFD700]/90 mb-1">
                {event.prize.startsWith('₹') ? 'CASH PRIZE' : 'Total Prize Pool'}
              </p>
            )}
            <p className="font-black font-heading text-lg text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">{event.prize}</p>
          </div>

          {/* Coordinators */}
          <div>
            <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase mb-1">Coordinators</p>
            <div className="flex flex-wrap gap-2">
              {event.coordinators.map((c) => (
                <a
                  key={c.phone}
                  href={`tel:${c.phone}`}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-vibranium hover:border-vibranium/30 transition-colors flex items-center gap-1.5"
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
            className="block w-full text-center py-3 rounded-full bg-vibranium/20 border border-vibranium/50 text-white font-bold font-mono tracking-widest uppercase text-xs hover:bg-vibranium hover:text-white hover:shadow-[0_0_25px_rgba(196, 30, 58,0.4)] transition-all duration-300 mt-4"
          >
            Register Now ⚡
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function NonTechnicalEvents() {
  return (
    <div className="min-h-screen bg-wakanda-dark text-slate-50 font-body overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-vibranium/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-vibranium/10 rounded-full blur-[100px]" />
      </div>

      {/* Hero banner */}
      <section className="relative z-10 pt-28 pb-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-[10px] font-mono tracking-[0.3em] text-vibranium uppercase mb-4 border border-vibranium/20 px-4 py-1.5 rounded-full bg-vibranium/5">
            {SYMPOSIUM_INFO.eventName}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-black tracking-tight leading-none mb-4">
            <span className="bg-gradient-to-r from-vibranium via-vibranium-light to-vibranium bg-clip-text text-transparent">
              Non-Technical
            </span>
            <br />
            Events
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Arena (Free Fire), Arena (BGMI), Kabaddi, Link Logic, and CINEATAKE make up the non-technical track for {SYMPOSIUM_INFO.eventName}.
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
            { value: String(EVENT_STATS.nonTechnicalCount), label: 'Events' },
            { value: SYMPOSIUM_INFO.dateDisplay, label: 'Date' },
            { value: SYMPOSIUM_INFO.venue, label: 'Venue' },
            { value: SYMPOSIUM_INFO.theme, label: 'Theme' },
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
          {NON_TECHNICAL_EVENTS.map((event, i) => (
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
          <p className="text-white/60 mb-2 text-sm">Ready to showcase your talent?</p>
          <h2 className="text-2xl font-heading font-bold text-white mb-4">Register for your event</h2>
          <Link
            to="/#events"
            className="inline-block px-8 py-3 rounded-full bg-vibranium/20 border border-vibranium/50 text-vibranium font-medium hover:bg-vibranium hover:text-white hover:shadow-[0_0_20px_rgba(196, 30, 58,0.4)] transition-all duration-300"
          >
            Register →
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
