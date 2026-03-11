import React from 'react';
import { motion } from 'framer-motion';

/**
 * Divider between sections — glowing horizontal rule with optional label.
 * variant: 'vibranium' | 'cyan' | 'gold' | 'subtle'
 */
export default function SectionDivider({ label, variant = 'vibranium' }) {
  const colors = {
    vibranium: {
      line: 'from-transparent via-vibranium/60 to-transparent',
      glow: 'shadow-vibranium-glow',
      text: 'bp-vibranium-text',
      dot: 'bg-vibranium',
      ring: 'border-vibranium/40',
    },
    cyan: {
      line: 'from-transparent via-holo-cyan/40 to-transparent',
      glow: 'shadow-[0_0_12px_rgba(0,240,255,0.4)]',
      text: 'text-holo-cyan',
      dot: 'bg-holo-cyan',
      ring: 'border-holo-cyan/30',
    },
    gold: {
      line: 'from-transparent via-vibranium/60 to-transparent',
      glow: 'shadow-[0_0_18px_rgba(157,0,255,0.55),0_0_35px_rgba(157,0,255,0.2)]',
      text: 'bp-vibranium-text',
      dot:  'bg-vibranium',
      ring: 'border-vibranium/30',
    },
    subtle: {
      line: 'from-transparent via-vibranium/20 to-transparent',
      glow: '',
      text: 'text-vibranium/35',
      dot: 'bg-vibranium/30',
      ring: 'border-vibranium/15',
    },
  };

  const c = colors[variant] ?? colors.subtle;

  return (
    <div className="section-shell relative w-full flex items-center justify-center py-5 md:py-7">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute inset-x-0 h-px bg-gradient-to-r ${c.line} ${c.glow}`}
        style={{ transformOrigin: 'center' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className={`absolute left-1/2 top-1/2 -translate-x-[calc(50%+72px)] -translate-y-1/2 w-3 h-3 rounded-full ${c.dot} blur-[1px]`}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.16, duration: 0.6 }}
        className={`absolute left-1/2 top-1/2 translate-x-[calc(50%+58px)] -translate-y-1/2 w-2.5 h-2.5 rounded-full ${c.dot}`}
      />
      {label && (
        <div className={`panel-sheen relative flex items-center gap-3 bg-wakanda-dark/90 backdrop-blur-xl px-6 py-2.5 rounded-full border ${c.ring}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shadow-[0_0_10px_currentColor]`} />
          <span className={`font-mono text-[9px] tracking-[0.35em] uppercase ${c.text}`}>{label}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shadow-[0_0_10px_currentColor]`} />
        </div>
      )}
    </div>
  );
}
