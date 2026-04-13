'use client'

import { useEffect, useRef } from 'react'

interface DotFadeBoxProps {
  color?: string
  colorAccent?: string
  accentRatio?: number
  dotSpacing?: number
  dotRadiusMax?: number
  dotRadiusMin?: number
  jitter?: number
  className?: string
  children?: React.ReactNode
}

export default function DotFadeBox({
  color = '#F5C842',
  colorAccent = '#E8457A',
  accentRatio = 0.08,
  dotSpacing = 5,
  dotRadiusMax = 2.0,
  dotRadiusMin = 0.3,
  jitter = 1.5,
  className,
  children,
}: DotFadeBoxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<{
    jx: Float32Array; jy: Float32Array; noise: Float32Array; isPink: Uint8Array
    dx: Float32Array; dy: Float32Array; vx: Float32Array; vy: Float32Array
    nudgeTimer: Float32Array; nudgeForceX: Float32Array; nudgeForceY: Float32Array
  } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    let W = 0, H = 0, cols = 0, rows = 0
    let ctx: CanvasRenderingContext2D | null = null
    let rafId = 0

    const spring = 0.003
    const damping = 0.982
    const nudgeStrength = 0.35

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

      if (!stateRef.current || stateRef.current.jx.length < n) {
        const jx = new Float32Array(n)
        const jy = new Float32Array(n)
        const noise = new Float32Array(n)
        const isPink = new Uint8Array(n)
        const dx = new Float32Array(n)
        const dy = new Float32Array(n)
        const vx = new Float32Array(n)
        const vy = new Float32Array(n)
        const nudgeTimer = new Float32Array(n)
        const nudgeForceX = new Float32Array(n)
        const nudgeForceY = new Float32Array(n)

        for (let i = 0; i < n; i++) {
          jx[i] = (Math.random() - 0.5) * 2 * jitter
          jy[i] = (Math.random() - 0.5) * 2 * jitter
          noise[i] = Math.random()
          isPink[i] = Math.random() < accentRatio ? 1 : 0
          nudgeTimer[i] = Math.random() * 120
        }
        stateRef.current = { jx, jy, noise, isPink, dx, dy, vx, vy, nudgeTimer, nudgeForceX, nudgeForceY }
      }
    }

    const loop = () => {
      rafId = requestAnimationFrame(loop)
      if (!ctx || !W || !H || !stateRef.current) return

      const s = stateRef.current
      const n = cols * rows

      // Physics — wind blows dots to the left, stronger further from center
      for (let i = 0; i < n; i++) {
        s.nudgeTimer[i]--
        if (s.nudgeTimer[i] <= 0) {
          // Random nudge biased leftward
          const angle = Math.PI + (Math.random() - 0.5) * Math.PI * 0.8 // mostly left ± 72°
          const force = (0.5 + Math.random() * 0.5) * nudgeStrength
          s.nudgeForceX[i] = Math.cos(angle) * force
          s.nudgeForceY[i] = Math.sin(angle) * force
          s.nudgeTimer[i] = 40 + Math.random() * 100
        }

        s.vx[i] += s.nudgeForceX[i]
        s.vy[i] += s.nudgeForceY[i]
        s.nudgeForceX[i] *= 0.92
        s.nudgeForceY[i] *= 0.92

        // Position-dependent wind: dots further left get blown harder
        const ri = Math.floor(i / cols)
        const ci = i % cols
        const gx = dotSpacing / 2 + ci * dotSpacing
        const leftness = 1 - gx / W // 1 at left edge, 0 at right
        const wind = leftness * leftness * 0.015 // quadratic wind acceleration
        s.vx[i] -= wind

        s.vx[i] -= s.dx[i] * spring
        s.vy[i] -= s.dy[i] * spring

        s.vx[i] *= damping
        s.vy[i] *= damping

        s.dx[i] += s.vx[i]
        s.dy[i] += s.vy[i]
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const pathYellow = new Path2D()
      const pathPink = new Path2D()

      for (let ri = 0; ri < rows; ri++) {
        const gy = dotSpacing / 2 + ri * dotSpacing
        for (let ci = 0; ci < cols; ci++) {
          const idx = ri * cols + ci
          const gx = dotSpacing / 2 + ci * dotSpacing

          const x = gx + s.jx[idx] + s.dx[idx]
          const y = gy + s.jy[idx] + s.dy[idx]

          // Radial fade from canvas center — elliptical, wider than tall
          const cx = W * 0.55
          const cy = H * 1.3
          const rx = W * 0.55
          const ry = H * 0.15
          const distX = (gx - cx) / rx
          const distY = (gy - cy) / ry
          const dist = Math.sqrt(distX * distX + distY * distY)

          // Smooth radial fade: full at center, fading toward edges
          if (dist > 1.2) continue
          const radialFade = dist < 0.5 ? 1 : 1 - Math.pow((dist - 0.5) / 0.7, 1.5)
          if (radialFade <= 0) continue

          // Per-dot noise for organic edge breakup
          const nz = s.noise[idx]
          if (dist > 0.4 && nz < (dist - 0.4) * 0.8) continue

          const sizeFade = radialFade * (0.5 + 0.5 * nz)
          const r = dotRadiusMin + (dotRadiusMax - dotRadiusMin) * sizeFade
          if (r < 0.08) continue

          const path = s.isPink[idx] ? pathPink : pathYellow
          path.moveTo(x + r, y)
          path.arc(x, y, r, 0, Math.PI * 2)
        }
      }

      ctx.fillStyle = color
      ctx.fill(pathYellow)
      ctx.fillStyle = colorAccent
      ctx.fill(pathPink)
    }

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [color, colorAccent, accentRatio, dotSpacing, dotRadiusMax, dotRadiusMin, jitter])

  return (
    <div className={`relative ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        className="absolute -inset-x-16 -top-32 -bottom-64"
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
