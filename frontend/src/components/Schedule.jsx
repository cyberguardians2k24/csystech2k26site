import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';

const SCHEDULE = {
  "Day 1": [
    { time: "08:30", name: "Registration & Check-In", desc: "Badge collection, team reporting, and participant briefing at the main lobby.", tag: "LOGISTICS" },
    { time: "09:15", name: "Inaugural Launch", desc: "Opening ceremony and arena launch for CYSTECH 2K26.", tag: "KEYNOTE" },
    { time: "10:30", name: "Paper Presentation", desc: "Research papers presented and evaluated by faculty and guest jury.", tag: "COMPETITION" },
    { time: "12:00", name: "Connections", desc: "Round-based clue linking and pattern discovery contest begins.", tag: "COMPETITION" },
    { time: "13:00", name: "Lunch Break", desc: "Networking lunch across sponsor and showcase zones.", tag: "BREAK" },
    { time: "01:30", name: "Debugging", desc: "Timed code-fix challenge across multiple programming languages.", tag: "COMPETITION" },
    { time: "03:30", name: "Technical Quiz", desc: "Prelims and finals in a high-voltage rapid-fire knowledge battle.", tag: "COMPETITION" },
    { time: "04:00", name: "E-Sports Brackets", desc: "Qualifier matches and knockouts start inside the gaming zone.", tag: "COMPETITION" },
    { time: "06:00", name: "Campus Spotlight", desc: "Open lounge, networking, and creator corner experiences.", tag: "SOCIAL" },
  ],
  "Day 2": [
    { time: "09:00", name: "Kabbadi League Matches", desc: "Ground heats and knockout progression begin at the sports arena.", tag: "COMPETITION" },
    { time: "10:00", name: "Vulnerab-Web Check", desc: "Participants audit staged web apps for exploitable issues.", tag: "COMPETITION" },
    { time: "10:00", name: "Short Film Contest", desc: "Theme reveal, shoot window, and editing sprint begin.", tag: "COMPETITION" },
    { time: "12:30", name: "Lunch Break", desc: "Judging prep, networking, and recharge session.", tag: "BREAK" },
    { time: "02:00", name: "Fun Coding", desc: "Logic rounds, code puzzles, and debug races in the programming lab.", tag: "COMPETITION" },
    { time: "03:30", name: "Kabbadi Finals", desc: "Title clash for the non-technical sports championship.", tag: "COMPETITION" },
    { time: "04:00", name: "E-Sports Grand Finals", desc: "Final streamed matches with live commentary and prize announcements.", tag: "COMPETITION" },
    { time: "05:30", name: "Winners Showcase", desc: "Short film screening and top poster walkthrough with jury notes.", tag: "SOCIAL" },
    { time: "06:00", name: "Valedictory & Awards", desc: "Champion reveal, prize distribution, and closing address.", tag: "CEREMONY" },
  ]
};

const TAG_COLORS = {
  KEYNOTE: "text-holo-cyan border-holo-cyan/30 bg-holo-cyan/5",
  COMPETITION: "text-vibranium border-vibranium/30 bg-vibranium/5",
  WORKSHOP: "text-vibranium border-vibranium/30 bg-vibranium/5",
  LOGISTICS: "text-white/40 border-white/10 bg-white/5",
  BREAK: "text-white/30 border-white/10 bg-white/5",
  SOCIAL: "text-vibranium-light border-vibranium-light/30 bg-vibranium-light/5",
  CEREMONY: "text-vibranium border-vibranium/30 bg-vibranium/5",
};

