'use client'
import { useEffect, useRef } from 'react'

interface Props {
  dotSpacing?:   number
  dotRadius?:    number
  ring1Width?:   number
  ring1Gap?:     number
  ring1Color?:   string
  ring2Width?:   number
  ring2Gap?:     number
  ring2Color?:   string
  circleRadius?: number
  speed?:        number
  colorLight?:   string
  className?:    string
  style?:        React.CSSProperties
}

export default function WavePatternRings({
  dotSpacing   = 3,
  dotRadius    = 1.8,
  ring1Width   = 8,
  ring1Gap     = 3,
  ring1Color   = '#F5C842',
  ring2Width   = 14,
  ring2Gap     = 4,
  ring2Color   = '#E8457A',
  circleRadius = 0.42,
  speed        = 0.15,
  colorLight   = '#f0ede6',
  className,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    let W = 0, H = 0, rafId = 0, angle = 0, prevT = 0
    let ctx: CanvasRenderingContext2D | null = null
    let jx: Float32Array, jy: Float32Array
    let cols = 0, rows = 0

    const init = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      if (!W || !H) return
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx = canvas.getContext('2d')

      cols = Math.ceil(W / dotSpacing)
      rows = Math.ceil(H / dotSpacing)
      const n = cols * rows
      jx = new Float32Array(n)
      jy = new Float32Array(n)
      for (let i = 0; i < n; i++) {
        jx[i] = (Math.random() - 0.5) * 1.5
        jy[i] = (Math.random() - 0.5) * 1.5
      }
    }

    const loop = (t: number) => {
      rafId = requestAnimationFrame(loop)
      if (!ctx || !W || !H) return

      const dt = Math.min((t - prevT) / 1000, 0.05)
      prevT = t
      angle += speed * dt

      const cx = W / 2
      const cy = H / 2
      const R   = Math.min(W, H) * circleRadius
      const RG1 = R   + ring1Gap
      const RR1 = RG1 + ring1Width
      const RG2 = RR1 + ring2Gap
      const RR2 = RG2 + ring2Width

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      const pathR1 = new Path2D()
      const pathR2 = new Path2D()

      // Only iterate bounding box around rings
      const maxR = RR2 + dotSpacing * 2
      const riMin = Math.max(0, Math.floor((cy - maxR) / dotSpacing))
      const riMax = Math.min(rows - 1, Math.ceil((cy + maxR) / dotSpacing))
      const ciMin = Math.max(0, Math.floor((cx - maxR) / dotSpacing))
      const ciMax = Math.min(cols - 1, Math.ceil((cx + maxR) / dotSpacing))

      const cosA = Math.cos(angle)
      const sinA = Math.sin(angle)

      const time = angle / speed  // recover elapsed time

      for (let ri = riMin; ri <= riMax; ri++) {
        const gy = dotSpacing / 2 + ri * dotSpacing
        for (let ci = ciMin; ci <= ciMax; ci++) {
          const idx = ri * cols + ci
          const hx = dotSpacing / 2 + ci * dotSpacing + jx[idx]
          const hy = gy + jy[idx]

          const dx0 = hx - cx
          const dy0 = hy - cy
          const dist = Math.sqrt(dx0 * dx0 + dy0 * dy0)

          // Per-dot radial wobble — dots drift far out and back
          const wobblePhase = time * (0.8 + Math.abs(jx[idx]) * 1.5) + idx * 0.73
          const wobble2 = Math.sin(wobblePhase * 1.2 + jy[idx] * 5) * 5
          const wobble3 = Math.sin(wobblePhase * 2.7 + idx * 0.31) * 2
          const wobbleR = (jx[idx] + jy[idx]) * 8 * Math.sin(wobblePhase) + wobble2 + wobble3

          const wDist = dist + wobbleR
          const wdx0 = dx0 * (wDist / (dist + 0.01))
          const wdy0 = dy0 * (wDist / (dist + 0.01))

          // Rotate wobbled position around center
          const rx = cx + wdx0 * cosA - wdy0 * sinA
          const ry = cy + wdx0 * sinA + wdy0 * cosA

          // Per-dot size variation
          const rVar = dotRadius * (0.8 + 0.8 * Math.abs(Math.sin(wobblePhase * 0.7)))

          if (dist >= RG1 && dist <= RR1) {
            pathR1.moveTo(rx + rVar, ry)
            pathR1.arc(rx, ry, rVar, 0, Math.PI * 2)
          } else if (dist >= RG2 && dist <= RR2) {
            pathR2.moveTo(rx + rVar, ry)
            pathR2.arc(rx, ry, rVar, 0, Math.PI * 2)
          }
        }
      }

      ctx.fillStyle = ring1Color; ctx.fill(pathR1)
      ctx.fillStyle = ring2Color; ctx.fill(pathR2)
    }

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()
    requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [dotSpacing, dotRadius, ring1Width, ring1Gap, ring1Color,
      ring2Width, ring2Gap, ring2Color, circleRadius, speed, colorLight])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  )
}
