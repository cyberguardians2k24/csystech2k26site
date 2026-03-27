import React from 'react'
import { motion } from 'framer-motion'

const LINKS = {
  Events:  ['Paper Presentation', 'Hackathon', 'Technical Quiz', 'Workshops'],
  Connect: ['Contact Us', 'Sponsors', 'Volunteer', 'Media Kit'],
  Legal:   ['Terms & Conditions', 'Privacy Policy', 'Code of Conduct'],
}

export default function Footer() {
  return (
    <footer className="relative bg-wakanda-black border-t border-vibranium-900/40 pt-16 pb-8 overflow-hidden">
      {/* Top energy line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vibranium-600 to-transparent opacity-60" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(196, 30, 58,0.1),transparent_60%)] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-vibranium-500 rotate-45 flex items-center justify-center">
                <span className="font-orbitron text-vibranium-400 text-xs font-black -rotate-45">C</span>
              </div>
              <div>
                <div className="font-orbitron text-white text-sm font-black tracking-widest">CYSTECH</div>
                <div className="font-mono text-vibranium-500 text-xs tracking-[0.3em]">2K26</div>
              </div>
            </div>
            <p className="font-rajdhani text-white/40 text-sm leading-relaxed">
              Cyber Security Department — Annual Technology Symposium.
              Where vibranium meets vision.
            </p>
            <div className="font-mono text-vibranium-600 text-xs tracking-widest">
              APRIL 2026
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h4 className="font-orbitron text-white/80 text-xs tracking-[0.3em]">{section}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-rajdhani text-white/40 text-sm hover:text-vibranium-300 transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-3 h-px bg-vibranium-500 transition-all duration-300" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="font-mono text-white/20 text-[9px] tracking-[0.3em] uppercase">
              © 2026 CYSTECH · ALL RIGHTS RESERVED
            </p>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-white text-[9px] tracking-[0.2em] uppercase">SYSTEMS ONLINE</span>
            </div>
          </div>
          
          <div className="font-mono text-vibranium-gold/80 text-[10px] tracking-[0.35em] uppercase font-black text-glow-holo text-center md:text-right">
            Built by <span className="text-white">ISQUARE TECH SOLUTIONS</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
