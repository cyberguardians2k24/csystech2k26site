import React from 'react'

export default function ScanLines({ opacity = 0.06, grain = 0.12, vignette = 0.55 }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Scanlines */}
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,${opacity}) 2px,
            rgba(0,0,0,${opacity}) 4px
          )`,
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 grain-overlay"
        style={{ opacity: grain }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 vignette-overlay"
        style={{ opacity: vignette }}
      />
    </div>
  )
}
