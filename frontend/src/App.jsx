import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Lenis from 'lenis';

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

// Eagerly load lightweight / above-fold components
import Navbar from './components/Navbar';
import CountdownBanner from './components/CountdownBanner';
import CustomCursor from './components/CustomCursor';
import ClawTransition from './components/ClawTransition';
import SectionDivider from './components/SectionDivider';

// Hero is above-the-fold — eager import so it renders during the loading screen
import Hero from './components/Hero';
import CircuitBoard from './components/CircuitBoard';

// Lazy-load below-fold sections only
const EnergyReveal = lazy(() => import('./components/EnergyReveal'));

// Lazy-load sub-pages
const TechnicalEvents = lazy(() => import('./pages/TechnicalEvents'));
const NonTechnicalEvents = lazy(() => import('./pages/NonTechnicalEvents'));
const EventRegistration = lazy(() => import('./pages/EventRegistration'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const EventsGrid = lazy(() => import('./components/EventsGrid'));
const Speakers = lazy(() => import('./components/Speakers'));
const Schedule = lazy(() => import('./components/Schedule'));
const Sponsors = lazy(() => import('./components/Sponsors'));
const FAQ = lazy(() => import('./components/FAQ'));
const RegistrationCTA = lazy(() => import('./components/RegistrationCTA'));

// ── Scroll Progress Bar ────────────────────────────────────────────────────
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      id="scroll-progress"
      style={{ scaleX, transformOrigin: 'left' }}
    />
  );
}

// ── Floating Register Bar ──────────────────────────────────────────────────
function FloatingRegisterBar() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const unsub = scrollY.on('change', (v) => setVisible(v > 500));
    return unsub;
  }, [scrollY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] pointer-events-auto"
        >
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-wakanda-dark/90 backdrop-blur-xl border border-vibranium/40 shadow-vibranium-glow">
            <span className="w-2 h-2 rounded-full bg-holo-cyan animate-pulse shadow-[0_0_8px_#00f0ff]" />
            <span className="text-xs font-mono text-vibranium/60 tracking-widest uppercase hidden sm:block">Registration Open</span>
            <button
              onClick={() => document.querySelector('#register')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-1.5 rounded-full bg-vibranium text-wakanda-dark text-xs font-bold font-heading tracking-widest uppercase hover:shadow-vibranium-glow transition-all duration-200 hover:scale-105"
            >
              Register Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Social Icon ────────────────────────────────────────────────────────────
function SocialIcon({ href, label, children }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.15, y: -2 }}
      whileTap={{ scale: 0.9 }}
      className="w-10 h-10 rounded-full border border-vibranium/20 flex items-center justify-center text-vibranium/45 hover:text-vibranium-light hover:border-vibranium/50 hover:shadow-vibranium-glow transition-all duration-300"
      aria-label={label}
    >
      {children}
    </motion.a>
  );
}

