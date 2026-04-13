'use client'
import { useEffect, useRef } from 'react'

interface Props {
  stripeWidth?:  number
  waveHeight?:   number
  amplitude?:    number
  speed?:        number
  colorDark?:    string
  colorLight?:   string
  className?:    string
  style?:        React.CSSProperties
}

export default function WavePatternSolidAnimated({
  stripeWidth  = 24,
  waveHeight   = 36,
  amplitude    = 10,
  speed        = 0.8,
  colorDark    = '#111111',
  colorLight   = '#f0ede6',
  className,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const STEPS = 300
    let W = 0, H = 0, rafId = 0, phase = 0, time = 0, prevT = 0
    let ctx: CanvasRenderingContext2D | null = null
    const dpr = window.devicePixelRatio || 1

    const init = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      if (!W || !H) return
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx = canvas.getContext('2d')
    }

    const loop = (t: number) => {
      rafId = requestAnimationFrame(loop)
      if (!ctx || !W || !H) return

      const dt = Math.min((t - prevT) / 1000, 0.05)
      prevT = t
      phase += speed * dt
      time += dt

      // All parameters breathe on independent irrational-ratio cycles — never repeats
      const wh  = waveHeight  + waveHeight  * 0.35 * Math.sin(time * 0.31)
      const amp = amplitude   + amplitude   * 0.5  * Math.sin(time * 0.23)
      const sw  = stripeWidth + stripeWidth * 0.25 * Math.sin(time * 0.17)
      // Slow horizontal drift so stripes wander across the canvas
      const drift = Math.sin(time * 0.11) * stripeWidth * 0.6
      // Per-stripe phase offset wobble — each stripe undulates at its own pace
      const wobbleAmp = amplitude * 0.15 * (1 + Math.sin(time * 0.19))

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = colorLight
      ctx.fillRect(0, 0, W, H)

      const cols = Math.ceil(W / sw) + 4

      for (let n = -3; n < cols; n++) {
        if (n % 2 !== 0) continue
        ctx.beginPath()

        for (let i = 0; i <= STEPS; i++) {
          const y = (i / STEPS) * H
          const perStripeWobble = wobbleAmp * Math.sin(time * 0.4 + n * 0.7)
          const x = drift + n * sw + (amp + perStripeWobble) * Math.sin((2 * Math.PI * y) / wh + n * Math.PI + phase)
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }

        for (let i = STEPS; i >= 0; i--) {
          const y = (i / STEPS) * H
          const perStripeWobble = wobbleAmp * Math.sin(time * 0.4 + (n + 1) * 0.7)
          const x = drift + (n + 1) * sw + (amp + perStripeWobble) * Math.sin((2 * Math.PI * y) / wh + (n + 1) * Math.PI + phase)
          ctx.lineTo(x, y)
        }

        ctx.closePath()
        ctx.fillStyle = colorDark
        ctx.fill()
      }
    }

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()
    requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [stripeWidth, waveHeight, amplitude, speed, colorDark, colorLight])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  )
}
