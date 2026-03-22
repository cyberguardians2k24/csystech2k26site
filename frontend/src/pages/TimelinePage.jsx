import React from 'react';
import { motion } from 'framer-motion';
import { TIMELINE_SLOTS } from '../data/symposium';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-wakanda-dark text-white font-body selection:bg-vibranium/30 selection:text-white pb-32">
      <Navbar />

      <main className="pt-32 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-vibranium-gold/30 bg-vibranium-gold/10 backdrop-blur-md mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-vibranium-gold animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-vibranium-gold uppercase">Event Schedule</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-heading font-black tracking-tighter uppercase text-white mb-6"
            >
              Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-vibranium-gold to-vibranium-light">Timeline</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto text-white/50 font-mono text-sm uppercase tracking-widest"
            >
              Plan your events strategically. Dual slots mean you must choose wisely.
            </motion.p>
          </div>

          {/* Table Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-vibranium/20 bg-black/40 backdrop-blur-md overflow-hidden shadow-[0_0_50px_rgba(196,30,58,0.1)]"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.03] border-b border-vibranium/20">
                    <th className="p-5 font-heading text-lg font-bold text-white w-1/3">Event</th>
                    <th className="p-5 font-mono text-xs tracking-[0.2em] uppercase text-vibranium-gold w-1/3 border-l border-white/10 text-center">Slot-1</th>
                    <th className="p-5 font-mono text-xs tracking-[0.2em] uppercase text-vibranium-gold w-1/3 border-l border-white/10 text-center">Slot-2</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {TIMELINE_SLOTS.map((row, i) => {
                    if (row.isBreak) {
                      return (
                        <tr key={i} className="bg-[repeating-linear-gradient(45deg,rgba(196,30,58,0.05)_0px,rgba(196,30,58,0.05)_10px,transparent_10px,transparent_20px)] border-y border-vibranium/30">
                          <td colSpan={3} className="py-4 text-center font-heading font-black text-xl tracking-widest uppercase text-vibranium">
                            {row.text}
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-5 font-heading font-medium text-white/90">
                          {row.event}
                        </td>
                        <td className="p-5 font-mono text-sm tracking-wider text-white/60 border-l border-white/5 text-center">
                          {row.slot1 || <span className="text-white/20">—</span>}
                        </td>
                        <td className="p-5 font-mono text-sm tracking-wider text-white/60 border-l border-white/5 text-center bg-white/[0.01]">
                          {row.slot2 || <span className="text-white/20">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="p-5 bg-[linear-gradient(180deg,transparent,rgba(196,30,58,0.05))] border-t border-vibranium/20">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-vibranium-gold/70 text-center">
                * Note: Poster Presentation participants might extend into Slot 2 if required.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <div className="mt-32">
        <Footer />
      </div>

    </div>
  );
}