function SectionPulseOverlay({ pulseKey }) {
  return (
    <AnimatePresence>
      {pulseKey > 0 && (
        <motion.div
          key={pulseKey}
          initial={{ opacity: 0.65, scale: 0.4 }}
          animate={{ opacity: 0, scale: 1.45 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.95, ease: 'easeOut' }}
          className="fixed inset-0 z-[150] pointer-events-none flex items-center justify-center"
        >
          <motion.div
            initial={{ rotate: 0, scale: 0.7 }}
            animate={{ rotate: 30, scale: 1.25 }}
            transition={{ duration: 0.95, ease: 'easeOut' }}
            className="absolute w-[54rem] h-[54rem] rounded-full bg-[radial-gradient(circle,rgba(123,44,255,0.18)_0%,rgba(123,44,255,0.10)_28%,rgba(212,175,55,0.08)_42%,transparent_72%)] blur-[24px]"
          />
          <motion.div
            initial={{ opacity: 0.9, scaleX: 0.35, scaleY: 0.7 }}
            animate={{ opacity: 0, scaleX: 1.6, scaleY: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute h-[2px] w-[70vw] max-w-[62rem] bg-[linear-gradient(90deg,transparent,rgba(103,232,249,0.85),rgba(212,175,55,0.7),transparent)] blur-[1px]"
          />
          <motion.div
            initial={{ opacity: 0.7, scale: 0.35 }}
            animate={{ opacity: 0, scale: 1.65 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute w-[24rem] h-[24rem] rounded-full border border-[#67e8f9]/35"
          />
          <motion.div
            initial={{ opacity: 0.85, scale: 0.45 }}
            animate={{ opacity: 0, scale: 1.85 }}
            transition={{ duration: 0.95, ease: 'easeOut', delay: 0.04 }}
            className="absolute w-[18rem] h-[18rem] rounded-full border border-[#9D00FF]/35"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RouteTransitionOverlay({ transitionKey }) {
  return (
    <AnimatePresence>
      {transitionKey > 0 && (
        <motion.div
          key={transitionKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="fixed inset-0 z-[175] pointer-events-none overflow-hidden"
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1], opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.7, times: [0, 0.35, 1], ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 origin-left bg-[linear-gradient(90deg,rgba(4,1,9,0.96)_0%,rgba(32,8,52,0.82)_28%,rgba(9,25,35,0.58)_55%,rgba(212,175,55,0.12)_78%,transparent_100%)]"
          />

          <motion.div
            initial={{ x: '-100%', opacity: 0.9 }}
            animate={{ x: '130%', opacity: [0, 1, 0] }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-y-0 left-0 w-[32%] bg-[linear-gradient(90deg,transparent,rgba(103,232,249,0.2),rgba(212,175,55,0.28),transparent)] skew-x-[-22deg] blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0.8, scaleX: 0.12 }}
            animate={{ opacity: [0, 1, 0], scaleX: [0.12, 1.15, 1.45] }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 h-[2px] w-[88vw] max-w-[88rem] -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(103,232,249,0.95),rgba(212,175,55,0.85),rgba(123,44,255,0.9),transparent)] shadow-[0_0_30px_rgba(103,232,249,0.35)]"
          />

          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.25 }}
              animate={{ opacity: [0, 0.75, 0], scale: [0.25, 1.1 + index * 0.25, 1.55 + index * 0.2] }}
              transition={{ duration: 0.82, delay: index * 0.04, ease: 'easeOut' }}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${index === 1 ? 'w-[26rem] h-[26rem] border-[#9D00FF]/28' : index === 2 ? 'w-[36rem] h-[36rem] border-[#67e8f9]/18' : 'w-[16rem] h-[16rem] border-[#7b2cff]/35'}`}
            />
          ))}

          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(123,44,255,0.14),rgba(103,232,249,0.06)_26%,transparent_62%)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RouteScene({ children, routeKey }) {
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 24, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 1.005 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [loading, setLoading] = useState(isHome);
  const [clawTrigger, setClawTrigger] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const [routeTransitionKey, setRouteTransitionKey] = useState(0);
  const lastSectionRef = useRef('hero');
  const lastPathRef = useRef(location.pathname);

  useEffect(() => {
    // Skip Lenis on touch/mobile — native scroll is far smoother and faster
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!isHome) return;
    // Trigger dismiss once the page's critical resources are ready
    const dismiss = () => { setLoading(false); window.scrollTo(0, 0); };
    // Dismiss as soon as the window is interactive — max 600 ms fallback
    const timer = setTimeout(dismiss, 600);
    if (document.readyState === 'complete') {
      clearTimeout(timer);
      // Small rAF so the first frame is painted before we pull the curtain
      requestAnimationFrame(() => requestAnimationFrame(dismiss));
    } else {
      window.addEventListener('load', () => { clearTimeout(timer); dismiss(); }, { once: true });
    }
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isHome || loading) return;
    if (!location.hash) return;
    const id = window.setTimeout(() => {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
    return () => window.clearTimeout(id);
  }, [isHome, loading, location]);

  useEffect(() => {
    if (!isHome || loading || isTouch) return; // skip claw/pulse on mobile

    const sectionIds = ['hero', 'events', 'speakers', 'schedule', 'sponsors', 'faq', 'register'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          if (!id || id === lastSectionRef.current) return;
          lastSectionRef.current = id;
          setClawTrigger(false);
          requestAnimationFrame(() => setClawTrigger(true));
          setPulseKey((prev) => prev + 1);
        });
      },
      { threshold: 0.45, rootMargin: '-10% 0px -25% 0px' },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome, loading]);

  useEffect(() => {
    if (lastPathRef.current !== location.pathname) {
      lastPathRef.current = location.pathname;
      setRouteTransitionKey((prev) => prev + 1);
    }
  }, [location.pathname]);

  return (
    <div className="bg-wakanda-dark min-h-screen text-slate-50 font-body overflow-x-hidden relative">
      <CircuitBoard />
      {!isTouch && <ClawTransition trigger={clawTrigger} color="#7b2cff" />}
      {!isTouch && <SectionPulseOverlay pulseKey={pulseKey} />}
      {!isTouch && <RouteTransitionOverlay transitionKey={routeTransitionKey} />}
      {!isTouch && (
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-24 left-[8%] w-[28rem] h-[28rem] rounded-full bg-vibranium/10 blur-[150px] float-orb" />
        <div className="absolute top-[22%] right-[5%] w-[24rem] h-[24rem] rounded-full bg-holo-cyan/7 blur-[150px] float-orb" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[46rem] h-[20rem] rounded-full bg-vibranium-dark/10 blur-[170px]" />
        <div className="absolute inset-0 mesh-fade opacity-10" />
        <motion.div
          animate={{ opacity: [0.16, 0.34, 0.16], scaleX: [0.94, 1.08, 0.94] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[18%] left-1/2 h-[1px] w-[82vw] max-w-[78rem] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(103,232,249,0.55),rgba(212,175,55,0.5),transparent)] blur-[0.5px]"
        />
        <motion.div
          animate={{ opacity: [0.08, 0.22, 0.08], scaleX: [0.82, 1.06, 0.82] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="absolute bottom-[16%] left-1/2 h-[1px] w-[74vw] max-w-[70rem] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(123,44,255,0.48),rgba(103,232,249,0.26),transparent)] blur-[0.5px]"
        />
      </div>
      )}
      <Navbar />
      {/* Custom Cursor */}
      <CustomCursor />
      <ScrollProgressBar />
      {/* Floating register bar — home only */}
      {isHome && <FloatingRegisterBar />}

      {/* Loading screen overlays content — only on home page */}
      <AnimatePresence>
        {isHome && loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="fixed inset-0 z-[999] bg-wakanda-dark flex flex-col items-center justify-center p-6"
          >
            {/* Rings */}
            <div className="relative w-36 h-36 mb-10">
              {/* Outer ring — cyan + vibranium */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-holo-cyan border-r-vibranium opacity-80"
              />
              {/* Mid ring — gold + vibranium (Black Panther gold accent) */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
                className="absolute inset-3 rounded-full border-2 border-transparent opacity-80"
                style={{
                  borderBottomColor: 'var(--vibranium)',
                  borderLeftColor: 'var(--vibranium-light)',
                  boxShadow: '0 0 14px rgba(157,0,255,0.5)',
                }}
              />
              {/* Inner ring — deep gold shimmer */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
                className="absolute inset-7 rounded-full border"
                style={{ borderColor: 'rgba(157,0,255,0.35)' }}
              />
              {/* Radial gold ambient glow behind the rings */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(157,0,255,0.12) 0%, transparent 70%)',
                }}
              />
              {/* Pulsing center dot */}
              <motion.div
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-vibranium shadow-vibranium-glow"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-center"
                >
                  <div className="font-heading font-black text-lg tracking-[0.2em] uppercase leading-none bp-vibranium-text">
                    CYSTECH
                  </div>
                  <div className="font-mono text-[8px] tracking-[0.5em] mt-1 bp-vibranium-text">2K26</div>
                </motion.div>
              </div>
            </div>

            {/* Dual scan bars */}
            <motion.div className="w-56 h-[2px] bg-white/5 relative overflow-hidden rounded-full mb-1.5">
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                className="absolute inset-y-0 w-1/3 left-0 bg-gradient-to-r from-transparent via-vibranium to-transparent"
              />
            </motion.div>
            <motion.div className="w-36 h-px bg-white/5 relative overflow-hidden rounded-full">
              <motion.div
                animate={{ x: ['100%', '-100%'] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                className="absolute inset-y-0 w-1/2 right-0 bg-gradient-to-r from-transparent via-holo-cyan to-transparent"
              />
            </motion.div>

            {/* Status text */}
            <div className="mt-6 relative h-5 flex flex-col items-center w-64">
              {[
                { msg: 'Calibrating holographic arrays', delay: 0 },
                { msg: 'Loading event manifests', delay: 0.6 },
                { msg: 'Synchronising vibranium cores', delay: 1.1 },
              ].map(({ msg, delay }) => (
                <motion.p
                  key={msg}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: [0, 0.6, 0], y: [4, 0, -4] }}
                  transition={{ delay, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  className="font-mono text-[9px] tracking-[0.4em] text-white/30 uppercase absolute inset-x-0 text-center"
                >
                  {msg}...
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/technical" element={<RouteScene routeKey="technical"><Suspense fallback={null}><TechnicalEvents /></Suspense></RouteScene>} />
          <Route path="/non-technical" element={<RouteScene routeKey="non-technical"><Suspense fallback={null}><NonTechnicalEvents /></Suspense></RouteScene>} />
          <Route path="/register/:eventId" element={<RouteScene routeKey="registration"><Suspense fallback={null}><EventRegistration /></Suspense></RouteScene>} />
          <Route path="/admin" element={<RouteScene routeKey="admin-login"><Suspense fallback={null}><AdminLogin /></Suspense></RouteScene>} />
          <Route path="/admin/dashboard" element={<RouteScene routeKey="admin-dashboard"><Suspense fallback={null}><AdminDashboard /></Suspense></RouteScene>} />
          <Route path="/" element={
            <RouteScene routeKey="home">
              <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: loading ? 0 : 1 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 w-full"
              >
                <div id="hero">
                  <Hero />
                </div>

                <CountdownBanner />

                <Suspense fallback={null}>
                  <EnergyReveal />
                </Suspense>

                <SectionDivider label="Events" variant="vibranium" />

                <div id="events" className="relative z-10">
                  <Suspense fallback={<div className="h-64 bg-wakanda-dark" />}>
                    <EventsGrid />
                  </Suspense>
                </div>

                <SectionDivider label="Speakers" variant="cyan" />

                <div id="speakers">
                  <Suspense fallback={<div className="h-64 bg-wakanda-dark" />}>
                    <Speakers />
                  </Suspense>
                </div>

                <SectionDivider label="Agenda" variant="subtle" />

                <div id="schedule">
                  <Suspense fallback={<div className="h-64 bg-wakanda-dark" />}>
                    <Schedule />
                  </Suspense>
                </div>

                <SectionDivider label="Partners" variant="gold" />

                <div id="sponsors">
                  <Suspense fallback={<div className="h-40 bg-wakanda-dark" />}>
                    <Sponsors />
                  </Suspense>
                </div>

                <SectionDivider label="FAQ" variant="subtle" />

                <div id="faq">
                  <Suspense fallback={<div className="h-40 bg-wakanda-dark" />}>
                    <FAQ />
                  </Suspense>
                </div>

                <SectionDivider label="Register" variant="vibranium" />

                <div id="register">
                  <Suspense fallback={<div className="h-64 bg-wakanda-dark" />}>
                    <RegistrationCTA />
                  </Suspense>
                </div>

                {/* ── Footer ───────────────────────────────────────────────────── */}
                <footer className="section-shell relative border-t border-vibranium/10 bg-wakanda-dark overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vibranium/40 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(157,0,255,0.08),transparent_60%)] pointer-events-none" />
                  <div className="absolute right-[10%] top-10 w-56 h-56 rounded-full bg-holo-cyan/6 blur-[110px] pointer-events-none" />
                  <div className="absolute left-[8%] bottom-0 w-64 h-64 rounded-full bg-vibranium/8 blur-[120px] pointer-events-none" />

                  <div className="container mx-auto px-6 max-w-6xl relative z-10 pt-14 pb-8">
                    <div className="panel-sheen mb-12 rounded-[2rem] border border-vibranium/20 bg-white/[0.02] backdrop-blur-xl px-6 py-7 md:px-8 md:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div>
                        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-vibranium/70 mb-3">Sympho Transmission</p>
                        <h3 className="text-2xl md:text-3xl font-heading font-black tracking-tight text-white leading-tight">
                          Ready to enter the most <span className="bp-vibranium-text">cinematic symposium</span> on campus?
                        </h3>
                        <p className="mt-3 max-w-2xl text-white/45 text-sm md:text-base">
                          Explore flagship technical events, non-technical stage energy, premium speaker sessions, and a registration flow built for speed.
                        </p>
                      </div>
                      <button
                        onClick={() => document.querySelector('#register')?.scrollIntoView({ behavior: 'smooth' })}
                        className="panel-sheen shrink-0 px-7 py-3.5 rounded-full bg-vibranium text-wakanda-dark font-heading font-black tracking-[0.16em] uppercase text-sm shadow-vibranium-glow hover:scale-[1.03] transition-all duration-300"
                      >
                        Reserve Entry
                      </button>
                    </div>
                {/* 4-column grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-10 mb-8 md:mb-12">

                  {/* Brand */}
                  <div className="col-span-2 md:col-span-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-vibranium/20 border border-vibranium/40 flex items-center justify-center shadow-vibranium-glow flex-shrink-0">
                        <span className="font-heading font-black text-white text-sm">C</span>
                      </div>
                      <div>
                        <div className="font-heading font-black text-white text-sm tracking-widest">CYSTECH</div>
                        <div className="font-mono text-vibranium/50 text-[10px] tracking-[0.3em]">2K26</div>
                      </div>
                    </div>
                    <p className="text-white/25 text-sm font-body leading-relaxed">
                      Dept. of Computer Science — Annual Technology Symposium. Where innovation meets vision.
                    </p>
                    <div className="font-mono text-vibranium/30 text-[10px] tracking-widest uppercase">April 8, 2026</div>
                    <div className="flex items-center gap-2.5 pt-1">
                      <SocialIcon href="#" label="GitHub">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                      </SocialIcon>
                      <SocialIcon href="#" label="Twitter / X">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                      </SocialIcon>
                      <SocialIcon href="#" label="LinkedIn">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                      </SocialIcon>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-white/50 text-[10px] tracking-[0.3em] uppercase">Navigate</h4>
                    <ul className="space-y-2.5">
                      {[
                        { label: 'Events', href: '#events' },
                        { label: 'Speakers', href: '#speakers' },
                        { label: 'Schedule', href: '#schedule' },
                        { label: 'Sponsors', href: '#sponsors' },
                        { label: 'FAQ', href: '#faq' },
                        { label: 'Register', href: '#register' },
                      ].map(({ label, href }) => (
                        <li key={href}>
                          <a href={href} className="group flex items-center gap-1.5 text-white/25 text-sm font-body hover:text-vibranium-light transition-colors duration-200">
                            <span className="w-0 group-hover:w-2.5 h-px bg-vibranium transition-all duration-300 rounded-full" />
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Events */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-white/50 text-[10px] tracking-[0.3em] uppercase">Events</h4>
                    <ul className="space-y-2.5">
                      {[
                        { label: 'All Events', href: '#events' },
                        { label: 'Technical Events', href: '/technical' },
                        { label: 'Non-Technical', href: '/non-technical' },
                        { label: 'Debugging', href: '/technical' },
                        { label: 'Paper Presentation', href: '/technical' },
                        { label: 'E-Sports', href: '/non-technical' },
                      ].map(({ label, href }) => (
                        <li key={label}>
                          <a href={href} className="group flex items-center gap-1.5 text-white/25 text-sm font-body hover:text-holo-cyan transition-colors duration-200">
                            <span className="w-0 group-hover:w-2.5 h-px bg-holo-cyan transition-all duration-300 rounded-full" />
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-white/50 text-[10px] tracking-[0.3em] uppercase">Contact</h4>
                    <ul className="space-y-3">
                      {[
                        { icon: '📍', text: 'Dhanalakshmi College of Engineering', sub: 'ECE Block (2nd Floor), Manimangalam' },
                        { icon: '📅', text: 'April 8, 2026', sub: '9:00 AM to 3:30 PM' },
                        { icon: '🧭', text: 'Dr. VPR Nagar, Tambaram, Chennai-601301', sub: 'Campus address' },
                        { icon: '📞', text: 'R Rishi · 8610621613', sub: 'Student organizer' },
                      ].map(({ icon, text, sub }) => (
                        <li key={text} className="flex items-start gap-2.5">
                          <span className="text-sm mt-0.5">{icon}</span>
                          <div>
                            <p className="text-white/35 text-xs font-body">{text}</p>
                            <p className="text-white/18 text-[10px] font-mono tracking-widest">{sub}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-vibranium/15 to-transparent mb-7" />

                    {/* Bottom bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <p className="font-mono text-white/18 text-[10px] tracking-widest uppercase">
                        © 2026 CYSTECH · Dept. of ECE / Computer Science Symposium · All Rights Reserved
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/8 text-white/20 hover:text-vibranium hover:border-vibranium/30 font-mono text-[9px] tracking-widest uppercase transition-all duration-300"
                        >
                          <svg className="w-2.5 h-2.5 group-hover:-translate-y-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                          Top
                        </button>
                        <div className="flex items-center gap-1.5">
                          <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-green-400"
                          />
                          <span className="font-mono text-white/18 text-[10px] tracking-widest uppercase">Systems Online</span>
                        </div>
                        <span className="text-white/10 text-xs">·</span>
                        <span className="font-mono text-white/18 text-[10px] tracking-widest uppercase">Built for the Future</span>
                      </div>
                    </div>
                  </div>
                </footer>
              </motion.main>
            </RouteScene>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
