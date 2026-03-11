import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { useMousePosition } from '../hooks/useMousePosition'

// â”€â”€ Load frames â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const rawModules = import.meta.glob(
  '../../Assets/hero/*.jpg',
  { eager: true, query: '?url', import: 'default' }
)
const FRAME_URLS = Object.entries(rawModules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url)

const TOTAL_FRAMES = FRAME_URLS.length          // 80

// â”€â”€ How many viewport-heights the scroll section occupies â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 4 Ã— 100vh  â†’  cinematic but gets to content sooner
const SCROLL_VH = 4

export default function HeroCanvas() {
  const sectionRef      = useRef(null)
  const canvasRef       = useRef(null)
  const imagesRef       = useRef([])
  const currentFrameRef = useRef(0)
  const rafRef          = useRef(null)

  const [loadProgress, setLoadProgress] = useState(0)
  const [loaded,       setLoaded]       = useState(false)
  const [frameReady,   setFrameReady]   = useState(false)

  const { normalizedPos } = useMousePosition()

  // â”€â”€ Scroll progress 0â†’1 across the full sticky section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end end'],
  })

  // Smooth the raw scroll value â€” removes jitter and makes motion buttery
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping:   20,
    restDelta: 0.0001,
  })

  // â”€â”€ Derived motions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Frames play from 0 â†’ 100 % of scroll (all 80 frames across the ride)
  const frameProgress = useTransform(smoothProgress, [0, 0.85], [0, 1])
  const progressBarScale = useTransform(frameProgress, [0, 1], [0, 1])

  // Logo / title fades in earlier so users see content while scrolling
  const titleOpacity = useTransform(smoothProgress, [0.18, 0.36], [0, 1])
  const titleY       = useTransform(smoothProgress, [0.18, 0.36], [70, 0])
  const titleScale   = useTransform(smoothProgress, [0.18, 0.36], [0.92, 1])

  // Faint watermark logo while frames play (prevents empty/black feel)
  const watermarkOpacity = useTransform(smoothProgress, [0, 0.25, 0.55, 0.65], [0.22, 0.18, 0.06, 0])
  const watermarkScale   = useTransform(smoothProgress, [0, 0.55], [0.96, 1.04])

  // End hint fades in near the end
  const hintOpacity  = useTransform(smoothProgress, [0.78, 0.90], [0, 1])
  const scrollHintOpacity = useTransform(smoothProgress, [0, 0.10, 0.50], [0, 1, 0])

  // Subtle zoom on the canvas as we scroll (parallax feel)
  const canvasScale  = useTransform(smoothProgress, [0, 1], [1.08, 1])

  // Cinematic letterbox bars (Marvel-style intro framing)
  const barHeight = useTransform(smoothProgress, [0, 0.10, 0.60, 0.72], [0, 52, 52, 0])
  const barOpacity = useTransform(smoothProgress, [0, 0.08, 0.62, 0.76], [0, 1, 1, 0])

  // â”€â”€ Pre-load all frames â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (TOTAL_FRAMES === 0) {
      setLoadProgress(100)
      setLoaded(true)
      setFrameReady(false)
      return
    }

    imagesRef.current = new Array(TOTAL_FRAMES).fill(null)
    let done = 0
    FRAME_URLS.forEach((url, i) => {
      const img  = new Image()
      img.src    = url
      img.onload = () => {
        imagesRef.current[i] = img
        done++
        setFrameReady(true)
        setLoadProgress(Math.round((done / TOTAL_FRAMES) * 100))
        if (done === TOTAL_FRAMES) setLoaded(true)
      }
      img.onerror = () => { done++; if (done === TOTAL_FRAMES) setLoaded(true) }
    })
  }, [])

  // â”€â”€ Canvas draw â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const getLoadedImage = useCallback((index, direction = 1) => {
    if (TOTAL_FRAMES === 0) return null
    const clampedIndex = Math.max(0, Math.min(index, TOTAL_FRAMES - 1))
    const direct = imagesRef.current[clampedIndex]
    if (direct) return direct

    for (let step = 1; step < TOTAL_FRAMES; step++) {
      const next = clampedIndex + step * direction
      if (next >= 0 && next < TOTAL_FRAMES && imagesRef.current[next]) {
        return imagesRef.current[next]
      }
    }

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (imagesRef.current[i]) return imagesRef.current[i]
    }

    return null
  }, [])

  const drawImageCover = useCallback((ctx, img, W, H, mx, my, alpha = 1) => {
    if (!img) return
    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight)
    const sw = img.naturalWidth * scale
    const sh = img.naturalHeight * scale
    const sx = (W - sw) / 2 + mx * 10
    const sy = (H - sh) / 2 + my * 6

    ctx.globalAlpha = alpha
    ctx.drawImage(img, sx, sy, sw, sh)
    ctx.globalAlpha = 1
  }, [])

  const drawFrame = useCallback((progressValue, mx = 0, my = 0) => {
    const canvas = canvasRef.current
    if (!canvas || TOTAL_FRAMES === 0) return

    const ctx = canvas.getContext('2d')
    const W   = canvas.width
    const H   = canvas.height

    const boundedProgress = Math.max(0, Math.min(progressValue, 1))
    const exactIndex = boundedProgress * (TOTAL_FRAMES - 1)
    const lowIndex = Math.floor(exactIndex)
    const highIndex = Math.min(lowIndex + 1, TOTAL_FRAMES - 1)
    const blend = exactIndex - lowIndex

    const lowImg = getLoadedImage(lowIndex, -1)
    const highImg = getLoadedImage(highIndex, 1)
    if (!lowImg && !highImg) return

    ctx.clearRect(0, 0, W, H)
    if (lowImg && highImg && lowImg !== highImg) {
      drawImageCover(ctx, lowImg, W, H, mx, my, 1 - blend)
      drawImageCover(ctx, highImg, W, H, mx, my, blend)
    } else {
      drawImageCover(ctx, lowImg || highImg, W, H, mx, my, 1)
    }

    // Deep vignette â€” cinematic edges, but not crushing blacks
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.9)
    vig.addColorStop(0,   'rgba(0,0,0,0)')
    vig.addColorStop(0.6, 'rgba(3,0,8,0.2)')
    vig.addColorStop(1,   'rgba(5,5,8,0.78)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, W, H)

    // Purple holographic tint (screen blend)
    ctx.globalCompositeOperation = 'screen'
    ctx.globalAlpha = 0.10
    ctx.fillStyle   = '#5a0090'
    ctx.fillRect(0, 0, W, H)

    // Gentle highlight lift (adds punch without changing palette)
    ctx.globalCompositeOperation = 'overlay'
    ctx.globalAlpha = 0.08
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }, [drawImageCover, getLoadedImage])

  // â”€â”€ Drive canvas from scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!loaded) return
    const renderFromProgress = (v) => {
      currentFrameRef.current = v
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() =>
        drawFrame(v, normalizedPos.x, normalizedPos.y)
      )
    }

    renderFromProgress(frameProgress.get())
    const unsub = frameProgress.on('change', renderFromProgress)
    return unsub
  }, [loaded, frameProgress, drawFrame, normalizedPos])

  // â”€â”€ First paint â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (loaded) {
      drawFrame(frameProgress.get(), normalizedPos.x, normalizedPos.y)
    }
  }, [loaded, drawFrame, frameProgress, normalizedPos])

  // â”€â”€ Resize â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const onResize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      drawFrame(currentFrameRef.current, normalizedPos.x, normalizedPos.y)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [drawFrame])

  // â”€â”€ Mouse-parallax redraw â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!loaded) return
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() =>
      drawFrame(currentFrameRef.current, normalizedPos.x, normalizedPos.y)
    )
  }, [normalizedPos, loaded, drawFrame])

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{ height: `${SCROLL_VH * 100}vh` }}
      className="relative"
    >
      {/* â”€â”€ STICKY CINEMATIC VIEWPORT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-wakanda-black">

        {/* Cinematic letterbox bars */}
        <motion.div
          className="pointer-events-none absolute left-0 right-0 top-0 z-[25]"
          style={{ height: barHeight, opacity: barOpacity, background: 'linear-gradient(180deg, rgba(0,0,0,0.92), rgba(0,0,0,0.65))' }}
        />
        <motion.div
          className="pointer-events-none absolute left-0 right-0 bottom-0 z-[25]"
          style={{ height: barHeight, opacity: barOpacity, background: 'linear-gradient(0deg, rgba(0,0,0,0.92), rgba(0,0,0,0.65))' }}
        />

        {/* â”€â”€ LOADING OVERLAY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <AnimatePresence>
          {!loaded && (
            <motion.div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-wakanda-black"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Logo during load */}
              <motion.img
                src="/cystech-logo.png"
                alt="CYSTECH 2K26"
                className="mb-10 holo-flicker"
                style={{
                  width: 'clamp(200px, 30vw, 340px)',
                  filter: 'drop-shadow(0 0 20px rgba(191,0,255,0.7))',
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="font-mono text-vibranium-400 text-xs tracking-[0.5em] mb-5">
                LOADING VIBRANIUM CORE
              </div>
              {/* Progress bar */}
              <div className="w-56 h-px bg-wakanda-border overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-vibranium-700 via-plasma to-vibranium-400"
                  style={{ width: `${loadProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div className="font-mono text-vibranium-600 text-xs mt-3 tracking-widest">
                {loadProgress}%
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ CANVAS (with subtle zoom-out parallax) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full origin-center"
          style={{
            opacity: loaded && frameReady ? 1 : 0,
            scale: canvasScale,
            transition: 'opacity 0.6s ease',
          }}
        />

        {!frameReady && loaded && (
          <div className="absolute inset-0 z-[5] bg-gradient-to-b from-wakanda-black via-[#0a0416] to-wakanda-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(191,0,255,0.16),transparent_48%)]" />
          </div>
        )}

        {/* Cinematic HUD overlays */}
        <div className="pointer-events-none absolute inset-0 z-[12] hero-hud-grid" />
        <div className="pointer-events-none absolute inset-0 z-[13] hero-light-sweep" />

        {/* Always-visible label so the hero never feels empty */}
        <div className="pointer-events-none absolute left-6 top-24 z-[15] select-none">
          <div className="text-[11px] tracking-[0.32em] text-white/60">
            CYSTECH 2K26 â€¢ SYMPOSIUM
          </div>
          <div className="mt-1 font-mono text-[11px] tracking-[0.38em] text-vibranium-400 opacity-80">
            SCROLL TO REVEAL
          </div>
        </div>

        {/* â”€â”€ SCAN LINES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="scanlines-overlay" />

        {/* â”€â”€ MOVING HORIZONTAL GLOW LINE (sweeps topâ†’bottom) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(180deg,transparent 0%,rgba(191,0,255,0.04) 48%,rgba(191,0,255,0.10) 50%,rgba(191,0,255,0.04) 52%,transparent 100%)',
            animation: 'scanLine 8s linear infinite',
          }}
        />

        {/* â”€â”€ MOUSE REACTIVE GLOW SPOT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div
          className="pointer-events-none absolute z-10 rounded-full"
          style={{
            width: 480, height: 480,
            background: 'radial-gradient(circle,rgba(191,0,255,0.10) 0%,transparent 65%)',
            left: `calc(50% + ${normalizedPos.x * 80}px - 240px)`,
            top:  `calc(50% + ${normalizedPos.y * -50}px - 240px)`,
            transition: 'left 0.12s ease, top 0.12s ease',
            filter: 'blur(30px)',
          }}
        />

        {/* Watermark logo while scrolling frames */}
        <motion.div
          className="absolute inset-0 z-[18] flex items-center justify-center pointer-events-none"
          style={{ opacity: watermarkOpacity, scale: watermarkScale }}
        >
          <img
            src="/cystech-logo.png"
            alt=""
            aria-hidden="true"
            className="select-none"
            style={{
              width: 'clamp(220px, 34vw, 420px)',
              filter: 'drop-shadow(0 0 18px rgba(191,0,255,0.55)) drop-shadow(0 0 60px rgba(191,0,255,0.22))',
            }}
          />
        </motion.div>

        {/* â”€â”€ TITLE / LOGO OVERLAY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4"
          style={{ opacity: titleOpacity, y: titleY, scale: titleScale }}
        >
          {/* Dept label */}
          <div className="font-mono text-vibranium-400 text-xs tracking-[0.5em] mb-8">
            [ DEPARTMENT OF COMPUTER SCIENCE ]
          </div>

          {/* Logo container â€” glow + glitch clone */}
          <div className="relative flex items-center justify-center">
            {/* Radial glow behind logo */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: '130%', height: '130%',
                background:
                  'radial-gradient(ellipse,rgba(191,0,255,0.22) 0%,transparent 65%)',
                filter: 'blur(32px)',
                animation: 'pulseSlow 3s ease-in-out infinite',
              }}
            />
            {/* Chromatic-aberration ghost */}
            <img
              src="/cystech-logo.png"
              alt=""
              aria-hidden="true"
              className="absolute select-none pointer-events-none"
              style={{
                width: 'clamp(280px, 46vw, 560px)',
                opacity: 0.15,
                transform: 'translate(5px,-4px)',
                filter: 'hue-rotate(40deg) blur(3px)',
              }}
            />
            {/* Main logo */}
            <img
              src="/cystech-logo.png"
              alt="CYSTECH 2K26"
              className="relative z-10 holo-flicker select-none"
              style={{
                width: 'clamp(280px, 46vw, 560px)',
                filter:
                  'drop-shadow(0 0 24px rgba(191,0,255,0.95)) drop-shadow(0 0 60px rgba(191,0,255,0.55)) drop-shadow(0 0 110px rgba(147,51,234,0.35))',
                animation: 'float 7s ease-in-out infinite',
              }}
            />
          </div>

          {/* Tag line */}
          <motion.p
            className="mt-5 font-rajdhani text-white/55 text-lg md:text-xl tracking-[0.35em] uppercase"
            style={{ opacity: titleOpacity }}
          >
            Technology Symposium
          </motion.p>

          {/* Floor projection circles (mirror logo ground ring) */}
          <div
            className="relative mt-5 flex items-center justify-center"
            style={{ width: 'clamp(240px, 38vw, 460px)', height: 36 }}
          >
            {[1, 0.7, 0.42].map((s, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-vibranium-600"
                style={{
                  width:   `${s * 100}%`,
                  height:  `${s * 20}px`,
                  opacity: 0.38 - i * 0.08,
                  boxShadow: `0 0 ${8 - i * 2}px rgba(191,0,255,0.45)`,
                  animation: `energyRing ${3.5 + i * 1.2}s linear infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
            <div className="w-1.5 h-1.5 rounded-full bg-plasma shadow-[0_0_10px_#bf00ff] z-10" />
          </div>

          {/* Date badge */}
          <div className="mt-7 px-6 py-2 border border-vibranium-700/50 font-mono text-xs text-vibranium-400 tracking-[0.35em]">
            MARCH 2026 · WAKANDA INSTITUTE OF TECHNOLOGY
          </div>
        </motion.div>

        {/* â”€â”€ HUD CORNERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {loaded && <HUDCorners />}

        {/* â”€â”€ SCROLL INDICATOR (visible while title is not yet shown) â”€â”€ */}
        <AnimatePresence>
          {loaded && (
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ opacity: scrollHintOpacity }}
            >
              <span className="font-mono text-vibranium-500 text-xs tracking-[0.4em]">
                SCROLL TO REVEAL
              </span>
              <motion.div
                className="w-px h-10 bg-gradient-to-b from-vibranium-500 to-transparent"
                animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ "CONTINUE" HINT at bottom of scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
          style={{ opacity: hintOpacity }}
        >
          <span className="font-mono text-vibranium-400 text-xs tracking-[0.4em]">
            EXPLORE CYSTECH
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-vibranium-500 text-lg"
          >
            ↓
          </motion.div>
        </motion.div>

        {/* Scroll progress bar */}
        {loaded && (
          <div className="absolute left-0 right-0 bottom-0 z-[26] h-px bg-wakanda-border/60">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-vibranium-700 via-plasma to-vibranium-400"
              style={{ scaleX: progressBarScale }}
            />
          </div>
        )}
      </div>
    </section>
  )
}

// â”€â”€ HUD corner decorations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HUDCorners() {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* TL */}
      <div className="absolute top-20 left-6 flex flex-col gap-1">
        <div className="w-8 h-px bg-vibranium-500 shadow-[0_0_6px_#9333ea]" />
        <div className="w-px h-8 bg-vibranium-500 shadow-[0_0_6px_#9333ea]" />
      </div>
      {/* TR */}
      <div className="absolute top-20 right-6 flex flex-col items-end gap-1">
        <div className="w-8 h-px bg-vibranium-500 shadow-[0_0_6px_#9333ea]" />
        <div className="w-px h-8 bg-vibranium-500 self-end shadow-[0_0_6px_#9333ea]" />
      </div>
      {/* BL */}
      <div className="absolute bottom-8 left-6 flex flex-col justify-end gap-1">
        <div className="w-px h-8 bg-vibranium-500 shadow-[0_0_6px_#9333ea]" />
        <div className="w-8 h-px bg-vibranium-500 shadow-[0_0_6px_#9333ea]" />
      </div>
      {/* BR */}
      <div className="absolute bottom-8 right-6 flex flex-col items-end justify-end gap-1">
        <div className="w-px h-8 bg-vibranium-500 self-end shadow-[0_0_6px_#9333ea]" />
        <div className="w-8 h-px bg-vibranium-500 shadow-[0_0_6px_#9333ea]" />
      </div>
      <div className="absolute bottom-8 right-6 font-mono text-vibranium-600 text-xs tracking-widest opacity-55">
        VIBRANIUM CORE · ONLINE
      </div>
      <div className="absolute top-20 left-1/2 -translate-x-1/2 font-mono text-vibranium-600 text-xs tracking-[0.4em] opacity-45">
        CYSTECH://SYMPOSIUM/2K26
      </div>
    </div>
  )
}
