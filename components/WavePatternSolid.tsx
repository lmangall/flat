'use client'
import { useEffect, useRef } from 'react'

interface WavePatternSolidProps {
  stripeWidth?:    number
  waveHeight?:     number
  amplitude?:      number
  colorDark?:      string
  colorLight?:     string
  rippleRadius?:   number
  rippleStrength?: number
  className?:      string
  style?:          React.CSSProperties
}

export default function WavePatternSolid({
  stripeWidth    = 40,
  waveHeight     = 60,
  amplitude      = 16,
  colorDark      = '#111111',
  colorLight     = '#f0ede6',
  rippleRadius   = 60,
  rippleStrength = 100,
  className,
  style,
}: WavePatternSolidProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const STEPS = 400

    const draw = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      if (W === 0 || H === 0) return

      const dpr = window.devicePixelRatio || 1
      canvas.width  = W * dpr
      canvas.height = H * dpr
      const ctx = canvas.getContext('2d')!
      ctx.scale(dpr, dpr)

      const cols = Math.ceil(W / stripeWidth) + 3
      const { x: cursorX, y: cursorY } = cursorRef.current

      ctx.fillStyle = colorLight
      ctx.fillRect(0, 0, W, H)

      for (let n = -2; n < cols; n++) {
        if (n % 2 !== 0) continue
        ctx.beginPath()

        for (let i = 0; i <= STEPS; i++) {
          const y = (i / STEPS) * H
          let x = n * stripeWidth + amplitude * Math.sin((2 * Math.PI * y) / waveHeight + n * Math.PI)

          if (cursorX !== null && cursorY !== null) {
            const dx   = x - cursorX
            const dy   = y - cursorY
            const dist = Math.sqrt(dx * dx + dy * dy)
            // Strong radial push — stripes flee from cursor
            const falloff = Math.exp(-(dist * dist) / (2 * rippleRadius * rippleRadius))
            const pushX = (dx / (dist + 0.1)) * rippleStrength * falloff
            // Vertical warp — bends the wave shape near cursor
            const pushY = (dy / (dist + 0.1)) * rippleStrength * 0.3 * falloff
            x += pushX
            // Offset along y shifts which part of the sine wave is sampled → distortion
            const warpedY = y + pushY
            x = x - amplitude * Math.sin((2 * Math.PI * y) / waveHeight + n * Math.PI)
                  + amplitude * Math.sin((2 * Math.PI * warpedY) / waveHeight + n * Math.PI)
          }

          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }

        for (let i = STEPS; i >= 0; i--) {
          const y = (i / STEPS) * H
          let x = (n + 1) * stripeWidth + amplitude * Math.sin((2 * Math.PI * y) / waveHeight + (n + 1) * Math.PI)

          if (cursorX !== null && cursorY !== null) {
            const dx   = x - cursorX
            const dy   = y - cursorY
            const dist = Math.sqrt(dx * dx + dy * dy)
            const falloff = Math.exp(-(dist * dist) / (2 * rippleRadius * rippleRadius))
            const pushX = (dx / (dist + 0.1)) * rippleStrength * falloff
            const pushY = (dy / (dist + 0.1)) * rippleStrength * 0.3 * falloff
            x += pushX
            const warpedY = y + pushY
            x = x - amplitude * Math.sin((2 * Math.PI * y) / waveHeight + (n + 1) * Math.PI)
                  + amplitude * Math.sin((2 * Math.PI * warpedY) / waveHeight + (n + 1) * Math.PI)
          }

          ctx.lineTo(x, y)
        }

        ctx.closePath()
        ctx.fillStyle = colorDark
        ctx.fill()
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      cursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      draw()
    }
    const onMouseLeave = () => {
      cursorRef.current = { x: null, y: null }
      draw()
    }

    canvas.addEventListener('mousemove',  onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(canvas)

    return () => {
      canvas.removeEventListener('mousemove',  onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      ro.disconnect()
    }
  }, [stripeWidth, waveHeight, amplitude, colorDark, colorLight, rippleRadius, rippleStrength])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair', ...style }}
    />
  )
}
