'use client'

import { useEffect, useRef } from 'react'

interface DotHeartProps {
  color?: string
  colorAccent?: string
  accentRatio?: number
  className?: string
  size?: number
  onScatter?: (散: number) => void // 0 = heart intact, 1 = fully scattered
}

export default function DotHeart({
  color = '#F5C842',
  colorAccent = '#F2A0B5',
  accentRatio = 0.15,
  className,
  size = 24,
  onScatter,
}: DotHeartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const onScatterRef = useRef(onScatter)
  onScatterRef.current = onScatter

  const pad = size * 8
  const canvasW = size + pad * 2
  const canvasH = size + pad * 2

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1

    canvas.width = Math.round(canvasW * dpr)
    canvas.height = Math.round(canvasH * dpr)
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dots: {
      hx: number; hy: number; x: number; y: number
      vx: number; vy: number; r: number; pink: boolean
    }[] = []

    const hcx = size / 2
    const hcy = size / 2
    const scale = size / 28

    const mask = document.createElement('canvas')
    mask.width = size
    mask.height = size
    const mctx = mask.getContext('2d')!
    mctx.beginPath()
    const heartScale = size / 36
    for (let t = 0; t <= Math.PI * 2; t += 0.01) {
      const hx = 16 * Math.pow(Math.sin(t), 3)
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
      const px = hcx + hx * heartScale
      const py = hcy + hy * heartScale - size * 0.05
      if (t === 0) mctx.moveTo(px, py)
      else mctx.lineTo(px, py)
    }
    mctx.closePath()
    mctx.fill()
    const maskData = mctx.getImageData(0, 0, size, size).data

    for (let py = 0; py < size; py += 1.1) {
      for (let px = 0; px < size; px += 1.1) {
        const mi = (Math.round(py) * size + Math.round(px)) * 4 + 3
        if (maskData[mi] > 128) {
          dots.push({
            hx: pad + px + (Math.random() - 0.5) * 0.8,
            hy: pad + py + (Math.random() - 0.5) * 0.8,
            x: 0, y: 0,
            vx: 0, vy: 0,
            r: (0.3 + Math.random() * 0.4) * scale,
            pink: Math.random() < accentRatio,
          })
        }
      }
    }

    const spring = 0.003
    const damping = 0.985
    const repelRadius = 160
    const repelStrength = 1.2
    // Threshold: average displacement beyond which we consider dots "scattered"
    const scatterThreshold = size * 0.7
    let rafId = 0

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
    const onMouseLeave = () => { mouseRef.current = null }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)

    const loop = () => {
      rafId = requestAnimationFrame(loop)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, canvasW, canvasH)

      const mouse = mouseRef.current
      const pathMain = new Path2D()
      const pathAccent = new Path2D()
      let totalDisp = 0

      for (const d of dots) {
        if (mouse) {
          const dx = (d.hx + d.x) - mouse.x
          const dy = (d.hy + d.y) - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < repelRadius && dist > 0.1) {
            const force = repelStrength * (1 - dist / repelRadius)
            d.vx += (dx / dist) * force
            d.vy += (dy / dist) * force
            const angle = (Math.random() - 0.5) * Math.PI * 1.4
            d.vx += Math.cos(angle) * force * 0.8
            d.vy += Math.sin(angle) * force * 0.8
            d.vx += force * 0.3
          }
        }

        d.vx -= d.x * spring
        d.vy -= d.y * spring
        d.vx *= damping
        d.vy *= damping
        d.x += d.vx
        d.y += d.vy

        totalDisp += Math.sqrt(d.x * d.x + d.y * d.y)

        const px = d.hx + d.x
        const py = d.hy + d.y

        const path = d.pink ? pathAccent : pathMain
        path.moveTo(px + d.r, py)
        path.arc(px, py, d.r, 0, Math.PI * 2)
      }

      ctx.fillStyle = color
      ctx.fill(pathMain)
      ctx.fillStyle = colorAccent
      ctx.fill(pathAccent)

      // Report scatter level
      if (onScatterRef.current && dots.length > 0) {
        const avgDisp = totalDisp / dots.length
        const scatter = Math.min(1, avgDisp / scatterThreshold)
        onScatterRef.current(scatter)
      }
    }

    rafId = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [color, colorAccent, accentRatio, size, canvasW, canvasH, pad])

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: 'relative', overflow: 'visible' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          left: -pad,
          top: -pad,
          width: canvasW,
          height: canvasH,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
