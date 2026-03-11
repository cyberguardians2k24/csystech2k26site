import { useState, useEffect, useCallback } from 'react'

export function useMousePosition() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [normalizedPos, setNormalizedPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    const x = e.clientX
    const y = e.clientY
    setMousePos({ x, y })
    setNormalizedPos({
      x: (x / window.innerWidth - 0.5) * 2,
      y: -(y / window.innerHeight - 0.5) * 2,
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return { mousePos, normalizedPos }
}
