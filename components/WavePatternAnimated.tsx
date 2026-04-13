'use client'
import { useEffect, useRef } from 'react'

interface WavePatternProps {
  stripeWidth?:  number
  // Wave height and amplitude animate between base ± range
  whBase?:       number   // wave height base value
  whRange?:      number   // wave height oscillation range
  whSpeed?:      number   // wave height oscillation speed (rad/sec)
  ampBase?:      number   // amplitude base value
  ampRange?:     number   // amplitude oscillation range
  ampSpeed?:     number   // amplitude oscillation speed (rad/sec)
  scrollSpeed?:  number   // phase scroll speed (rad/sec) — drives vertical flow
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

export default function WavePatternAnimated({
  stripeWidth  = 28,
  whBase       = 70,
  whRange      = 8,
  whSpeed      = 0.40,
  ampBase      = 10,
  ampRange     = 2.5,
  ampSpeed     = 0.27,
  scrollSpeed  = 0.9,
  colorDark    = '#111111',
  colorLight   = '#f0ede6',
  dotSpacing   = 1.8,
  dotRadiusMax = 0.72,
  dotRadiusMin = 0.04,
  jitter       = 1.1,
  repelRadius  = 10,
  repelForce   = 8,
  spring       = 0.06,
  damping      = 0.78,
  className,
  style,
}: WavePatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1

    let W = 0, H = 0, cols = 0, rows = 0
    let ctx: CanvasRenderingContext2D | null = null
    let jx: Float32Array, jy: Float32Array
    let phase = 0, time = 0, prevT = 0
    let rafId = 0

    // Returns 0–1 or -1 depending on stripe membership at the given phase
    const stripeDepth = (px: number, py: number, ph: number, wh: number, amp: number): number => {
      const nc = Math.ceil(W / stripeWidth) + 3
      for (let n = -2; n < nc; n++) {
        if (n % 2 !== 0) continue
        const s  = (2 * Math.PI * py) / wh + n * Math.PI + ph
        const xl = n * stripeWidth + amp * Math.sin(s)
        const xr = (n + 1) * stripeWidth + amp * Math.sin(s + Math.PI)
        if (px >= xl && px <= xr) {
          const half = (xr - xl) / 2
          return half > 0 ? Math.min(px - xl, xr - px) / half : 0
        }
      }
      return -1
    }

    const init = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      if (!W || !H) return

      canvas.width  = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx = canvas.getContext('2d')

      cols = Math.ceil(W / dotSpacing)
      rows = Math.ceil(H / dotSpacing)
      const n = cols * rows

      jx  = new Float32Array(n)
      jy  = new Float32Array(n)

      for (let i = 0; i < n; i++) {
        jx[i] = (Math.random() - 0.5) * 2 * jitter
        jy[i] = (Math.random() - 0.5) * 2 * jitter
      }
    }

    const loop = (t: number) => {
      rafId = requestAnimationFrame(loop)
      if (!ctx) return

      const dt = Math.min((t - prevT) / 1000, 0.05)
      prevT  = t
      time  += dt
      phase += scrollSpeed * dt

      // Animate wave height and amplitude on independent sine cycles
      // Using different speeds ensures the pattern never perfectly repeats
      const wh  = whBase  + whRange  * Math.sin(time * whSpeed)
      const amp = ampBase + ampRange * Math.sin(time * ampSpeed)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = colorLight
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = colorDark
      ctx.beginPath()

      for (let ri = 0; ri < rows; ri++) {
        const gy = dotSpacing / 2 + ri * dotSpacing
        for (let ci = 0; ci < cols; ci++) {
          const idx = ri * cols + ci
          const hx  = dotSpacing / 2 + ci * dotSpacing + jx[idx]
          const hy  = gy + jy[idx]

          const d = stripeDepth(hx, hy, phase, wh, amp)
          if (d < 0) continue

          const x = hx
          const y = hy

          const r = dotRadiusMin + (dotRadiusMax - dotRadiusMin) * Math.pow(d, 0.15)

          ctx.moveTo(x + r, y)
          ctx.arc(x, y, r, 0, Math.PI * 2)
        }
      }

      ctx.fill()
    }

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()
    requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [stripeWidth, whBase, whRange, whSpeed, ampBase, ampRange, ampSpeed,
      scrollSpeed, colorDark, colorLight, dotSpacing, dotRadiusMax, dotRadiusMin,
      jitter])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  )
}
