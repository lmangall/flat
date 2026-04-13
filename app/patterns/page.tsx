'use client'
import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

const WavePatternSolid = dynamic(() => import('@/components/WavePatternSolid'), { ssr: false })
const WavePatternParticles = dynamic(() => import('@/components/WavePatternParticles'), { ssr: false })
const WavePatternAnimated = dynamic(() => import('@/components/WavePatternAnimated'), { ssr: false })
const WavePatternSolidAnimated = dynamic(() => import('@/components/WavePatternSolidAnimated'), { ssr: false })
const WavePatternRings = dynamic(() => import('@/components/WavePatternRings'), { ssr: false })
const WavePatternBrick = dynamic(() => import('@/components/WavePatternBrick'), { ssr: false })
const WavePatternSunburst = dynamic(() => import('@/components/WavePatternSunburst'), { ssr: false })
const WavePatternScallop = dynamic(() => import('@/components/WavePatternScallop'), { ssr: false })

/* ------------------------------------------------------------------ */
/*  Pattern config: metadata + default props + slider definitions      */
/* ------------------------------------------------------------------ */

interface SliderDef {
  key: string
  label: string
  min: number
  max: number
  step: number
}

interface PatternConfig {
  id: string
  title: string
  subtitle: string
  description: string
  tag: string
  defaults: Record<string, number | string | boolean>
  sliders: SliderDef[]
}

