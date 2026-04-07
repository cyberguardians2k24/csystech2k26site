import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Events', href: '#events' },
  { label: 'Technical', href: '/technical' },
  { label: 'Non Tech', href: '/non-technical' },
  { label: 'Bus Route', href: '/busroute' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Admin', href: '/admin' },
]

const PAGE_LABELS = {
  '/': 'Symposium Interface',
  '/technical': 'Technical Arena',
  '/non-technical': 'Non Technical Arena',
  '/busroute': 'Bus Route Information',
  '/admin': 'Admin Access',
  '/admin/dashboard': 'Admin Dashboard',
}

export default function Navbar({ nonInteractive = false }) {
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
      const ids = ['hero', 'events', 'speakers', 'schedule', 'sponsors', 'register']
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

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return undefined

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = overflow
    }
  }, [mobileOpen])

  const currentPageLabel = useMemo(() => {
    if (location.pathname.startsWith('/register')) return 'Event Registration'
    return PAGE_LABELS[location.pathname] ?? 'CYSTECH2K26'
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
        className={`fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 ${nonInteractive ? 'pointer-events-none' : ''}`}
      >
        <div className={`nav-command-shell mx-auto max-w-5xl rounded-[1.2rem] px-3 py-2.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-3 transition-all duration-700 ${scrolled ? 'bg-wakanda-darker/92 shadow-[0_20px_80px_rgba(0,0,0,0.45)] border border-vibranium/16 backdrop-blur-2xl' : 'bg-wakanda-dark/74 border border-[#B8730A]/20 backdrop-blur-xl'}`}>
          <button
            onClick={() => handleNavClick('#hero')}
            className="hidden md:flex items-center gap-2 rounded-full border border-[#FFD700]/14 bg-[#071019]/38 px-3 py-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-[#fde68a] whitespace-nowrap">{currentPageLabel}</span>
          </button>

          {/* Mobile-only brand */}
          <button
            onClick={() => handleNavClick('#hero')}
            className="md:hidden flex flex-1 min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] overflow-hidden"
          >
            <div className="w-7 h-7 rounded-full bg-vibranium/20 border border-vibranium/40 flex items-center justify-center shadow-vibranium-glow shrink-0">
              <span className="font-heading font-black text-white text-[10px]">C</span>
            </div>
            <div className="min-w-0 text-left overflow-hidden">
              <div className="font-heading font-black text-white text-[11px] tracking-[0.18em] leading-none truncate">CYSTECH 2K26</div>
              <div className="font-mono text-[7px] tracking-[0.18em] uppercase text-white/45 truncate mt-0.5">SYMPOSIUM</div>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1 rounded-full border border-vibranium/30 bg-[#120400]/70 px-1.5 py-1 mx-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
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
              onClick={() => handleNavClick('/register')}
              className="panel-sheen px-4 py-2 rounded-full border border-vibranium/40 bg-[linear-gradient(135deg,rgba(196,30,58,0.68),rgba(184,115,10,0.26))] text-white font-heading font-bold text-[11px] tracking-[0.18em] uppercase shadow-[0_0_24px_rgba(196,30,58,0.28)] hover:scale-[1.02] transition-all duration-300"
            >
              Register
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleNavClick('/register')}
              className="px-3 py-2 rounded-full border border-vibranium/40 bg-[linear-gradient(135deg,rgba(196,30,58,0.72),rgba(184,115,10,0.22))] text-white font-heading font-bold text-[10px] tracking-[0.18em] uppercase shadow-[0_0_22px_rgba(196,30,58,0.28)] backdrop-blur-xl"
            >
              Register
            </button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              className="lg:hidden flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-vibranium/30 bg-[#0a0200]/74 backdrop-blur-xl relative z-50 group shrink-0"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`block h-[2px] bg-vibranium-light rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(196, 30, 58,0.8)] ${mobileOpen
                    ? i === 0 ? 'w-5 rotate-45 translate-y-[7px]' : i === 1 ? 'opacity-0 w-0' : 'w-5 -rotate-45 -translate-y-[7px]'
                    : i === 1 ? 'w-3 ml-auto' : 'w-5'
                  }`}
                />
              ))}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-[#020104]/72 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
              aria-label="Close mobile menu"
            />

            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-3 right-3 top-[4.8rem] z-50 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,4,18,0.98),rgba(5,2,10,0.98))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-3xl md:hidden"
            >
              <div className="absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_top,rgba(196,30,58,0.16),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(232,160,0,0.10),transparent_36%)] pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3 rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-3.5">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-[#C41E3A]/75">Current Page</p>
                    <p className="mt-2 text-white font-heading text-base font-black tracking-[0.08em]">{currentPageLabel}</p>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/75"
                    aria-label="Close menu"
                  >
                    <span className="text-lg leading-none">+</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {NAV_LINKS.map((link, i) => {
                    const active = activeLink === link.href || location.pathname === link.href

                    return (
                      <motion.button
                        key={link.href}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        onClick={() => handleNavClick(link.href)}
                        className={`rounded-[1.2rem] border px-4 py-3.5 text-left transition-all duration-300 ${active ? 'border-vibranium/50 bg-[linear-gradient(135deg,rgba(196,30,58,0.22),rgba(184,115,10,0.1))] shadow-[0_0_24px_rgba(196,30,58,0.18)]' : 'border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.05]'}`}
                      >
                        <div className="font-heading text-sm font-black uppercase tracking-[0.16em] text-white/92">{link.label}</div>
                        <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
                          {active ? 'Active route' : 'Open section'}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <motion.button
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.22 }}
                    onClick={() => handleNavClick('/register')}
                    className="panel-sheen rounded-[1.2rem] border border-vibranium/40 bg-[linear-gradient(135deg,rgba(196,30,58,0.78),rgba(184,115,10,0.22))] px-4 py-4 text-left shadow-[0_0_30px_rgba(196,30,58,0.22)]"
                  >
                    <div className="font-heading text-sm font-black uppercase tracking-[0.16em] text-white">Register</div>
                    <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/65">₹149 — General Pass</div>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.26 }}
                    onClick={() => handleNavClick('#events')}
                    className="rounded-[1.2rem] border border-gold-default/20 bg-[linear-gradient(135deg,rgba(232,160,0,0.12),rgba(255,255,255,0.03))] px-4 py-4 text-left"
                  >
                    <div className="font-heading text-sm font-black uppercase tracking-[0.16em] text-white">Events</div>
                    <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">Browse highlights</div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
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
      <span className={`relative z-10 font-orbitron text-[10px] tracking-[0.16em] uppercase font-semibold transition-colors duration-300 ${active ? 'text-vibranium-light drop-shadow-[0_0_8px_rgba(196, 30, 58,0.8)]' : 'text-white/80 group-hover:text-white'}`}>
        {label}
      </span>

      <motion.div
        variants={{ hover: { width: '100%', opacity: 1 } }}
        initial={{ width: '0%', opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 h-px bg-vibranium-light shadow-[0_0_8px_#C41E3A]"
      />

      <motion.div
        variants={{ hover: { width: '100%', opacity: 1 } }}
        initial={{ width: '0%', opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 right-0 h-px bg-vibranium-light shadow-[0_0_8px_#C41E3A]"
      />

      {active && (
        <motion.div
          layoutId="activeNavIndicator"
          className="absolute inset-0 bg-gradient-to-r from-vibranium-darker/90 via-vibranium-dark/70 to-wakanda-darker/80 border border-vibranium/40 shadow-[inset_0_0_20px_rgba(196,30,58,0.3),0_0_24px_rgba(255,215,0,0.15)] rounded-full"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  )
}
