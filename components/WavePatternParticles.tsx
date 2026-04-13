'use client'
import { useEffect, useRef } from 'react'

interface WavePatternParticlesProps {
  stripeWidth?:  number
  waveHeight?:   number
  amplitude?:    number
  colorDark?:    string
  colorLight?:   string
  dotSpacing?:   number
  dotRadiusMax?: number
  dotRadiusMin?: number
  jitter?:       number
  repelRadius?:  number
  repelForce?:   number
  spring?:       number
  damping?:      number
  className?:    string
  style?:        React.CSSProperties
}

interface Particle {
  hx: number; hy: number
  x:  number; y:  number
  vx: number; vy: number
  r:  number
  a:  number  // alpha 0–1 based on stripe depth
}

export default function WavePatternParticles({
  stripeWidth  = 80,
  waveHeight   = 225,
  amplitude    = 29,
  colorDark    = '#111111',
  colorLight   = '#f0ede6',
  dotSpacing   = 2,
  dotRadiusMax = 0.72,
  dotRadiusMin = 0.04,
  jitter       = 1.2,
  repelRadius  = 10,
  repelForce   = 8,
  spring       = 0.06,
  damping      = 0.78,
  className,
  style,
}: WavePatternParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef  = useRef({
    particles: [] as Particle[],
    cursorX:   null as number | null,
    cursorY:   null as number | null,
    W: 0, H: 0,
    rafId: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const s   = stateRef.current

    const getStripeDepth = (px: number, py: number, W: number): number => {
      const cols = Math.ceil(W / stripeWidth) + 3
      for (let n = -2; n < cols; n++) {
        if (n % 2 !== 0) continue
        const xl = n * stripeWidth + amplitude * Math.sin((2 * Math.PI * py) / waveHeight + n * Math.PI)
        const xr = (n + 1) * stripeWidth + amplitude * Math.sin((2 * Math.PI * py) / waveHeight + (n + 1) * Math.PI)
        if (px >= xl && px <= xr) {
          const half = (xr - xl) / 2
          return half > 0 ? Math.min(px - xl, xr - px) / half : 0
        }
      }
      return -1
    }

    const init = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      if (!W || !H) return

      canvas.width  = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      s.W = W; s.H = H
      s.particles = []

      for (let py = dotSpacing / 2; py < H; py += dotSpacing) {
        for (let px = dotSpacing / 2; px < W; px += dotSpacing) {
          const depth = getStripeDepth(px, py, W)
          if (depth < 0) continue

          const jx = px + (Math.random() - 0.5) * 2 * jitter
          const jy = py + (Math.random() - 0.5) * 2 * jitter
          const r = dotRadiusMin + (dotRadiusMax - dotRadiusMin) * Math.pow(depth, 0.3)
          const a = Math.pow(depth, 0.7)  // gradient: opaque at center, fades at edges

          s.particles.push({ hx: jx, hy: jy, x: jx, y: jy, vx: 0, vy: 0, r, a })
        }
      }
    }

    const ctx = canvas.getContext('2d')!

    const loop = () => {
      s.rafId = requestAnimationFrame(loop)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      for (const p of s.particles) {
        let fx = (p.hx - p.x) * spring
        let fy = (p.hy - p.y) * spring

        if (s.cursorX !== null && s.cursorY !== null) {
          const dx   = p.x - s.cursorX
          const dy   = p.y - s.cursorY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < repelRadius) {
            const f = (1 - dist / repelRadius) * repelForce
            fx += (dx / (dist + 0.1)) * f
            fy += (dy / (dist + 0.1)) * f
          }
        }

        p.vx = (p.vx + fx) * damping
        p.vy = (p.vy + fy) * damping
        p.x += p.vx
        p.y += p.vy
      }

      ctx.fillStyle = colorLight
      ctx.fillRect(0, 0, s.W, s.H)

      // Group particles into alpha buckets for efficient batched drawing
      const BUCKETS = 8
      const buckets: Path2D[] = Array.from({ length: BUCKETS }, () => new Path2D())
      for (const p of s.particles) {
        const bi = Math.min(BUCKETS - 1, Math.floor(p.a * BUCKETS))
        buckets[bi].moveTo(p.x + p.r, p.y)
        buckets[bi].arc(p.x, p.y, p.r, 0, Math.PI * 2)
      }
      for (let i = 0; i < BUCKETS; i++) {
        ctx.globalAlpha = (i + 0.5) / BUCKETS
        ctx.fillStyle = colorDark
        ctx.fill(buckets[i])
      }
      ctx.globalAlpha = 1
    }

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      s.cursorX = e.clientX - r.left
      s.cursorY = e.clientY - r.top
    }
    const onMouseLeave = () => { s.cursorX = null; s.cursorY = null }

    canvas.addEventListener('mousemove',  onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()
    loop()

    return () => {
      cancelAnimationFrame(s.rafId)
      canvas.removeEventListener('mousemove',  onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      ro.disconnect()
    }
  }, [stripeWidth, waveHeight, amplitude, colorDark, colorLight,
      dotSpacing, dotRadiusMax, dotRadiusMin, jitter,
      repelRadius, repelForce, spring, damping])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair', ...style }}
    />
  )
}
