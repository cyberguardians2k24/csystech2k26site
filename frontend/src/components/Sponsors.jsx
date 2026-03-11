import React from 'react';
import { motion } from 'framer-motion';

const TIERS = [
  {
    tier: "Title Sponsor",
    color: "from-vibranium-dark/25 to-vibranium/10",
    border: "border-vibranium/60",
    glow: "shadow-[0_0_30px_rgba(157,0,255,0.7)] vibranium-glow",
    text: "bp-vibranium-text",
    sponsors: [
      { name: "VibraniumTech", abbr: "VT" },
    ]
  },
  {
    tier: "Gold Sponsors",
    color: "from-vibranium/15 to-vibranium/5",
    border: "border-vibranium/30",
    glow: "shadow-vibranium-glow",
    text: "text-vibranium-light",
    sponsors: [
      { name: "Wakanda Labs", abbr: "WL" },
      { name: "HoloCorp", abbr: "HC" },
    ]
  },
  {
    tier: "Silver Sponsors",
    color: "from-holo-cyan/10 to-holo-cyan/5",
    border: "border-holo-cyan/20",
    glow: "shadow-[0_0_20px_rgba(0,240,255,0.1)]",
    text: "text-holo-cyan",
    sponsors: [
      { name: "NeuraSync", abbr: "NS" },
      { name: "ByteForge", abbr: "BF" },
      { name: "Orbital Dev", abbr: "OD" },
    ]
  },
  {
    tier: "Community Partners",
    color: "from-white/5 to-white/[0.02]",
    border: "border-white/10",
    glow: "",
    text: "text-white/40",
    sponsors: [
      { name: "DevCircle", abbr: "DC" },
      { name: "OpenCore", abbr: "OC" },
      { name: "HackHub", abbr: "HH" },
      { name: "TechGuild", abbr: "TG" },
    ]
  },
];

function SponsorCard({ name, abbr, color, border, glow, text, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.04 }}
      className={`group relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border bg-gradient-to-br ${color} ${border} ${glow} transition-all duration-300 cursor-pointer min-h-[90px]`}
    >
      {/* Abbr logo placeholder */}
      <span className={`font-heading font-black text-xl tracking-wider ${text} group-hover:opacity-100 transition-all duration-300`}>
        {abbr}
      </span>
      <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase">{name}</span>
    </motion.div>
  );
}

export default function Sponsors() {
  return (
    <section id="sponsors" className="relative py-16 md:py-28 bg-wakanda-dark overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(157,0,255,0.05),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="flex items-center gap-4 mb-4 justify-center">
            <div className="h-[2px] w-8 bg-vibranium shadow-vibranium-glow" />
            <h2 className="text-sm font-mono tracking-[0.25em] uppercase font-bold bp-vibranium-text">Partners</h2>
            <div className="h-[2px] w-8 bg-vibranium shadow-vibranium-glow" />
          </div>
          <h3 className="text-4xl md:text-6xl font-black font-heading tracking-tighter uppercase text-white">
            Sponsors &amp;{' '}
            <span className="bp-vibranium-text">Partners</span>
          </h3>
          <p className="mt-4 text-white/30 font-mono text-xs tracking-widest max-w-sm mx-auto">
            Powering innovation alongside the brightest in the industry.
          </p>
        </motion.div>

        <div className="space-y-10">
          {TIERS.map((tier, ti) => (
            <div key={ti}>
              <p className={`font-mono text-[9px] tracking-[0.3em] uppercase mb-4 ${tier.text}`}>{tier.tier}</p>
              <div className={`grid gap-4 ${tier.sponsors.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' : tier.sponsors.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
                {tier.sponsors.map((sp, si) => (
                  <SponsorCard
                    key={si}
                    {...sp}
                    color={tier.color}
                    border={tier.border}
                    glow={tier.glow}
                    text={tier.text}
                    delay={si * 0.08}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

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
                Become a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-vibranium to-vibranium-light">Sponsor</span>
              </h4>
              <p className="text-white/30 font-mono text-xs tracking-wide max-w-sm mx-auto mb-6 leading-relaxed">
                Reach 800+ students &amp; professionals. Support the next generation of tech innovators at CYSTECH 2026.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="mailto:sponsors@cystech.edu"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-vibranium text-black font-bold font-mono text-xs tracking-widest uppercase hover:shadow-[0_0_30px_rgba(157,0,255,0.5)] transition-all duration-300 hover:scale-105"
                >
                  ✉ Contact Us
                </a>
                <a
                  href="mailto:sponsors@cystech.edu"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-vibranium/30 text-vibranium font-mono text-xs tracking-widest uppercase hover:bg-vibranium/10 hover:border-vibranium/60 transition-all duration-300"
                >
                  Download Brochure
                </a>
              </div>
              <p className="mt-5 text-white/20 font-mono text-[9px] tracking-[0.3em] uppercase">
                Packages from Title Sponsorship to Community Partnership
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
