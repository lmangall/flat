'use client'

import { useEffect, useRef } from 'react'

interface SunArcProps {
  color?: string
  colorAccent?: string
  accentRatio?: number
  particleCount?: number
  sunRadius?: number
  cycleDuration?: number
  trailLength?: number
  shadowColor?: string
  className?: string
}

export default function SunArc({
  color = '#F5C842',
  colorAccent = '#F2A0B5',
  accentRatio = 0.06,
  particleCount = 500,
  sunRadius = 22,
  cycleDuration = 18,
  trailLength = 28,
  shadowColor = '#1E1C18',
  className,
}: SunArcProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    let W = 0, H = 0
    let ctx: CanvasRenderingContext2D | null = null
    let rafId = 0

    // Per-particle offsets (relative to sun center)
    const offX = new Float32Array(particleCount)
    const offY = new Float32Array(particleCount)
    const radii = new Float32Array(particleCount)
    const isPink = new Uint8Array(particleCount)
    const jPhase = new Float32Array(particleCount)
    const jSpeed = new Float32Array(particleCount)
    const jAmpX = new Float32Array(particleCount)
    const jAmpY = new Float32Array(particleCount)

    // Shadow dot offsets (deterministic)
    const shadowCount = 80
    const shOffX = new Float32Array(shadowCount)
    const shOffY = new Float32Array(shadowCount)
    const shRad = new Float32Array(shadowCount)
    for (let i = 0; i < shadowCount; i++) {
      const a = (i / shadowCount) * Math.PI * 2 + (i * 2.39996)
      const d = Math.pow(Math.abs(Math.sin(i * 127.1 + 311.7) * 43758.5453 % 1), 0.5)
      shOffX[i] = Math.cos(a) * d
      shOffY[i] = Math.sin(a) * d
      shRad[i] = 0.5 + Math.abs(Math.sin(i * 53.7 + 97.3) * 43758.5453 % 1) * 1.0
    }

    // Flame / solar flare ray particles
    const rayCount = 500
    const rayAngle = new Float32Array(rayCount)
    const rayPhase = new Float32Array(rayCount)
    const raySpeed = new Float32Array(rayCount)
    const rayMaxDist = new Float32Array(rayCount)
    const rayBaseR = new Float32Array(rayCount)
    const rayAngleWobble = new Float32Array(rayCount)
    const rayColor = new Uint8Array(rayCount)
    for (let i = 0; i < rayCount; i++) {
      rayAngle[i] = Math.random() * Math.PI * 2
      rayPhase[i] = Math.random() * Math.PI * 2
      raySpeed[i] = 0.3 + Math.random() * 0.9
      rayMaxDist[i] = sunRadius * (2.0 + Math.random() * 4.0)
      rayBaseR[i] = 1.2 + Math.random() * 1.5
      rayAngleWobble[i] = (Math.random() - 0.5) * 0.4
      const roll = Math.random()
      rayColor[i] = roll < 0.06 ? 2 : roll < 0.15 ? 1 : 0
    }

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = (Math.random() + Math.random() + Math.random()) / 3 * sunRadius * 1.3
      offX[i] = Math.cos(angle) * dist
      offY[i] = Math.sin(angle) * dist
      const edgeness = Math.min(dist / sunRadius, 1)
      radii[i] = 0.3 + (1 - edgeness) * 0.6 + Math.random() * 0.3
      isPink[i] = Math.random() < accentRatio ? 1 : 0
      jPhase[i] = Math.random() * Math.PI * 2
      jSpeed[i] = 0.4 + Math.random() * 1.2
      jAmpX[i] = 2.0 + Math.random() * 5.0
      jAmpY[i] = 2.0 + Math.random() * 5.0
    }

    const init = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      if (!W || !H) return
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx = canvas.getContext('2d')
    }

    // Sun position along the arc at parameter t (0→1 = left→right)
    const sunPos = (t: number) => {
      const padX = sunRadius + 16
      const arcW = W - padX * 2
      const x = padX + arcW * t
      const arcH = H * 0.82
      const baseY = H * 0.90
      const y = baseY - Math.sin(t * Math.PI) * arcH
      return { x, y }
    }

    let startTime = 0

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop)
      if (!ctx || !W || !H) return
      if (!startTime) startTime = now

      const elapsed = (now - startTime) / 1000
      const t = (elapsed % cycleDuration) / cycleDuration

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // ── Trail ──
      for (let ti = trailLength; ti >= 1; ti--) {
        const trailT = t - (ti * 0.008)
        if (trailT < 0) continue
        const pos = sunPos(trailT)
        const fade = 1 - ti / (trailLength + 1)
        const alpha = fade * fade * 0.35

        const path = new Path2D()
        const step = Math.max(1, Math.floor(particleCount / (30 + 20 * fade)))
        for (let i = 0; i < particleCount; i += step) {
          const scale = 0.3 + 0.5 * fade
          const px = pos.x + offX[i] * scale
          const py = pos.y + offY[i] * scale
          const r = radii[i] * scale * 0.7
          if (r < 0.1) continue
          path.moveTo(px + r, py)
          path.arc(px, py, r, 0, Math.PI * 2)
        }
        ctx.globalAlpha = alpha
        ctx.fillStyle = color
        ctx.fill(path)
      }

      ctx.globalAlpha = 1

      // ── Ground shadow ──
      const { x: sunX, y: sunY } = sunPos(t)
      const groundY = H * 0.92
      const centerX = W / 2
      const shadowX = centerX + (centerX - sunX) * 0.55

      const baseY = H * 0.90
      const arcH = H * 0.82
      const elevation = Math.max(0, (baseY - sunY) / arcH)

      const shadowW = 50 + 60 * (1 - elevation)
      const shadowH = 5 + 10 * (1 - elevation)
      const shadowAlpha = 0.18 + 0.25 * (1 - elevation)

      const shadowPath = new Path2D()
      for (let i = 0; i < shadowCount; i++) {
        const sx = shadowX + shOffX[i] * shadowW
        const sy = groundY + shOffY[i] * shadowH
        const sr = shRad[i]
        shadowPath.moveTo(sx + sr, sy)
        shadowPath.arc(sx, sy, sr, 0, Math.PI * 2)
      }
      ctx.globalAlpha = shadowAlpha
      ctx.fillStyle = shadowColor
      ctx.fill(shadowPath)
      ctx.globalAlpha = 1

      // ── Solar flare rays ──
      const pathRaysYellow = new Path2D()
      const pathRaysOrange = new Path2D()
      const pathRaysRed = new Path2D()
      for (let i = 0; i < rayCount; i++) {
        const pulse = Math.abs(Math.sin(elapsed * raySpeed[i] + rayPhase[i]))
        const eased = pulse * pulse
        const dist = sunRadius * 0.5 + eased * (rayMaxDist[i] - sunRadius * 0.5)
        const angle = rayAngle[i] + Math.sin(elapsed * 0.3 + rayPhase[i]) * rayAngleWobble[i]

        const rx = sunX + Math.cos(angle) * dist
        const ry = sunY + Math.sin(angle) * dist

        const distRatio = (dist - sunRadius * 0.5) / (rayMaxDist[i] - sunRadius * 0.5)
        const rr = rayBaseR[i] * Math.pow(1 - distRatio, 1.5)

        if (rr < 0.05) continue
        const rc = rayColor[i]
        const finalR = rc === 2 ? rr * 0.45 : rc === 1 ? rr * 0.75 : rr
        if (finalR < 0.05) continue
        const rp = rc === 2 ? pathRaysRed : rc === 1 ? pathRaysOrange : pathRaysYellow
        rp.moveTo(rx + finalR, ry)
        rp.arc(rx, ry, finalR, 0, Math.PI * 2)
      }
      ctx.globalAlpha = 0.8
      ctx.fillStyle = color
      ctx.fill(pathRaysYellow)
      ctx.fillStyle = '#E8852A'
      ctx.fill(pathRaysOrange)
      ctx.fillStyle = '#D4503C'
      ctx.fill(pathRaysRed)
      ctx.globalAlpha = 1

      // ── Sun cluster ──
      const pathYellow = new Path2D()
      const pathPink = new Path2D()

      for (let i = 0; i < particleCount; i++) {
        const jx = Math.sin(elapsed * jSpeed[i] + jPhase[i]) * jAmpX[i]
        const jy = Math.cos(elapsed * jSpeed[i] * 0.8 + jPhase[i]) * jAmpY[i]

        const px = sunX + offX[i] + jx
        const py = sunY + offY[i] + jy
        const r = radii[i]

        const path = isPink[i] ? pathPink : pathYellow
        path.moveTo(px + r, py)
        path.arc(px, py, r, 0, Math.PI * 2)
      }

      ctx.fillStyle = color
      ctx.fill(pathYellow)
      ctx.fillStyle = colorAccent
      ctx.fill(pathPink)

      // ── Bright core ──
      const pathCore = new Path2D()
      const pathCoreWhite = new Path2D()
      const coreR = sunRadius * 0.45
      for (let i = 0; i < particleCount; i++) {
        const dx = offX[i]
        const dy = offY[i]
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d > coreR) continue
        const jx = Math.sin(elapsed * jSpeed[i] + jPhase[i]) * jAmpX[i] * 0.4
        const jy = Math.cos(elapsed * jSpeed[i] * 0.8 + jPhase[i]) * jAmpY[i] * 0.4
        const px = sunX + dx + jx
        const py = sunY + dy + jy
        const closeness = 1 - d / coreR
        const r = 0.5 + closeness * 1.2
        if (closeness > 0.6) {
          pathCoreWhite.moveTo(px + r, py)
          pathCoreWhite.arc(px, py, r, 0, Math.PI * 2)
        } else {
          pathCore.moveTo(px + r, py)
          pathCore.arc(px, py, r, 0, Math.PI * 2)
        }
      }
      ctx.fillStyle = '#FFED6F'
      ctx.fill(pathCore)
      ctx.fillStyle = '#FFFBE6'
      ctx.fill(pathCoreWhite)
    }

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [color, colorAccent, accentRatio, particleCount, sunRadius, cycleDuration, trailLength, shadowColor])

  return (
    <div className={`relative ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}
