import React from 'react';
import { motion } from 'framer-motion';
import { ALL_PARTNERS } from '../data/sponsors';

function SponsorCard({ name, role, image, color, border }) {
  return (
    <div
      className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl border bg-gradient-to-br ${color} ${border} transition-all duration-300 w-48 h-32 flex-shrink-0 bg-white/5 backdrop-blur-sm overflow-hidden mx-3 hover:scale-105 hover:bg-white/10 hover:shadow-vibranium-glow`}
    >
      {/* Logo */}
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300 pointer-events-none"
        />
      ) : (
        <span className={`font-heading font-black text-xl tracking-wider text-white transition-all duration-300`}>
          {name}
        </span>
      )}
      {/* Overlay role label on hover */}
      <div className="absolute inset-x-0 bottom-0 top-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl p-2 text-center pointer-events-none z-10">
         <span className="font-heading text-white font-bold text-sm mb-1">{name}</span>
         <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-vibranium">{role}</span>
      </div>
    </div>
  );
}

export default function Sponsors() {
  if (ALL_PARTNERS.length === 0) return null;

  // We duplicate the partners to allow a seamless CSS infinite scroll loop
  const duplicatedPartners = [...ALL_PARTNERS, ...ALL_PARTNERS];

  return (
    <section id="sponsors" className="relative py-16 md:py-28 bg-wakanda-dark overflow-hidden border-t border-vibranium/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(196, 30, 58,0.05),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-4 justify-center">
            <div className="h-[2px] w-8 bg-vibranium shadow-[0_0_15px_rgba(196,30,58,0.7)]" />
            <h2 className="text-sm font-mono tracking-[0.25em] uppercase font-bold text-vibranium-light">Partners</h2>
            <div className="h-[2px] w-8 bg-vibranium shadow-[0_0_15px_rgba(196,30,58,0.7)]" />
          </div>
          <h3 className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase text-white">
            Sponsors &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-vibranium to-vibranium-light">Partners</span>
          </h3>
          <p className="mt-4 text-white/30 font-mono text-xs tracking-widest max-w-sm mx-auto">
            Powering innovation alongside the brightest in the industry.
          </p>
        </motion.div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto overflow-hidden mt-10">
         {/* Fade masks for the edges */}
         <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-wakanda-dark to-transparent z-10 pointer-events-none hidden md:block" />
         <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-wakanda-dark to-transparent z-10 pointer-events-none hidden md:block" />

         {/* Scrolling container */}
         <div className="flex w-[200%] sm:w-[150%] md:w-[200%] animate-scroll hover:[animation-play-state:paused]">
            <div className="flex items-center justify-around w-1/2">
                {ALL_PARTNERS.map((sp, idx) => (
                    <SponsorCard key={`p1-${idx}`} {...sp} />
                ))}
            </div>
            <div className="flex items-center justify-around w-1/2">
                {ALL_PARTNERS.map((sp, idx) => (
                    <SponsorCard key={`p2-${idx}`} {...sp} />
                ))}
            </div>
         </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        {/* Become a Sponsor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16"
        >
          <div className="relative rounded-3xl border border-dashed border-vibranium/25 bg-gradient-to-br from-vibranium/[0.05] to-transparent p-8 md:p-12 text-center overflow-hidden">
            {/* Corner brackets */}
            <span className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-vibranium/40" />
            <span className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-vibranium/40" />
            <span className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-vibranium/40" />
            <span className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-vibranium/40" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(234,179,8,0.08),transparent_70%)] pointer-events-none" />

            <div className="relative z-10">
              <p className="font-mono text-[10px] tracking-[0.35em] text-vibranium/60 uppercase mb-3">Partner with us</p>
              <h4 className="text-2xl md:text-3xl font-black font-heading text-white mb-3">
                Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-vibranium to-vibranium-light">Sponsor</span>
              </h4>
              <p className="text-white/30 font-mono text-xs tracking-wide max-w-sm mx-auto mb-6 leading-relaxed">
                Reach symposium participants, campus creators, and technical competitors at CYSTECH2K26.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="mailto:sponsors@cystech.edu"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-vibranium text-white font-bold font-mono text-[10px] sm:text-xs tracking-widest uppercase hover:shadow-[0_0_30px_rgba(196,30,58,0.8)] transition-all duration-300 hover:scale-105"
                >
                  ✉ Contact Us
                </a>
              </div>
              <p className="mt-5 text-white/20 font-mono text-[9px] tracking-[0.3em] uppercase">
                Various partnership packages available
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
