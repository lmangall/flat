'use client'
import { useEffect, useRef } from 'react'

interface Props {
  scallops?:      number
  scallopSize?:   number   // radius of each scallop circle relative to oval size
  ovalWidth?:     number   // horizontal radius fraction of canvas min dimension
  ovalHeight?:    number   // vertical radius fraction
  creamGap?:      number   // cream band width between scallop and green (fraction of oval)
  greenWidth?:    number   // green ring thickness (fraction of oval)
  greenStroke?:   number   // dark green border thickness in px
  speed?:         number
  colorScallop?:  string
  colorCream?:    string
  colorGreen?:    string
  colorGreenDark?:string
  className?:     string
  style?:         React.CSSProperties
}

export default function WavePatternScallop({
  scallops       = 16,
  scallopSize    = 0.22,
  ovalWidth      = 0.34,
  ovalHeight     = 0.44,
  creamGap       = 0.14,
  greenWidth     = 0.35,
  greenStroke    = 3,
  speed          = 0.06,
  colorScallop   = '#d4899e',
  colorCream     = '#f0ede6',
  colorGreen     = '#498c3a',
  colorGreenDark = '#2d6b28',
  className,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    let W = 0, H = 0, rafId = 0, angle = 0, prevT = 0

    const init = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      if (!W || !H) return
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
    }

    const loop = (t: number) => {
      rafId = requestAnimationFrame(loop)
      if (!W || !H) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dt = Math.min((t - prevT) / 1000, 0.05)
      prevT = t
      angle += speed * dt

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      const cx = W / 2
      const cy = H / 2
      const minDim = Math.min(W, H)

      // Base oval radii
      const rx = minDim * ovalWidth
      const ry = minDim * ovalHeight

      // Scallop circle radius
      const sR = minDim * scallopSize * 0.5

      // --- Layer 1: Scalloped pink border (overlapping circles on the oval edge) ---
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)

      // Draw each scallop as a filled circle placed on the oval perimeter
      ctx.fillStyle = colorScallop
      for (let i = 0; i < scallops; i++) {
        const a = (i / scallops) * Math.PI * 2
        const sx = rx * Math.cos(a)
        const sy = ry * Math.sin(a)
        ctx.beginPath()
        ctx.arc(sx, sy, sR, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()

      // --- Layer 2: Cream band (oval covering the inner part of scallops) ---
      const creamRx = rx * (1 - creamGap)
      const creamRy = ry * (1 - creamGap)

      ctx.fillStyle = colorCream
      ctx.beginPath()
      ctx.ellipse(cx, cy, creamRx, creamRy, 0, 0, Math.PI * 2)
      ctx.fill()

      // --- Layer 3: Green ring ---
      // Outer green oval
      const greenOuterRx = creamRx
      const greenOuterRy = creamRy
      // Inner green oval (cut out to make it a ring)
      const greenInnerRx = rx * (1 - creamGap - greenWidth)
      const greenInnerRy = ry * (1 - creamGap - greenWidth)

      // Dark green outer border
      ctx.strokeStyle = colorGreenDark
      ctx.lineWidth = greenStroke
      ctx.beginPath()
      ctx.ellipse(cx, cy, greenOuterRx, greenOuterRy, 0, 0, Math.PI * 2)
      ctx.stroke()

      // Green fill (ring)
      ctx.fillStyle = colorGreen
      ctx.beginPath()
      ctx.ellipse(cx, cy, greenOuterRx - greenStroke / 2, greenOuterRy - greenStroke / 2, 0, 0, Math.PI * 2)
      ctx.ellipse(cx, cy, greenInnerRx + greenStroke / 2, greenInnerRy + greenStroke / 2, 0, 0, Math.PI * 2, true)
      ctx.fill()

      // Dark green inner border
      ctx.strokeStyle = colorGreenDark
      ctx.lineWidth = greenStroke
      ctx.beginPath()
      ctx.ellipse(cx, cy, greenInnerRx, greenInnerRy, 0, 0, Math.PI * 2)
      ctx.stroke()

      // --- Layer 4: Center cream oval ---
      ctx.fillStyle = colorCream
      ctx.beginPath()
      ctx.ellipse(cx, cy, greenInnerRx - greenStroke / 2, greenInnerRy - greenStroke / 2, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [scallops, scallopSize, ovalWidth, ovalHeight, creamGap,
      greenWidth, greenStroke, speed,
      colorScallop, colorCream, colorGreen, colorGreenDark])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  )
}
