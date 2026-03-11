import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EVENT_STATS } from '../data/events';

const EVENT_DATE = new Date('2026-03-15T09:00:00');

function getTimeLeft() {
    const diff = EVENT_DATE - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

function TimeBlock({ value, label }) {
    const display = String(value).padStart(2, '0');
    return (
        <div className="flex flex-col items-center group">
            <motion.div
                key={value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                whileHover={{ y: -4, scale: 1.03 }}
                className="panel-sheen holographic-panel min-w-[58px] sm:min-w-[78px] md:min-w-[112px] text-center px-2 sm:px-4 py-3 sm:py-4 md:py-5 border-vibranium/30 shadow-vibranium-glow rounded-[1.75rem]"
            >
                <div className="absolute inset-0 mesh-fade opacity-35 pointer-events-none" />
                <span className="relative font-heading font-black text-2xl sm:text-3xl md:text-5xl bp-vibranium-text text-glow-vibranium tabular-nums">
                    {display}
                </span>
            </motion.div>
            <span className="mt-1.5 font-mono text-[9px] sm:text-[10px] md:text-xs tracking-[0.25em] text-vibranium/45 uppercase">{label}</span>
        </div>
    );
}

function Separator() {
    return (
        <span className="font-heading font-black text-lg sm:text-3xl md:text-4xl text-vibranium text-glow-vibranium self-start mt-2 sm:mt-3 md:mt-4 select-none animate-pulse">
            :
        </span>
    );
}

export default function CountdownBanner() {
    const [time, setTime] = useState(getTimeLeft());

    useEffect(() => {
        const id = setInterval(() => setTime(getTimeLeft()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <section className="section-shell relative py-18 md:py-20 bg-wakanda-dark border-t border-b border-vibranium/10 overflow-hidden">
            <div className="absolute inset-0 mesh-fade opacity-20 pointer-events-none" />
            <div className="absolute -top-20 left-[10%] w-60 h-60 rounded-full bg-vibranium/12 blur-[100px] float-orb pointer-events-none" />
            <div className="absolute -bottom-24 right-[12%] w-72 h-72 rounded-full bg-holo-cyan/10 blur-[120px] float-orb pointer-events-none" style={{ animationDelay: '1.2s' }} />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vibranium/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-holo-cyan/25 to-transparent" />

            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-8"
                >
                    <div className="panel-sheen inline-flex items-center gap-3 px-5 py-2 rounded-full border border-vibranium/20 bg-wakanda-dark/70 backdrop-blur-xl">
                        <div className="h-px w-8 bg-vibranium" />
                        <p className="font-mono text-xs tracking-[0.3em] text-vibranium-light uppercase text-glow-vibranium">
                            Event Commences In
                        </p>
                        <div className="h-px w-8 bg-vibranium" />
                    </div>

                    <div className="flex items-start gap-1.5 sm:gap-3 md:gap-5">
                        <TimeBlock value={time.days} label="Days" />
                        <Separator />
                        <TimeBlock value={time.hours} label="Hours" />
                        <Separator />
                        <TimeBlock value={time.minutes} label="Min" />
                        <Separator />
                        <TimeBlock value={time.seconds} label="Sec" />
                    </div>

                    {/* Date/venue info row */}
                                        <div className="flex flex-wrap justify-center gap-3 mt-3">
                        {[
                            { icon: '📅', text: 'March 15–16, 2026' },
                            { icon: '📍', text: 'Main Campus Arena' },
                            { icon: '🏆', text: `${EVENT_STATS.totalPrizePoolLabel} Prizes`, gold: true },
                            { icon: '🎯', text: `${EVENT_STATS.totalCount} Events` },
                        ].map(({ icon, text, gold }) => (
                            <span
                              key={text}
                                                            className={`panel-sheen inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-mono text-[10px] md:text-xs tracking-widest transition-all duration-300 ${
                                gold
                                                                    ? 'bg-vibranium/10 border border-vibranium/40 text-vibranium vibranium-glow'
                                                                    : 'bg-white/[0.03] border border-vibranium/18 text-vibranium/55'
                              }`}
                            >
                                <span>{icon}</span> {text}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