const patterns: PatternConfig[] = [
  {
    id: 'particles',
    title: 'Particle Stipple',
    subtitle: 'v2 — Spring Physics',
    description: 'Thousands of dots with halftone gradient and spring-driven cursor repulsion. Each dot bounces back home.',
    tag: 'halftone',
    defaults: {
      stripeWidth: 40, waveHeight: 120, amplitude: 16,
      dotSpacing: 3.5, dotRadiusMax: 1.2, dotRadiusMin: 0.04,
      jitter: 1.2, repelRadius: 25, repelForce: 12,
      spring: 0.06, damping: 0.78,
      colorDark: '#111111', colorLight: '#f0ede6',
    },
    sliders: [
      { key: 'stripeWidth',  label: 'Stripe Width',  min: 20,   max: 200,  step: 2 },
      { key: 'waveHeight',   label: 'Wave Height',   min: 50,   max: 400,  step: 5 },
      { key: 'amplitude',    label: 'Amplitude',     min: 2,    max: 80,   step: 1 },
      { key: 'dotSpacing',   label: 'Dot Spacing',   min: 1,    max: 6,    step: 0.1 },
      { key: 'jitter',       label: 'Jitter',        min: 0,    max: 3,    step: 0.1 },
      { key: 'repelRadius',  label: 'Repel Radius',  min: 3,    max: 60,   step: 1 },
      { key: 'repelForce',   label: 'Repel Force',   min: 1,    max: 30,   step: 0.5 },
      { key: 'spring',       label: 'Spring',        min: 0.01, max: 0.2,  step: 0.005 },
      { key: 'damping',      label: 'Damping',       min: 0.5,  max: 0.98, step: 0.01 },
    ],
  },
  {
    id: 'solid',
    title: 'Solid Stripes',
    subtitle: 'v1 — Direct Canvas Fill',
    description: 'Sine-wave boundaries with Gaussian cursor ripple. Move your cursor to push the stripes apart.',
    tag: 'cursor warp',
    defaults: {
      stripeWidth: 24, waveHeight: 36, amplitude: 10,
      rippleRadius: 35, rippleStrength: 40,
      colorDark: '#111111', colorLight: '#f0ede6',
    },
    sliders: [
      { key: 'stripeWidth',    label: 'Stripe Width',    min: 20,  max: 200, step: 2 },
      { key: 'waveHeight',     label: 'Wave Height',     min: 30,  max: 300, step: 2 },
      { key: 'amplitude',      label: 'Amplitude',       min: 2,   max: 80,  step: 1 },
      { key: 'rippleRadius',   label: 'Ripple Radius',   min: 5,   max: 100, step: 1 },
      { key: 'rippleStrength', label: 'Ripple Strength', min: 5,   max: 150, step: 1 },
    ],
  },
  {
    id: 'animated',
    title: 'Breathing Grid',
    subtitle: 'v3 — Float32Array + Phase Animation',
    description: 'The wave pattern breathes and scrolls continuously. Wave height and amplitude oscillate on independent cycles that never repeat.',
    tag: 'animated',
    defaults: {
      stripeWidth: 28, whBase: 70, whRange: 8, whSpeed: 0.4,
      ampBase: 10, ampRange: 2.5, ampSpeed: 0.27,
      scrollSpeed: 0.9, dotSpacing: 6,
      dotRadiusMax: 2.2, dotRadiusMin: 0.3,
      jitter: 1.1, repelRadius: 10, repelForce: 8,
      spring: 0.06, damping: 0.78,
      colorDark: '#111111', colorLight: '#f0ede6',
    },
    sliders: [
      { key: 'stripeWidth',  label: 'Stripe Width',    min: 10,   max: 80,   step: 1 },
      { key: 'whBase',       label: 'Wave Height',     min: 20,   max: 200,  step: 2 },
      { key: 'whRange',      label: 'WH Breathe',      min: 0,    max: 40,   step: 1 },
      { key: 'whSpeed',      label: 'WH Speed',        min: 0.05, max: 2,    step: 0.05 },
      { key: 'ampBase',      label: 'Amplitude',       min: 2,    max: 30,   step: 0.5 },
      { key: 'ampRange',     label: 'Amp Breathe',      min: 0,    max: 10,   step: 0.5 },
      { key: 'scrollSpeed',  label: 'Scroll Speed',    min: 0,    max: 3,    step: 0.1 },
      { key: 'dotSpacing',   label: 'Dot Spacing',     min: 1.2,  max: 5,    step: 0.1 },
      { key: 'repelRadius',  label: 'Repel Radius',    min: 3,    max: 60,   step: 1 },
    ],
  },
  {
    id: 'solid-animated',
    title: 'Living Stripes',
    subtitle: 'v4 — Animated Solid Fill',
    description: 'The solid stripe pattern comes alive with a continuous phase animation. No interaction — just watch the waves flow.',
    tag: 'animated',
    defaults: {
      stripeWidth: 24, waveHeight: 36, amplitude: 10,
      speed: 0.8,
      colorDark: '#111111', colorLight: '#f0ede6',
    },
    sliders: [
      { key: 'stripeWidth',  label: 'Stripe Width',  min: 10,  max: 60,  step: 1 },
      { key: 'waveHeight',   label: 'Wave Height',   min: 15,  max: 100, step: 1 },
      { key: 'amplitude',    label: 'Amplitude',     min: 2,   max: 30,  step: 0.5 },
      { key: 'speed',        label: 'Speed',         min: 0.1, max: 3,   step: 0.1 },
    ],
  },
  {
    id: 'rings',
    title: 'Spinning Rings',
    subtitle: 'v5 — Rotating Dot Rings',
    description: 'The coloured rings from the hero pattern, isolated and slowly spinning. No interaction — pure motion.',
    tag: 'kinetic',
    defaults: {
      dotSpacing: 3, dotRadius: 1.3,
      ring1Width: 8, ring1Gap: 3, ring1Color: '#F5C842',
      ring2Width: 14, ring2Gap: 4, ring2Color: '#E8457A',
      circleRadius: 0.42, speed: 0.15,
      colorLight: '#f0ede6',
    },
    sliders: [
      { key: 'speed',        label: 'Speed',       min: 0.02, max: 0.5,  step: 0.01 },
      { key: 'circleRadius', label: 'Size',        min: 0.2,  max: 0.48, step: 0.01 },
      { key: 'ring1Width',   label: 'Inner Ring',   min: 2,    max: 20,   step: 1 },
      { key: 'ring2Width',   label: 'Outer Ring',   min: 4,    max: 30,   step: 1 },
    ],
  },
  {
    id: 'brick',
    title: 'Brick Shift',
    subtitle: 'v6 — Staggered Parallelogram',
    description: 'Horizontal bands of skewed stripes — each band shifts by one stripe width so parallelogram corners meet. Cursor repels the dots.',
    tag: 'geometric',
    defaults: {
      stripeWidth: 40, bandHeight: 95, offset: 0.4,
      dotSpacing: 3.5, dotRadiusMax: 1.6, dotRadiusMin: 0.05,
      jitter: 1.0, repelRadius: 35, repelForce: 10,
      spring: 0.06, damping: 0.78,
      colorDark: '#5cb870', colorLight: '#f0ede6',
    },
    sliders: [
      { key: 'stripeWidth',  label: 'Stripe Width',  min: 2,   max: 120, step: 1 },
      { key: 'bandHeight',   label: 'Band Height',   min: 3,   max: 150, step: 1 },
      { key: 'offset',       label: 'Skew',          min: 0.1, max: 1,   step: 0.05 },
      { key: 'repelRadius',  label: 'Repel Radius',  min: 5,   max: 60,  step: 1 },
    ],
  },
  {
    id: 'sunburst',
    title: 'Sunburst Oval',
    subtitle: 'v7 — Radial Checkerboard',
    description: 'A radial checkerboard pattern inside an oval with a pill-shaped center cutout. Slowly rotates like a hypnotic target.',
    tag: 'geometric',
    defaults: {
      segments: 16, rings: 2,
      color1: '#c22040', color2: '#f0a0b8',
      pillColor: '#f0ede6', pillWidth: 0.18, pillHeight: 0.42,
      speed: 0.08,
    },
    sliders: [
      { key: 'segments',   label: 'Segments',    min: 6,    max: 32,   step: 2 },
      { key: 'rings',      label: 'Rings',       min: 2,    max: 10,   step: 1 },
      { key: 'pillWidth',  label: 'Pill Width',  min: 0.04, max: 0.3,  step: 0.01 },
      { key: 'pillHeight', label: 'Pill Height', min: 0.1,  max: 0.5,  step: 0.01 },
      { key: 'speed',      label: 'Speed',       min: 0,    max: 0.5,  step: 0.01 },
    ],
  },
  {
    id: 'scallop',
    title: 'Scalloped Oval',
    subtitle: 'v8 — Concentric Scallop',
    description: 'Concentric ovals with a scalloped pink border, cream bands, and green rings. The whole shape rotates slowly like a vintage cameo.',
    tag: 'geometric',
    defaults: {
      scallops: 16, scallopSize: 0.22,
      ovalWidth: 0.34, ovalHeight: 0.44,
      creamGap: 0.14, greenWidth: 0.35, greenStroke: 3,
      speed: 0.06,
      colorScallop: '#d4899e', colorCream: '#f0ede6',
      colorGreen: '#498c3a', colorGreenDark: '#2d6b28',
    },
    sliders: [
      { key: 'scallops',    label: 'Scallops',      min: 8,    max: 28,   step: 1 },
      { key: 'scallopSize', label: 'Scallop Size',   min: 0.08, max: 0.4,  step: 0.01 },
      { key: 'creamGap',    label: 'Cream Band',     min: 0.02, max: 0.3,  step: 0.01 },
      { key: 'greenWidth',  label: 'Green Ring',     min: 0.1,  max: 0.5,  step: 0.01 },
      { key: 'greenStroke', label: 'Green Border',   min: 1,    max: 8,    step: 0.5 },
      { key: 'speed',       label: 'Speed',          min: 0,    max: 0.3,  step: 0.01 },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Slider component                                                    */
/* ------------------------------------------------------------------ */

function Slider({ def, value, onChange }: { def: SliderDef; value: number; onChange: (v: number) => void }) {
  const pct = ((value - def.min) / (def.max - def.min)) * 100
  return (
    <label className="group flex flex-col gap-1">
      <span className="flex justify-between text-[11px] font-medium tracking-wide uppercase text-white/50 group-hover:text-white/70 transition-colors">
        <span>{def.label}</span>
        <span className="tabular-nums font-mono text-white/80">{value}</span>
      </span>
      <input
        type="range"
        min={def.min}
        max={def.max}
        step={def.step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                   [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(255,255,255,0.4)]
                   [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125
                   [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3
                   [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
                   [&::-moz-range-thumb]:border-0"
        style={{
          background: `linear-gradient(to right, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.5) ${pct}%, rgba(255,255,255,0.12) ${pct}%, rgba(255,255,255,0.12) 100%)`,
        }}
      />
    </label>
  )
}

/* ------------------------------------------------------------------ */
/*  Pattern section                                                     */
/* ------------------------------------------------------------------ */

function PatternSection({ config, index, isActive }: { config: PatternConfig; index: number; isActive: boolean }) {
  const [params, setParams] = useState<Record<string, number | string | boolean>>(config.defaults)
  const [showControls, setShowControls] = useState(false)

  const updateParam = useCallback((key: string, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetParams = useCallback(() => {
    setParams(config.defaults)
  }, [config.defaults])

  const renderPattern = () => {
    if (!isActive) return null
    switch (config.id) {
      case 'solid':
        return <WavePatternSolid {...params as any} />
      case 'particles':
        return <WavePatternParticles {...params as any} />
      case 'animated':
        return <WavePatternAnimated {...params as any} />
      case 'solid-animated':
        return <WavePatternSolidAnimated {...params as any} />
      case 'rings':
        return <WavePatternRings {...params as any} />
      case 'brick':
        return <WavePatternBrick {...params as any} />
      case 'sunburst':
        return <WavePatternSunburst {...params as any} />
      case 'scallop':
        return <WavePatternScallop {...params as any} />
    }
  }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-night flex items-center justify-center">
      {/* Canvas — capped at 500px */}
      <div
        className="relative w-[min(500px,80vw)] h-[min(500px,80vh)] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10"
        style={config.id === 'solid-animated' ? { transform: 'rotate(90deg)' } : undefined}
      >
        {renderPattern()}
      </div>

      {/* Info overlay */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-widest bg-white/15 text-white/80 border border-white/10">
            {config.tag}
          </span>
          <span className="text-white/40 text-xs font-mono">
            {String(index + 1).padStart(2, '0')} / {String(patterns.length).padStart(2, '0')}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display text-white tracking-tight">
          {config.title}
        </h2>
        <p className="mt-1 text-sm font-mono text-white/60 tracking-wide">
          {config.subtitle}
        </p>
        <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-sm">
          {config.description}
        </p>
      </div>

      {/* Controls toggle */}
      <button
        onClick={() => setShowControls(v => !v)}
        className="absolute top-8 right-8 md:top-12 md:right-12 z-20
                   w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20
                   flex items-center justify-center
                   hover:bg-white/20 transition-all text-white/70 hover:text-white"
        aria-label={showControls ? 'Hide controls' : 'Show controls'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {showControls ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </>
          )}
        </svg>
      </button>

      {/* Controls panel */}
      {showControls && (
        <div className="absolute top-20 right-8 md:top-24 md:right-12 z-20
                       w-72 max-h-[calc(100vh-8rem)] overflow-y-auto
                       rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-white/60">Parameters</h3>
            <button onClick={resetParams} className="text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors">
              Reset
            </button>
          </div>
          {config.sliders.map(s => (
            <Slider key={s.key} def={s} value={params[s.key] as number} onChange={v => updateParam(s.key, v)} />
          ))}
        </div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page                                                           */
/* ------------------------------------------------------------------ */

export default function PatternsPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const config = patterns[activeIndex]

  const prev = () => setActiveIndex(i => Math.max(0, i - 1))
  const next = () => setActiveIndex(i => Math.min(patterns.length - 1, i + 1))

  return (
    <div className="fixed inset-0 bg-night">
      {/* Active pattern — only one mounted at a time */}
      <PatternSection key={config.id} config={config} index={activeIndex} isActive />

      {/* Prev / Next buttons */}
      {activeIndex > 0 && (
        <button
          onClick={prev}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full
                     bg-white/10 backdrop-blur-md border border-white/20
                     flex items-center justify-center
                     hover:bg-white/20 transition-all text-white/70 hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      )}
      {activeIndex < patterns.length - 1 && (
        <button
          onClick={next}
          className="fixed right-14 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full
                     bg-white/10 backdrop-blur-md border border-white/20
                     flex items-center justify-center
                     hover:bg-white/20 transition-all text-white/70 hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}

      {/* Navigation dots */}
      <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3">
        {patterns.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActiveIndex(i)}
            className="group relative flex items-center justify-center"
            aria-label={`Go to ${p.title}`}
          >
            <span
              className="absolute right-6 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-mono
                         bg-black/60 text-white/70 backdrop-blur-sm
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         pointer-events-none"
            >
              {p.title}
            </span>
            <span
              className="block rounded-full transition-all duration-500"
              style={{
                width:  activeIndex === i ? 8 : 5,
                height: activeIndex === i ? 8 : 5,
                background: activeIndex === i ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                boxShadow: activeIndex === i ? '0 0 8px rgba(255,255,255,0.4)' : 'none',
              }}
            />
          </button>
        ))}
      </nav>
    </div>
  )
}
