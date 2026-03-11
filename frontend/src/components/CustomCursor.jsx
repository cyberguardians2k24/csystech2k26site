import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export default function CustomCursor() {
  // Never render on touch/mobile — springs still fire on every frame even when hidden
  if (isTouch) return null;
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const auraRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  // Smooth ring position
  const ringX = useSpring(0, { stiffness: 120, damping: 18 });
  const ringY = useSpring(0, { stiffness: 120, damping: 18 });
  const auraX = useSpring(0, { stiffness: 70, damping: 14 });
  const auraY = useSpring(0, { stiffness: 70, damping: 14 });

  useEffect(() => {
    const moveDot = (e) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      auraX.set(e.clientX);
      auraY.set(e.clientY);
    };

    // Use event delegation — one pair of listeners instead of one per element,
    // and no MutationObserver re-attaching on every DOM change.
    const expandRing = (e) => {
      if (e.target.closest('a, button, [data-hover]')) {
        ringRef.current?.classList.add('expanded');
        auraRef.current?.classList.add('expanded');
        setHovering(true);
      }
    };
    const collapseRing = (e) => {
      if (e.target.closest('a, button, [data-hover]')) {
        ringRef.current?.classList.remove('expanded');
        auraRef.current?.classList.remove('expanded');
        setHovering(false);
      }
    };

    window.addEventListener('mousemove', moveDot, { passive: true });
    document.addEventListener('mouseover', expandRing, { passive: true });
    document.addEventListener('mouseout', collapseRing, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveDot);
      document.removeEventListener('mouseover', expandRing);
      document.removeEventListener('mouseout', collapseRing);
    };
  }, [auraX, auraY, ringX, ringY]);

  return (
    <>
      <motion.div
        ref={auraRef}
        className="cursor-aura"
        style={{ left: auraX, top: auraY }}
      />
      <div ref={dotRef} className="cursor-dot" />
      <motion.div
        ref={ringRef}
        className="cursor-ring"
        style={{ left: ringX, top: ringY }}
      />
      <motion.div
        className="cursor-label"
        animate={{ opacity: hovering ? 1 : 0, scale: hovering ? 1 : 0.86, y: hovering ? 0 : 6 }}
        transition={{ duration: 0.2 }}
        style={{ left: ringX, top: ringY }}
      >
        TAP
      </motion.div>
    </>
  );
}
