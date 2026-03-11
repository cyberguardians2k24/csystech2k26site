import { useState, useEffect } from 'react'

export function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref?.current
    if (!el) return

    let cleanup = null
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Remove any previously attached scroll handler
        if (cleanup) { cleanup(); cleanup = null; }
        if (!entry.isIntersecting) return
        const handleScroll = () => {
          const rect = el.getBoundingClientRect()
          const scrolled = -rect.top
          const total = rect.height - window.innerHeight
          const p = Math.min(Math.max(scrolled / total, 0), 1)
          setProgress(p)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        cleanup = () => window.removeEventListener('scroll', handleScroll)
      },
      { threshold: 0 }
    )
    observer.observe(el)
    return () => { observer.disconnect(); if (cleanup) cleanup(); }
  }, [ref])

  return progress
}

export function useWindowScroll() {
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollY(y)
      setScrollProgress(docHeight > 0 ? y / docHeight : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { scrollY, scrollProgress }
}
