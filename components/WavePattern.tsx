'use client'
import { useEffect, useRef } from 'react'

interface WavePatternProps {
  // Pattern shape
  stripeWidth?:   number
  waveHeight?:    number
  amplitude?:     number
  // Dot rendering
  dotSpacing?:    number   // grid spacing in px — lower = denser
  dotRadiusMax?:  number   // radius at stripe centre
  dotRadiusMin?:  number   // radius at stripe edge / circle boundary
  jitter?:        number   // max random offset on home position in px
  // Cursor interaction
  repelRadius?:   number
  repelForce?:    number
  spring?:        number
  damping?:       number
  // Circular frame
  circleRadius?:  number   // fraction of min(width, height)
  ring1Width?:    number   // thin inner ring width in px
  ring1Gap?:      number   // gap between pattern circle and inner ring in px
  ring1Color?:    string
  ring2Width?:    number   // thick outer ring width in px
  ring2Gap?:      number   // gap between inner and outer ring in px
  ring2Color?:    string
  // Colours
  colorDark?:     string
  colorLight?:    string
  // Animation
  drift?:         boolean   // enable continuous left-to-right dot drift
  hollowCenter?:  boolean   // skip dots in center (for text overlay)
  className?:     string
  style?:         React.CSSProperties
}

export default function WavePatternCircle({
  stripeWidth  = 28,
  waveHeight   = 70,
  amplitude    = 10,
  dotSpacing   = 1.3,
  dotRadiusMax = 0.72,
  dotRadiusMin = 0.04,
  jitter       = 0.9,
  repelRadius  = 10,
  repelForce   = 8,
  spring       = 0.06,
  damping      = 0.78,
  circleRadius = 0.34,
  ring1Width   = 8,
  ring1Gap     = 2,
  ring1Color   = '#F5C842',
  ring2Width   = 17,
  ring2Gap     = 3,
  ring2Color   = '#E8457A',
  colorDark    = '#111111',
  colorLight   = '#f0ede6',
  drift        = false,
  hollowCenter = true,
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
    let pdx: Float32Array, pdy: Float32Array
    let cursorX: number | null = null, cursorY: number | null = null
    let rafId = 0
    let startTime = 0
    let scrollProgress = 0

    // Returns 0–1 (stripe depth) or -1 (outside dark stripes)
    const stripeDepth = (px: number, py: number, sc: number): number => {
      const sw = stripeWidth * sc
      const wh = waveHeight  * sc
      const am = amplitude   * sc
      const nc = Math.ceil(W / sw) + 3
      for (let n = -2; n < nc; n++) {
        if (n % 2 !== 0) continue
        const phase = (2 * Math.PI * py) / wh + n * Math.PI
        const xl = n * sw + am * Math.sin(phase)
        const xr = (n + 1) * sw + am * Math.sin(phase + Math.PI)
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
      pdx = new Float32Array(n)
      pdy = new Float32Array(n)

      for (let i = 0; i < n; i++) {
        jx[i] = (Math.random() - 0.5) * 2 * jitter
        jy[i] = (Math.random() - 0.5) * 2 * jitter
      }
    }

    // Reference circle radius (px) where the prop values look correct.
    // On viewports that yield a different R the pixel values are scaled
    // proportionally so the pattern keeps the same number of stripes.
    const REF_R = 306

    const loop = () => {
      rafId = requestAnimationFrame(loop)
      if (!ctx) return

      const cx  = W / 2
      const cy  = H / 2
      const R   = Math.min(W, H) * circleRadius
      const s   = Math.min(1, R / REF_R)              // scale pattern down on small screens, never up
      const RG1 = R   + ring1Gap
      const RR1 = RG1 + ring1Width
      const RG2 = RR1 + ring2Gap
      const RR2 = RG2 + ring2Width

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = colorLight
      ctx.fillRect(0, 0, W, H)

      // Separate Path2D per colour — single geometry pass, three fill calls
      const pathWave = new Path2D()
      const pathR1   = new Path2D()
      const pathR2   = new Path2D()

      // Only iterate rows/cols that could fall inside the outer ring
      const maxR = RR2 + dotSpacing * 2  // small margin for jitter
      const riMin = Math.max(0, Math.floor((cy - maxR) / dotSpacing))
      const riMax = Math.min(rows - 1, Math.ceil((cy + maxR) / dotSpacing))
      const ciMin = Math.max(0, Math.floor((cx - maxR) / dotSpacing))
      const ciMax = Math.min(cols - 1, Math.ceil((cx + maxR) / dotSpacing))

      for (let ri = riMin; ri <= riMax; ri++) {
        const gy = dotSpacing / 2 + ri * dotSpacing
        for (let ci = ciMin; ci <= ciMax; ci++) {
          const idx = ri * cols + ci
          const hx  = dotSpacing / 2 + ci * dotSpacing + jx[idx]
          const hy  = gy + jy[idx]

          const dx0  = hx - cx
          const dy0  = hy - cy
          const dist = Math.sqrt(dx0 * dx0 + dy0 * dy0)

          // Skip dots clearly outside all regions
          if (dist > RR2 + dotSpacing) continue

          // Physics — spring + cursor repulsion
          let fx = -pdx[idx] * spring
          let fy = -pdy[idx] * spring

          if (cursorX !== null) {
            const ex   = hx + pdx[idx] - cursorX
            const ey   = hy + pdy[idx] - cursorY!
            const d2   = Math.sqrt(ex * ex + ey * ey)
            if (d2 < repelRadius) {
              const f = (1 - d2 / repelRadius) * repelForce
              fx += (ex / (d2 + 0.1)) * f
              fy += (ey / (d2 + 0.1)) * f
            }
          }

          pdx[idx] = (pdx[idx] + fx) * damping
          pdy[idx] = (pdy[idx] + fy) * damping

          let x: number, y: number
          if (drift) {
            // Continuous left-to-right drift with organic per-dot variation
            const tRaw = (performance.now() - startTime) / 1000
            const t = Math.max(0, tRaw - 1)           // 1s pause before motion
            const ease = Math.min(1, t / 3)            // then ramp over 3s
            const speed = 8 + jx[idx] * 6
            // Per-dot diagonal angle: mostly rightward but drifting up or down
            const driftAngle = (jy[idx] * 0.4)          // ±~0.4 rad (~±23°)
            // Layered wobble: two sine waves at different frequencies for organic feel
            const wobble1 = Math.sin(t * (0.5 + Math.abs(jy[idx]) * 0.8) + idx) * 3
            const wobble2 = Math.sin(t * (0.2 + Math.abs(jx[idx]) * 0.3) + idx * 1.7) * 2
            const wobbleY = (wobble1 + wobble2) * ease
            const travel = speed * t * ease + Math.abs(jx[idx]) * 40 * ease
            const driftX = Math.cos(driftAngle) * travel
            const driftY = Math.sin(driftAngle) * travel
            const rawX = hx + pdx[idx] + driftX
            x = ((rawX % W) + W) % W
            y = hy + pdy[idx] + driftY + wobbleY
          } else {
            // Scroll-based dispersal: dots fly outward on scroll
            const sp = Math.min(1, scrollProgress * 1)
            const dotAngle = Math.atan2(dy0, dx0) + jx[idx] * 0.4
            const biasedAngle = dotAngle < 0 ? dotAngle : -Math.PI + (dotAngle * 0.3)
            const flyDist = (R + 80 + Math.abs(jy[idx]) * 100) * sp
            const targetX = hx + Math.cos(biasedAngle) * flyDist + jx[idx] * 25 * sp
            const targetY = hy + Math.sin(biasedAngle) * flyDist + jy[idx] * 15 * sp
            x = hx + pdx[idx] + (targetX - hx) * sp
            y = hy + pdy[idx] + (targetY - hy) * sp
          }

          if (dist <= R) {
            // Wave pattern area — stripe depth + radial edge vignette
            const d = stripeDepth(hx, hy, s)
            if (d < 0) continue

            const stripeFade = Math.pow(d, 0.6)
            // edgeFade: 1 at circle boundary → 0 at centre; exponent 0.25 = soft fade
            const edgeFade   = Math.pow(Math.max(0, 1 - dist / R), 0.25)
            let innerFade = 1
            if (hollowCenter) {
              // innerFade: 0 at centre → 1; elliptical (wider horizontally) for text area
              const innerDistX = dx0 / (R * 1.15)
              const innerDistY = dy0 / (R * 0.7)
              const innerDist  = Math.sqrt(innerDistX * innerDistX + innerDistY * innerDistY)
              // Gradual fade toward center — no hard cutoff
              innerFade = Math.pow(Math.min(1, innerDist / 0.9), 1.2)
            }
            const ds = Math.sqrt(s)  // gentler scaling so dots stay visible on small screens
            const rMax = dotRadiusMax * ds
            const rMin = dotRadiusMin * ds
            const r = rMin + (rMax - rMin) * stripeFade * edgeFade * innerFade
            if (r < 0.04) continue

            pathWave.moveTo(x + r, y)
            pathWave.arc(x, y, r, 0, Math.PI * 2)

          } else if (dist >= RG1 && dist <= RR1) {
            // Thin inner ring — full size dots, near-solid appearance
            const rRing = dotRadiusMax * Math.sqrt(s)
            pathR1.moveTo(x + rRing, y)
            pathR1.arc(x, y, rRing, 0, Math.PI * 2)

          } else if (dist >= RG2 && dist <= RR2) {
            // Thick outer ring — full size dots
            const rRing = dotRadiusMax * Math.sqrt(s)
            pathR2.moveTo(x + rRing, y)
            pathR2.arc(x, y, rRing, 0, Math.PI * 2)
          }
        }
      }

      if (drift) {
        ctx.fillStyle = colorDark;  ctx.fill(pathWave)
        ctx.fillStyle = ring1Color; ctx.fill(pathR1)
        ctx.fillStyle = ring2Color; ctx.fill(pathR2)
      } else {
        const fadeAll = Math.max(0, 1 - scrollProgress * 1.5)
        ctx.globalAlpha = fadeAll
        ctx.fillStyle = colorDark;  ctx.fill(pathWave)
        const ringAlpha = Math.max(0, 1 - scrollProgress * 3)
        ctx.globalAlpha = fadeAll * ringAlpha
        ctx.fillStyle = ring1Color; ctx.fill(pathR1)
        ctx.fillStyle = ring2Color; ctx.fill(pathR2)
        ctx.globalAlpha = 1
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      cursorX = e.clientX - r.left
      cursorY = e.clientY - r.top
    }
    const onMouseLeave = () => { cursorX = null; cursorY = null }

    const onScroll = () => {
      const rect = canvas.getBoundingClientRect()
      scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.8)))
    }

    canvas.addEventListener('mousemove',  onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    if (!drift) window.addEventListener('scroll', onScroll, { passive: true })

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()
    startTime = performance.now()
    loop()

    return () => {
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('mousemove',  onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      if (!drift) window.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [stripeWidth, waveHeight, amplitude, dotSpacing, dotRadiusMax, dotRadiusMin,
      jitter, repelRadius, repelForce, spring, damping,
      circleRadius, ring1Width, ring1Gap, ring1Color,
      ring2Width, ring2Gap, ring2Color, colorDark, colorLight, drift])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair', ...style }}
    />
  )
}