export default function Schedule() {
  const containerRef = useRef(null);
  const [activeDay, setActiveDay] = useState('Day 1');
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const lineProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const days = Object.keys(SCHEDULE);
  const items = SCHEDULE[activeDay];

  return (
    <section id="schedule" ref={containerRef} className="section-shell py-16 md:py-32 bg-wakanda-dark text-slate-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7b2cff]/20 to-transparent pointer-events-none" />
      <div className="absolute -left-40 top-40 w-80 h-80 bg-[#7b2cff]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute right-0 bottom-40 w-64 h-64 bg-[#67e8f9]/6 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 mesh-fade opacity-[0.1] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#7b2cff]/25 bg-[#090212]/65 backdrop-blur-xl mb-5 panel-sheen">
            <span className="w-2 h-2 rounded-full bg-[#67e8f9] animate-pulse" />
            <h2 className="text-sm font-mono tracking-[0.2em] text-[#d8b4fe] uppercase font-bold">Agenda</h2>
          </div>
          <h3 className="text-5xl md:text-7xl font-black font-heading tracking-tighter uppercase mb-8">
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #7b2cff 0%, #9D00FF 50%, #67e8f9 100%)' }}>Timeline</span>
          </h3>

          <div className="panel-sheen rounded-[1.8rem] border border-white/8 bg-[#09020f]/72 px-8 py-4 flex flex-wrap gap-6 items-center justify-center text-sm mb-10 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-white/50 font-mono text-xs tracking-widest">
              <span className="text-[#67e8f9]">📍</span>
              <span>Auditorium & Labs, Main Campus</span>
            </div>
            <div className="w-px h-4 bg-[#7b2cff]/20 hidden sm:block" />
            <div className="flex items-center gap-2 text-white/50 font-mono text-xs tracking-widest">
              <span className="text-[#9D00FF]">📅</span>
              <span>March 15–16, 2026</span>
            </div>
            <div className="w-px h-4 bg-[#7b2cff]/20 hidden sm:block" />
            <div className="flex items-center gap-2 text-white/50 font-mono text-xs tracking-widest">
              <span className="text-[#d8b4fe]">⏱</span>
              <span>09:00 AM onwards</span>
            </div>
          </div>

          <div className="flex gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 panel-sheen">
            {days.map((day) => (
              <motion.button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`relative px-6 py-2 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-300 ${activeDay === day ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                whileTap={{ scale: 0.96 }}
              >
                {activeDay === day && (
                  <motion.span
                    layoutId="day-pill"
                    className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(123,44,255,0.78),rgba(212,175,55,0.22))] shadow-[0_0_30px_rgba(123,44,255,0.24)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{day}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 md:-translate-x-1/2">
              <motion.div
                style={{ height: lineProgress }}
                className="w-full bg-gradient-to-b from-[#7b2cff] via-[#9D00FF] to-[#67e8f9] shadow-[0_0_25px_rgba(123,44,255,0.5)]"
              />
            </div>

            <div className="space-y-10">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className={`relative flex flex-col md:flex-row items-center justify-between group ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="absolute left-[28px] md:left-1/2 w-6 h-6 rounded-full bg-wakanda-dark border-2 border-[#9D00FF] md:-translate-x-1/2 flex items-center justify-center group-hover:border-[#67e8f9] transition-colors z-10 shadow-[0_0_20px_rgba(212,175,55,0.18)]">
                    <div className="w-2 h-2 rounded-full bg-[#9D00FF]/70 group-hover:bg-[#67e8f9] transition-colors shadow-[0_0_12px_rgba(212,175,55,0.42)] group-hover:shadow-[0_0_14px_rgba(103,232,249,0.45)]" />
                  </div>

                  <div className="w-full md:w-5/12 pl-20 md:pl-0 flex flex-col justify-center">
                    <div className={`panel-sheen rounded-[1.8rem] border border-white/8 bg-[#09020f]/72 backdrop-blur-xl p-6 hover:border-[#9D00FF]/30 transition-all cursor-crosshair group-hover:-translate-y-1 ${i % 2 === 0 ? 'md:mr-8 md:text-right' : 'md:ml-8'}`}>
                      <span className={`inline-block mb-2 font-mono text-[9px] tracking-[0.2em] uppercase border px-2 py-0.5 rounded-full ${TAG_COLORS[item.tag] ?? 'text-white/30 border-white/10'}`}>
                        {item.tag}
                      </span>
                      <div className="text-4xl md:text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-white/30 to-white/10 group-hover:from-[#9D00FF] group-hover:to-[#67e8f9] transition-all duration-500 mb-2">
                        {item.time}
                      </div>
                      <h4 className="text-xl font-bold font-heading tracking-tight mb-2 text-white/90 group-hover:text-white">
                        {item.name}
                      </h4>
                      <p className="text-white/50 font-body text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-5/12" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
