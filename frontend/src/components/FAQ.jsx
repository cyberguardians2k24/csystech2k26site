import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: "Who can participate in CYSTECH 2026?",
    a: "Any undergraduate or postgraduate student from a recognized college or university can participate. There are no branch restrictions — all disciplines are welcome!"
  },
  {
    q: "Is registration free?",
    a: "Yes, registration is completely free. Just fill in the form above and select the events you wish to participate in."
  },
  {
    q: "Can I register for multiple events?",
    a: "Absolutely! You can register for as many events as you like, as long as there are no scheduling conflicts. Our advisors will reach out if there's an overlap."
  },
  {
    q: "Do I need to bring my own laptop?",
    a: "Yes for Debugging, Vulnerab-Web Check, and Fun Coding. For Paper Presentation, Technical Quiz, Connections, Kabbadi, and most stage events, organizers will guide the required setup."
  },
  {
    q: "Can I participate as a team?",
    a: "Yes. Team sizes vary by event: Kabbadi is team-based, Technical Quiz and Connections use pairs, while Debugging, Vulnerab-Web Check, and Fun Coding allow solo entries."
  },
  {
    q: "Will accommodation be provided?",
    a: "Limited on-campus accommodation is available on a first-come-first-served basis. Please mention this in the additional info field after registration."
  },
  {
    q: "How will I receive event updates?",
    a: "All registered participants will receive an email confirmation and subsequent updates. Make sure to check your inbox (and spam folder)."
  },
  {
    q: "What is the prize distribution process?",
    a: "Prizes will be distributed on Day 2 during the Valedictory Ceremony. Winners must be present in-person to claim their awards."
  },
  {
    q: "Is there a dress code for participants?",
    a: "There is no strict dress code. Smart casual or college attire is recommended. Participants representing their college are encouraged to wear their ID cards at all times during the event."
  },
  {
    q: "Can participants attend as observers without competing?",
    a: "Yes! You can attend CYSTECH 2026 as an observer. Simply register and leave the event selection empty. Observer passes grant access to all keynotes, showcases, and the Valedictory Ceremony."
  },
  {
    q: "Will there be food and refreshments?",
    a: "Yes. Complimentary refreshments will be provided during break slots on both days. Lunch will be available at the campus canteen at participant-friendly rates."
  },
];

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group border rounded-2xl overflow-hidden transition-all duration-400 ${open ? 'border-vibranium/50 bg-vibranium/5 shadow-vibranium-glow' : 'border-white/5 bg-white/[0.02] hover:border-vibranium/25'}`}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={() => setOpen(v => !v)}
      >
        <span className="font-heading font-semibold text-base text-white/90 group-hover:text-white transition-colors flex-1">
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center font-mono text-base transition-all duration-300 ${open ? 'border-vibranium text-vibranium bg-vibranium/10' : 'border-white/15 text-white/30'}`}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-1 border-t border-vibranium/10">
              <p className="text-white/55 font-body text-sm leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="relative py-16 md:py-32 bg-wakanda-dark overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-vibranium/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-holo-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-16 text-center flex flex-col items-center"
        >
          <div className="flex items-center gap-4 mb-4 justify-center">
            <div className="h-[2px] w-8 bg-vibranium shadow-vibranium-glow" />
            <h2 className="text-sm font-mono tracking-[0.25em] text-vibranium uppercase font-bold text-glow-vibranium">Support</h2>
            <div className="h-[2px] w-8 bg-vibranium shadow-vibranium-glow" />
          </div>
          <h3 className="text-5xl md:text-7xl font-black font-heading tracking-tighter uppercase">
            <span className="text-white">Frequently</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vibranium to-holo-cyan">Asked</span>
          </h3>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center text-white/30 font-mono text-xs tracking-widest"
        >
          Still have questions?{' '}
          <a href="mailto:cystech@college.edu" className="text-holo-cyan hover:text-white transition-colors underline underline-offset-4">
            cystech@college.edu
          </a>
        </motion.p>
      </div>
    </section>
  );
}
