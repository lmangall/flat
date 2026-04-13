'use client'
import { useEffect, useRef } from 'react'

interface Props {
  stripeWidth?:  number
  bandHeight?:   number
  offset?:       number
  dotSpacing?:   number
  dotRadiusMax?: number
  dotRadiusMin?: number
  jitter?:       number
  repelRadius?:  number
  repelForce?:   number
  spring?:       number
  damping?:      number
  colorDark?:    string
  colorLight?:   string
  className?:    string
  style?:        React.CSSProperties
}

interface Particle {
  hx: number; hy: number
  x:  number; y:  number
  vx: number; vy: number
  r:  number
  a:  number
  dark: boolean
}

export default function WavePatternBrick({
  stripeWidth  = 4,
  bandHeight   = 6,
  offset       = 0.5,
  dotSpacing   = 3,
  dotRadiusMax = 0.9,
  dotRadiusMin = 0.03,
  jitter       = 1.0,
  repelRadius  = 35,
  repelForce   = 10,
  spring       = 0.06,
  damping      = 0.78,
  colorDark    = '#5cb870',
  colorLight   = '#f0ede6',
  className,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef  = useRef({
    particles: [] as Particle[],
    cursorX: null as number | null,
    cursorY: null as number | null,
    W: 0, H: 0,
    ox: 0, oy: 0,
    rafId: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const s = stateRef.current

    // Returns [depth, isDark]. depth is 0→1→0 across the cell width.
    const brickDepth = (px: number, py: number): [number, boolean] => {
      const band = Math.floor(py / bandHeight)
      const yInBand = (py % bandHeight) / bandHeight
      const skew = yInBand * stripeWidth * offset
      const cumulative = band * stripeWidth * offset - band * stripeWidth
      const t = ((px - skew - cumulative) / stripeWidth) % 2
      const nt = ((t % 2) + 2) % 2
      if (nt >= 1) {
        // Green cell
        return [1 - Math.abs(nt - 1.5) * 2, true]
      }
      // Cream cell
      return [1 - Math.abs(nt - 0.5) * 2, false]
    }

    const NUM_BANDS = 4
    const NUM_GREEN = 3

    const init = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      if (!W || !H) return
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      s.W = W; s.H = H
      s.particles = []

      // Compute grid offset for centering (stagger goes left)
      const totalH = NUM_BANDS * bandHeight
      const lastB = NUM_BANDS - 1
      const lastStagger = -lastB * stripeWidth
      const lastSkewBot = lastB * stripeWidth * offset + stripeWidth * offset
      const colsW = NUM_GREEN * 2 * stripeWidth
      // Top row right edge is the rightmost, bottom row left edge is the leftmost
      const minX = lastStagger + lastSkewBot          // bottom-left extent (negative)
      const maxX = colsW                               // top-right extent
      s.ox = (W - (maxX + minX)) / 2
      s.oy = (H - totalH) / 2

      // Generate particles for both dark (green) and light (cream) cells
      for (let py = dotSpacing / 2; py < H; py += dotSpacing) {
        for (let px = dotSpacing / 2; px < W; px += dotSpacing) {
          const [d, isDark] = brickDepth(px - s.ox, py - s.oy)

          const jx = px + (Math.random() - 0.5) * 2 * jitter
          const jy = py + (Math.random() - 0.5) * 2 * jitter
          const r = dotRadiusMin + (dotRadiusMax - dotRadiusMin) * Math.pow(d, 0.2)
          const a = Math.pow(d, 0.3)

          s.particles.push({ hx: jx, hy: jy, x: jx, y: jy, vx: 0, vy: 0, r, a, dark: isDark })
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
          const dx = p.x - s.cursorX
          const dy = p.y - s.cursorY
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

      // 1. Clear canvas
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, s.W, s.H)

      // 2. Build clip regions — dark (even cols) and light (odd cols)
      const darkClip = new Path2D()
      const lightClip = new Path2D()
      const { ox, oy } = s

      for (let b = 0; b < NUM_BANDS; b++) {
        const yTop = oy + b * bandHeight
        const yBot = oy + (b + 1) * bandHeight
        const stagger = -b * stripeWidth
        const skewTop = b * stripeWidth * offset
        const skewBot = skewTop + stripeWidth * offset

        for (let c = 0; c < NUM_GREEN * 2; c++) {
          const isEven = ((c % 2) + 2) % 2 === 0
          const clip = isEven ? lightClip : darkClip

          const tl_x = ox + c       * stripeWidth + stagger + skewTop
          const tr_x = ox + (c + 1) * stripeWidth + stagger + skewTop
          const br_x = ox + (c + 1) * stripeWidth + stagger + skewBot
          const bl_x = ox + c       * stripeWidth + stagger + skewBot

          const R = 8
          // Start midway along top edge
          clip.moveTo((tl_x + tr_x) / 2, yTop)
          // Top-right corner
          clip.arcTo(tr_x, yTop, br_x, yBot, R)
          // Bottom-right corner
          clip.arcTo(br_x, yBot, bl_x, yBot, R)
          // Bottom-left corner
          clip.arcTo(bl_x, yBot, tl_x, yTop, R)
          // Top-left corner
          clip.arcTo(tl_x, yTop, tr_x, yTop, R)
          clip.closePath()
        }
      }

      // 3. Draw cream dots (light cells) — no clip needed
      const BUCKETS = 6
      const lightBuckets: Path2D[] = Array.from({ length: BUCKETS }, () => new Path2D())
      const darkBuckets: Path2D[] = Array.from({ length: BUCKETS }, () => new Path2D())
      for (const p of s.particles) {
        const bi = Math.min(BUCKETS - 1, Math.floor(p.a * BUCKETS))
        const target = p.dark ? darkBuckets : lightBuckets
        target[bi].moveTo(p.x + p.r, p.y)
        target[bi].arc(p.x, p.y, p.r, 0, Math.PI * 2)
      }

      // Draw light (cream) dots clipped to light cells
      ctx.save()
      ctx.clip(lightClip)
      for (let i = 0; i < BUCKETS; i++) {
        ctx.globalAlpha = (i + 0.5) / BUCKETS
        ctx.fillStyle = '#c8b88a'
        ctx.fill(lightBuckets[i])
      }
      ctx.globalAlpha = 1
      ctx.restore()

      // 4. Clip and draw green dots
      ctx.save()
      ctx.clip(darkClip)
      for (let i = 0; i < BUCKETS; i++) {
        ctx.globalAlpha = (i + 0.5) / BUCKETS
        ctx.fillStyle = colorDark
        ctx.fill(darkBuckets[i])
      }
      ctx.globalAlpha = 1
      ctx.restore()

      // 6. Stroke parallelogram outlines
      ctx.strokeStyle = colorDark
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.25
      ctx.stroke(darkClip)
      ctx.stroke(lightClip)
      ctx.globalAlpha = 1
    }

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      s.cursorX = e.clientX - r.left
      s.cursorY = e.clientY - r.top
    }
    const onMouseLeave = () => { s.cursorX = null; s.cursorY = null }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()
    loop()

    return () => {
      cancelAnimationFrame(s.rafId)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      ro.disconnect()
    }
  }, [stripeWidth, bandHeight, offset, dotSpacing, dotRadiusMax, dotRadiusMin,
      jitter, repelRadius, repelForce, spring, damping, colorDark, colorLight])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair', ...style }}
    />
  )
}
