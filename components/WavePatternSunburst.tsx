'use client'
import { useEffect, useRef } from 'react'

interface Props {
  segments?:     number
  rings?:        number
  color1?:       string
  color2?:       string
  pillColor?:    string
  pillWidth?:    number   // fraction of stadium width
  pillHeight?:   number   // fraction of stadium height
  speed?:        number
  className?:    string
  style?:        React.CSSProperties
}

export default function WavePatternSunburst({
  segments    = 16,
  rings       = 2,
  color1      = '#c22040',
  color2      = '#f0a0b8',
  pillColor   = '#f0ede6',
  pillWidth   = 0.18,
  pillHeight  = 0.42,
  speed       = 0.08,
  className,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    let W = 0, H = 0, rafId = 0, angle = 0, prevT = 0
    let imgData: ImageData | null = null

    const init = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      if (!W || !H) return
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
    }

    const parseColor = (hex: string): [number, number, number] => {
      const c = hex.replace('#', '')
      return [
        parseInt(c.substring(0, 2), 16),
        parseInt(c.substring(2, 4), 16),
        parseInt(c.substring(4, 6), 16),
      ]
    }

    const loop = (t: number) => {
      rafId = requestAnimationFrame(loop)
      if (!W || !H) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dt = Math.min((t - prevT) / 1000, 0.05)
      prevT = t
      angle += speed * dt

      const pw = Math.round(W * dpr)
      const ph = Math.round(H * dpr)

      if (!imgData || imgData.width !== pw || imgData.height !== ph) {
        imgData = ctx.createImageData(pw, ph)
      }
      const data = imgData.data

      const cx = pw / 2
      const cy = ph / 2

      // Stadium dimensions (device pixels)
      const stadiumW = Math.min(pw, ph) * 0.42
      const stadiumH = stadiumW * 1.35
      const capR = stadiumW
      const straightH = stadiumH - capR

      // Pill dimensions (device pixels)
      const pillHW = stadiumW * pillWidth
      const pillHH = stadiumH * pillHeight
      const pillCapR = pillHW

      const c1 = parseColor(color1)
      const c2 = parseColor(color2)
      const cp = parseColor(pillColor)

      const segAngle = (Math.PI * 2) / segments

      for (let py = 0; py < ph; py++) {
        for (let px = 0; px < pw; px++) {
          const idx = (py * pw + px) * 4
          const dx = px - cx
          const dy = py - cy

          // Stadium SDF
          const spineClampedDy = Math.max(-straightH, Math.min(straightH, dy))
          const sdx = dx
          const sdy = dy - spineClampedDy
          const distFromSpine = Math.sqrt(sdx * sdx + sdy * sdy)
          const tStadium = distFromSpine / capR

          if (tStadium > 1.0) {
            data[idx] = 0
            data[idx + 1] = 0
            data[idx + 2] = 0
            data[idx + 3] = 0
            continue
          }

          // Pill SDF
          const pillStraightH = Math.max(0, pillHH - pillCapR)
          const pillSpineClampedDy = Math.max(-pillStraightH, Math.min(pillStraightH, dy))
          const pillDist = Math.sqrt(dx * dx + (dy - pillSpineClampedDy) * (dy - pillSpineClampedDy))

          if (pillDist <= pillCapR) {
            data[idx] = cp[0]
            data[idx + 1] = cp[1]
            data[idx + 2] = cp[2]
            data[idx + 3] = 255
            continue
          }

          // Ring and segment
          const ring = Math.min(rings - 1, Math.floor(tStadium * rings))

          // Alternate rotation direction per ring
          const rawAngle = Math.atan2(dx, -dy)
          const ringAngle = ring % 2 === 0 ? angle : -angle
          const a = ((rawAngle + ringAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)
          const seg = Math.floor(a / segAngle)

          // Checkerboard
          const isAlt = (ring + seg) % 2 === 0
          const c = isAlt ? c1 : c2

          data[idx] = c[0]
          data[idx + 1] = c[1]
          data[idx + 2] = c[2]
          data[idx + 3] = 255
        }
      }

      ctx.putImageData(imgData, 0, 0)
    }

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [segments, rings, color1, color2, pillColor, pillWidth, pillHeight, speed])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  )
}
