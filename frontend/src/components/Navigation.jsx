import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { EVENT_STATS } from '../data/events';

// Desktop anchor links only — Technical/Non-Tech live in the Events dropdown
const NAV_LINKS = [
  { label: 'Speakers', href: '#speakers' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Sponsors', href: '#sponsors' },
  { label: 'FAQ',      href: '#faq'      },
  { label: 'Admin',    href: '/admin'    },
];

// All links shown in the mobile menu
const MOBILE_NAV_LINKS = [
  { label: 'Events',             href: '#events'        },
  { label: 'Technical Events',   href: '/technical'     },
  { label: 'Non-Technical',      href: '/non-technical' },
  { label: 'Speakers',          href: '#speakers'       },
  { label: 'Schedule',          href: '#schedule'       },
  { label: 'Sponsors',          href: '#sponsors'       },
  { label: 'FAQ',               href: '#faq'            },
  { label: 'Register',          href: '#register'       },
  { label: 'Admin Login',       href: '/admin'          },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#hero');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-spy: update activeLink as sections enter viewport
  useEffect(() => {
    if (location.pathname !== '/') return;
    const sectionIds = ['hero', 'events', 'speakers', 'schedule', 'sponsors', 'faq', 'register'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.25, rootMargin: '-64px 0px -40% 0px' }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  const handleNavClick = (href) => {
    setActiveLink(href);
    setMenuOpen(false);
    if (href.startsWith('/')) {
      navigate(href);
    } else {
      if (location.pathname !== '/') {
        navigate(`/${href}`);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-6 pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto rounded-full transition-all duration-500 flex items-center justify-between px-6 py-3 ${scrolled ? 'w-full md:w-[600px] bg-white/[0.03] backdrop-blur-xl border border-vibranium/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]' : 'w-full md:w-[800px] bg-transparent'
            }`}
        >
          <a href="#hero" onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-vibranium/20 flex items-center justify-center border border-vibranium/40 group-hover:bg-vibranium/40 transition-colors shadow-vibranium-glow">
              <span className="font-heading font-black text-white text-sm">C</span>
            </div>
            <span className={`font-heading font-bold text-lg tracking-tight transition-opacity ${scrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              CYSTECH<span className="text-vibranium-light">26</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.02] rounded-full p-1 border border-white/5">
            {/* Events dropdown */}
            <EventsDropdown activeLink={activeLink} onNavigate={handleNavClick} navigate={navigate} />
            {NAV_LINKS.map((link) => (
              <MagneticLink
                key={link.href}
                href={link.href}
                active={activeLink === link.href}
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </MagneticLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavClick('/admin')}
              className="hidden md:block px-5 py-2 rounded-full bg-vibranium/20 border border-vibranium/50 text-white text-sm font-medium hover:bg-vibranium hover:shadow-vibranium-glow transition-all duration-300"
            >
              Admin Login
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden flex flex-col gap-1.5 p-2"
            >
              <div className="w-6 h-[2px] bg-white rounded-full"></div>
              <div className="w-4 h-[2px] bg-white/70 rounded-full ml-auto"></div>
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-wakanda-dark/95 backdrop-blur-2xl text-white flex flex-col justify-center px-12"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 flex flex-col items-center justify-center gap-1 border border-white/10"
            >
              <div className="w-5 h-[2px] bg-white rotate-45 absolute"></div>
              <div className="w-5 h-[2px] bg-white -rotate-45 absolute"></div>
            </button>
            <div className="flex flex-col gap-6 text-4xl font-heading font-black tracking-tighter">
              {MOBILE_NAV_LINKS.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-vibranium hover:to-holo-cyan transition-all w-fit relative group"
                >
                  {item.label}
                  <div className="absolute -bottom-2 left-0 w-0 h-[2px] bg-vibranium transition-all duration-300 group-hover:w-full"></div>
                </motion.a>
              ))}
            </div>
            <motion.button
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => handleNavClick('#register')}
              className="mt-12 w-full py-4 rounded-full font-bold tracking-widest uppercase relative overflow-hidden"
              style={{
                background: 'linear-gradient(105deg, #6B00BE 0%, #9D00FF 35%, #B44FFF 55%, #9D00FF 80%, #6B00BE 100%)',
                backgroundSize: '200% auto',
                animation: 'vibranium-sweep 2.8s linear infinite',
                color: '#ffffff',
                boxShadow: '0 0 30px rgba(157,0,255,0.5), 0 0 60px rgba(157,0,255,0.2)',
              }}
            >
              Access Request
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Events Dropdown (desktop nav) ───────────────────────────────────────────
function EventsDropdown({ activeLink, onNavigate, navigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = activeLink === '#events' || activeLink === '/technical' || activeLink === '/non-technical';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`relative px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 rounded-full ${
          isActive ? 'text-white bg-white/10' : 'text-white/70 hover:text-white'
        }`}
      >
        Events
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="opacity-60"
        >
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 rounded-2xl bg-wakanda-dark/95 backdrop-blur-xl border border-vibranium/30 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Home events section */}
            <button
              onClick={() => { onNavigate('#events'); setOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left border-b border-white/5"
            >
              <span className="w-6 h-6 rounded-full bg-vibranium/20 flex items-center justify-center text-xs">⚡</span>
              All Events
            </button>
            {/* Technical page */}
            <button
              onClick={() => { navigate('/technical'); setOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left border-b border-white/5"
            >
              <span className="w-6 h-6 rounded-full bg-holo-cyan/20 flex items-center justify-center text-xs">🔬</span>
              <div>
                <div className="text-white/80 font-medium">Technical Events</div>
                <div className="text-white/30 text-xs mt-0.5">{EVENT_STATS.technicalCount} events · {EVENT_STATS.technicalPrizePoolLabel} prizes</div>
              </div>
            </button>
            {/* Non-Technical page */}
            <button
              onClick={() => { navigate('/non-technical'); setOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <span className="w-6 h-6 rounded-full bg-vibranium/20 flex items-center justify-center text-xs">🎭</span>
              <div>
                <div className="text-white/80 font-medium">Non-Technical</div>
                <div className="text-white/30 text-xs mt-0.5">{EVENT_STATS.nonTechnicalCount} events · {EVENT_STATS.nonTechnicalPrizePoolLabel} prizes</div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MagneticLink({ children, href, active, onClick }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <a
      href={href}
      onClick={(e) => { e.preventDefault(); onClick(); }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className="relative px-5 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors z-10"
    >
      <motion.span
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        className="inline-block relative z-10"
      >
        {children}
      </motion.span>
      {active && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-white/10 rounded-full z-0"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </a>
  );
}
