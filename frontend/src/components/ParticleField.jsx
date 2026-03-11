import React, { useEffect, useRef } from 'react'

const NUM_PARTICLES = 60

export default function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = (canvas.width  = window.innerWidth)
    let H = (canvas.height = window.innerHeight)

    const particles = Array.from({ length: NUM_PARTICLES }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * 0.4,
      vy:    -Math.random() * 0.8 - 0.2,
      r:     Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      hue:   270 + Math.random() * 60,  // purple band
      life:  Math.random(),
    }))

    let rafId
    let frame = 0
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      frame++

      // Draw glowing particle cores using shadowBlur (much cheaper than per-particle radial gradients)
      particles.forEach(p => {
        p.life += 0.003
        if (p.life > 1) {
          p.life = 0
          p.x    = Math.random() * W
          p.y    = H + 10
        }
        p.x += p.vx
        p.y += p.vy
        const alpha = Math.sin(p.life * Math.PI) * p.alpha

        ctx.save()
        ctx.shadowBlur = p.r * 10
        ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, ${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${alpha})`
        ctx.fill()
        ctx.restore()
      })

      // Connect nearby particles (O(n²) — only run on every other frame)
      if (frame % 2 === 0) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 100) {
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.strokeStyle = `rgba(191, 0, 255, ${0.15 * (1 - dist / 100)})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      }

      rafId = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
