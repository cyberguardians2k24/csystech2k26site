import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Events', href: '#events' },
  { label: 'Technical', href: '/technical' },
  { label: 'Non Tech', href: '/non-technical' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Admin', href: '/admin' },
]

const PAGE_LABELS = {
  '/': 'Symposium Interface',
  '/technical': 'Technical Arena',
  '/non-technical': 'Non Technical Arena',
  '/admin': 'Admin Access',
  '/admin/dashboard': 'Admin Dashboard',
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (location.pathname === '/') {
      const ids = ['hero', 'events', 'speakers', 'schedule', 'sponsors', 'faq', 'register']
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveLink(`#${entry.target.id}`)
            }
          })
        },
        { threshold: 0.35, rootMargin: '-20% 0px -45% 0px' },
      )

      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })

      return () => observer.disconnect()
    }

    if (location.pathname.startsWith('/admin')) {
      setActiveLink('/admin')
      return
    }

    setActiveLink(location.pathname)
  }, [location.pathname])

  const currentPageLabel = useMemo(() => {
    if (location.pathname.startsWith('/register/')) return 'Event Registration'
    return PAGE_LABELS[location.pathname] ?? 'CYSTECH 2K26'
  }, [location.pathname])

  const handleNavClick = (href) => {
    setActiveLink(href)
    setMobileOpen(false)

    if (href.startsWith('/')) {
      navigate(href)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (location.pathname !== '/') {
      navigate(`/${href}`)
      return
    }

    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4"
      >
        <div className={`nav-command-shell mx-auto max-w-5xl rounded-[1.2rem] px-3 py-2 flex items-center justify-between gap-3 transition-all duration-700 ${scrolled ? 'bg-wakanda-darker/92 shadow-[0_20px_80px_rgba(0,0,0,0.45)] border border-vibranium/16 backdrop-blur-2xl' : 'bg-[#06020d]/74 border border-[#c084fc]/10 backdrop-blur-xl'}`}>
          <button
            onClick={() => handleNavClick('#hero')}
            className="hidden md:flex items-center gap-2 rounded-full border border-[#67e8f9]/14 bg-[#071019]/38 px-3 py-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#67e8f9] animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-[#a5f3fc] whitespace-nowrap">{currentPageLabel}</span>
          </button>

          {/* Mobile-only brand */}
          <button
            onClick={() => handleNavClick('#hero')}
            className="md:hidden flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-full bg-vibranium/20 border border-vibranium/40 flex items-center justify-center shadow-vibranium-glow">
              <span className="font-heading font-black text-white text-xs">C</span>
            </div>
            <span className="font-heading font-black text-white text-sm tracking-widest">CYSTECH</span>
          </button>

          <div className="hidden lg:flex items-center gap-1 rounded-full border border-[#c084fc]/14 bg-[#090311]/70 px-1.5 py-1 mx-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 + 0.15 }}
              >
                <NavLink
                  href={link.href}
                  label={link.label}
                  active={activeLink === link.href || location.pathname === link.href}
                  onClick={() => handleNavClick(link.href)}
                />
              </motion.div>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleNavClick('#register')}
              className="panel-sheen px-4 py-2 rounded-full border border-[#a855f7]/28 bg-[linear-gradient(135deg,rgba(168,85,247,0.68),rgba(14,165,233,0.26))] text-white font-heading font-bold text-[11px] tracking-[0.18em] uppercase shadow-[0_0_24px_rgba(168,85,247,0.22)] hover:scale-[1.02] transition-all duration-300"
            >
              Register
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            className="lg:hidden flex flex-col gap-1.5 p-2.5 rounded-full border border-[#c084fc]/18 bg-[#08020f]/74 backdrop-blur-xl relative z-50 group shrink-0"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-[3px] bg-vibranium-light rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(157,0,255,0.8)] ${mobileOpen
                  ? i === 0 ? 'w-7 rotate-45 translate-y-[7px]' : i === 1 ? 'opacity-0 w-0' : 'w-7 -rotate-45 -translate-y-[7px]'
                  : i === 1 ? 'w-5 ml-auto' : 'w-7'
                }`}
              />
            ))}
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%', height: 0 }}
            animate={{ opacity: 1, y: 0, height: '100vh' }}
            exit={{ opacity: 0, y: '-100%', height: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-wakanda-darker/98 backdrop-blur-3xl pt-24 px-6 flex flex-col gap-2 border-b-2 border-vibranium/50"
          >
            <div className="absolute inset-0 bg-holo-grid opacity-10 pointer-events-none" />

            <div className="flex flex-col gap-6 relative z-10">
              <div className="mb-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
                <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#9D00FF]/70">Current Page</p>
                <p className="mt-2 text-white font-heading text-lg font-black">{currentPageLabel}</p>
              </div>

              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  onClick={() => handleNavClick(link.href)}
                  className="group relative text-left py-4 border-b border-vibranium-dark/20 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-vibranium-dark/30 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

                  <div className="relative flex items-center justify-between">
                    <span className={`font-orbitron text-[1.35rem] font-bold tracking-[0.18em] transition-colors duration-300 ${activeLink === link.href || location.pathname === link.href ? 'text-vibranium-light' : 'text-white/90 group-hover:text-vibranium-light'}`}>
                      {link.label}
                    </span>
                    <motion.div
                      className="w-8 h-px bg-vibranium-light opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                    />
                  </div>
                </motion.button>
              ))}

              <motion.button
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: NAV_LINKS.length * 0.06 }}
                onClick={() => handleNavClick('#register')}
                className="panel-sheen mt-4 py-4 rounded-2xl border border-[#a855f7]/35 bg-[linear-gradient(135deg,rgba(168,85,247,0.72),rgba(14,165,233,0.26))] text-white font-orbitron text-sm tracking-[0.22em] uppercase font-bold shadow-[0_0_30px_rgba(168,85,247,0.22)]"
              >
                Register Now
              </motion.button>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="mt-auto mb-12 h-1 w-full bg-gradient-to-r from-vibranium-dark via-vibranium to-vibranium-light shadow-vibranium-glow"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ href, label, active, onClick }) {
  return (
    <motion.button
      whileHover="hover"
      onClick={onClick}
      className="relative group px-3 py-2"
    >
      <span className={`relative z-10 font-orbitron text-[10px] tracking-[0.16em] uppercase font-semibold transition-colors duration-300 ${active ? 'text-vibranium-light drop-shadow-[0_0_8px_rgba(157,0,255,0.8)]' : 'text-white/80 group-hover:text-white'}`}>
        {label}
      </span>

      <motion.div
        variants={{ hover: { width: '100%', opacity: 1 } }}
        initial={{ width: '0%', opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 h-px bg-vibranium-light shadow-[0_0_8px_#B44FFF]"
      />

      <motion.div
        variants={{ hover: { width: '100%', opacity: 1 } }}
        initial={{ width: '0%', opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 right-0 h-px bg-vibranium-light shadow-[0_0_8px_#B44FFF]"
      />

      {active && (
        <motion.div
          layoutId="activeNavIndicator"
          className="absolute inset-0 bg-gradient-to-r from-[#1d0a2d]/80 via-[#33124f]/70 to-[#0b2431]/75 border border-[#c084fc]/22 shadow-[inset_0_0_20px_rgba(192,132,252,0.16),0_0_24px_rgba(103,232,249,0.06)] rounded-full"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  )
}
