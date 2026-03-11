import React from 'react';

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/* ─── Static trace paths (edges + corners of viewport) ─────────────────── */
const STATIC_TRACES = [
  // ── Left edge cluster ──
  { d: 'M 0 160 H 90 V 290 H 170 V 380 H 90 V 490 H 0',         c: '#9D00FF' },
  { d: 'M 170 290 H 250 V 230 H 320',                             c: '#9D00FF' },
  { d: 'M 90 490 V 570 H 0',                                      c: '#00f0ff' },
  { d: 'M 0 380 H 50',                                            c: '#00f0ff' },
  { d: 'M 320 230 H 380 V 200',                                   c: '#9D00FF' },

  // ── Top edge cluster ──
  { d: 'M 360 0 V 75 H 510 V 28 H 670 V 75 H 820 V 0',           c: '#00f0ff' },
  { d: 'M 510 75 V 130 H 430 V 170',                              c: '#9D00FF' },
  { d: 'M 670 75 V 130 H 750 V 100',                              c: '#00f0ff' },
  { d: 'M 510 28 V 0',                                            c: '#9D00FF' },
  { d: 'M 670 28 V 0',                                            c: '#9D00FF' },

  // ── Right edge cluster ──
  { d: 'M 1440 185 H 1350 V 315 H 1270 V 445 H 1350 V 575 H 1440', c: '#9D00FF' },
  { d: 'M 1270 315 H 1195 V 265 H 1130',                          c: '#00f0ff' },
  { d: 'M 1270 445 H 1185 V 495',                                  c: '#9D00FF' },
  { d: 'M 1350 315 H 1440',                                        c: '#00f0ff' },

  // ── Bottom-left cluster ──
  { d: 'M 270 900 V 825 H 390 V 760 H 525 V 825 H 710 V 900',    c: '#00f0ff' },
  { d: 'M 390 760 H 450 V 715 H 555',                             c: '#9D00FF' },
  { d: 'M 270 825 H 200 V 860',                                   c: '#9D00FF' },

  // ── Bottom-right cluster ──
  { d: 'M 910 900 V 840 H 1030 V 778 H 1130 V 840 H 1210 V 900', c: '#9D00FF' },
  { d: 'M 1030 778 H 1085 V 735 H 1210 V 755',                   c: '#00f0ff' },
  { d: 'M 910 840 H 850 V 870',                                   c: '#00f0ff' },
];

/* ─── Animated signal paths ─────────────────────────────────────────────── */
const SIGNAL_TRACES = [
  { d: 'M 0 160 H 90 V 290 H 170 V 380 H 90 V 490 H 0',          dur: '6s',   begin: '0s',    c: '#9D00FF' },
  { d: 'M 360 0 V 75 H 510 V 28 H 670 V 75 H 820 V 0',           dur: '5.5s', begin: '1.2s',  c: '#00f0ff' },
  { d: 'M 1440 185 H 1350 V 315 H 1270 V 445 H 1350 V 575 H 1440', dur: '7s', begin: '0.6s',  c: '#9D00FF' },
  { d: 'M 270 900 V 825 H 390 V 760 H 525 V 825 H 710 V 900',    dur: '5s',   begin: '2.0s',  c: '#00f0ff' },
  { d: 'M 910 900 V 840 H 1030 V 778 H 1130 V 840 H 1210 V 900', dur: '4.8s', begin: '1.5s',  c: '#B44FFF' },
];

/* ─── Junction node dots (every corner / bend) ─────────────────────────── */
const NODES = [
  // Left
  [90, 160], [90, 290], [170, 290], [170, 380], [90, 380], [90, 490],
  [250, 230], [320, 230], [380, 200], [90, 570],
  // Top
  [360, 75], [510, 75], [510, 28], [670, 28], [670, 75], [820, 75],
  [510, 130], [430, 130], [430, 170], [670, 130], [750, 130], [750, 100],
  // Right
  [1350, 185], [1350, 315], [1270, 315], [1270, 445], [1350, 445], [1350, 575],
  [1195, 265], [1130, 265], [1185, 445], [1185, 495],
  // Bottom-left
  [270, 825], [390, 825], [390, 760], [525, 760], [525, 825], [710, 825],
  [450, 760], [450, 715], [555, 715], [200, 825],
  // Bottom-right
  [910, 840], [1030, 840], [1030, 778], [1130, 778], [1130, 840], [1210, 840],
  [1085, 778], [1085, 735], [1210, 755], [850, 840],
];

/* ─── Small IC pads at trace endpoints ──────────────────────────────────── */
const PADS = [
  // Left edge gates
  [0, 156], [0, 376], [0, 568],
  // Top edge gates
  [357, 0], [507, 0], [667, 0], [817, 0],
  // Right edge gates
  [1436, 182], [1436, 572],
  // Bottom-left gates
  [267, 897], [707, 897], [197, 857],
  // Bottom-right gates
  [907, 897], [1207, 897], [847, 867],
];

export default function CircuitBoard() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1, opacity: 0.18 }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle glow on nodes */}
          <filter id="cb-node-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Stronger glow for traveling signal dot */}
          <filter id="cb-signal-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Base traces ──────────────────────────────────────────── */}
        {STATIC_TRACES.map((t, i) => (
          <path
            key={i}
            d={t.d}
            stroke={t.c}
            strokeWidth={1}
            strokeLinecap="square"
            fill="none"
            opacity={0.55}
          />
        ))}

        {/* ── Junction nodes ───────────────────────────────────────── */}
        {NODES.map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={2.8}
            fill={i % 3 === 0 ? '#00f0ff' : '#9D00FF'}
            opacity={0.9}
            filter="url(#cb-node-glow)"
          />
        ))}

        {/* ── IC pad rectangles at endpoints ───────────────────────── */}
        {PADS.map(([x, y], i) => (
          <rect
            key={i}
            x={x} y={y}
            width={4} height={4}
            fill={i % 2 === 0 ? '#9D00FF' : '#00f0ff'}
            opacity={0.75}
          />
        ))}

        {/* ── Animated signal pulses (desktop only) ────────────────── */}
        {!isTouch && SIGNAL_TRACES.map((t, i) => (
          <circle key={i} r={3.5} fill={t.c} opacity={1} filter="url(#cb-signal-glow)">
            <animateMotion
              dur={t.dur}
              begin={t.begin}
              repeatCount="indefinite"
              path={t.d}
              calcMode="linear"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}
