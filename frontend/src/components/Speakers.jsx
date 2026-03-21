import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SPEAKERS } from '../data/speakers';

function TiltCard({ name, role, details, avatar, stats, color }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ y: -10 }}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="group panel-sheen relative w-full h-auto rounded-[2rem] border border-white/8 bg-[#120400]/72 backdrop-blur-2xl p-7 md:p-8 flex flex-col gap-6 cursor-pointer hover:border-[#C41E3A]/28 hover:shadow-[0_0_50px_rgba(196,30,58,0.18)] transition-all duration-500 overflow-hidden"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(196,30,58,0.18),transparent_24%),radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.10),transparent_28%)] pointer-events-none" />
            <div
                style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
                className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${color} opacity-[0.08] group-hover:opacity-[0.16] transition-opacity duration-500 pointer-events-none`}
            />
            <div className="absolute inset-0 bg-holo-grid bg-grid-sm opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500 pointer-events-none" />
            <div className="absolute -left-1/3 top-0 h-full w-1/3 bg-[linear-gradient(90deg,transparent,rgba(212,175,55,0.20),transparent)] skew-x-[-22deg] group-hover:translate-x-[420%] transition-transform duration-[1500ms] ease-out pointer-events-none" />

            <div style={{ transform: 'translateZ(40px)' }} className="relative z-10 flex items-center gap-4">
                <div className="relative flex-shrink-0">
                    <div className="absolute inset-[-10px] rounded-full border border-[#C41E3A]/25 slow-spin opacity-80" />
                    <div className="absolute inset-[-4px] rounded-full border border-[#FFD700]/20 slow-spin opacity-80" style={{ animationDirection: 'reverse', animationDuration: '10s' }} />
                    <div className="w-16 h-16 rounded-full border border-[#C41E3A]/35 shadow-[0_0_30px_rgba(196,30,58,0.22)] flex items-center justify-center font-heading font-black text-2xl text-[#fde68a] bg-black/35 relative z-10">
                        {avatar}
                    </div>
                </div>
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#C41E3A]/70">Featured Voice</p>
                    <h3 className="text-2xl font-bold font-heading text-white transition-all duration-300">{name}</h3>
                    <p className="text-[#FFD700] font-mono text-[10px] uppercase tracking-[0.22em] mt-1">{role}</p>
                </div>
            </div>

            <div style={{ transform: 'translateZ(30px)' }} className="h-px bg-gradient-to-r from-[#C41E3A]/50 via-[#FFD700]/30 to-transparent" />

            <div style={{ transform: 'translateZ(30px)' }} className="relative z-10">
                <p className="text-white/62 font-body text-sm leading-relaxed">{details}</p>
            </div>

            <div style={{ transform: 'translateZ(35px)' }} className="relative z-10 flex gap-3 pt-2">
                {stats.map(({ label, val }, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 bg-white/[0.03] rounded-2xl py-3 border border-white/6 group-hover:border-[#C41E3A]/16 transition-colors duration-300">
                        <span className="font-heading font-black text-lg text-[#fde68a]">{val}</span>
                        <span className="font-mono text-[9px] tracking-widest text-white/30 uppercase mt-0.5">{label}</span>
                    </div>
                ))}
            </div>

            <div style={{ transform: 'translateZ(32px)' }} className="relative z-10 inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.22em] uppercase text-[#f5deb0]">
                <span className="w-2 h-2 rounded-full bg-[#C41E3A] animate-pulse" />
                Live Session Access
            </div>
        </motion.div>
    );
}

export default function Speakers() {
    return (
        <section id="speakers" className="section-shell relative py-16 md:py-32 bg-wakanda-dark text-slate-50 overflow-hidden" style={{ perspective: '1200px' }}>
            <div className="absolute inset-0 bg-holo-grid bg-grid-sm opacity-[0.04] pointer-events-none" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-[#C41E3A]/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-[#FFD700]/7 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className="mb-16 text-center flex flex-col items-center"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#C41E3A]/25 bg-[#120400]/65 backdrop-blur-xl mb-5 panel-sheen">
                        <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                        <span className="text-sm font-mono tracking-[0.25em] text-[#E8A000] uppercase font-bold">Masterminds</span>
                    </div>
                    <h3 className="text-5xl md:text-7xl font-black font-heading tracking-tighter uppercase mb-4 text-white leading-[0.95]">
                        Guest <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #C41E3A 0%, #C41E3A 46%, #FFD700 100%)' }}>Speakers</span>
                    </h3>
                    <p className="max-w-2xl text-white/42 font-mono tracking-[0.18em] uppercase text-xs leading-relaxed">
                        Learn directly from innovators shaping future-ready systems, cybersecurity strategy, product engineering, and next-generation digital experiences.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {SPEAKERS.map((sp, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ delay: i * 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <TiltCard {...sp} />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mt-12 flex justify-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-dashed border-[#C41E3A]/25 bg-[#C41E3A]/5 text-white/40 font-mono text-xs tracking-widest uppercase backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-[#C41E3A]/80 animate-pulse" />
                        More Speakers to be Announced Soon
                        <span className="w-2 h-2 rounded-full bg-[#FFD700]/80 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
