'use client'
import { useEffect, useRef } from 'react'

interface CubeDotPatternProps {
  dotSpacing?: number
  dotRadius?: number
  jitter?: number
  repelRadius?: number
  repelForce?: number
  spring?: number
  damping?: number
  colorYellow?: string
  colorPink?: string
  colorBg?: string
  className?: string
  style?: React.CSSProperties
}

export default function CubeDotPattern({
  dotSpacing = 5,
  dotRadius = 1.6,
  jitter = 1.0,
  repelRadius = 40,
  repelForce = 10,
  spring = 0.06,
  damping = 0.78,
  colorYellow = '#F5C842',
  colorPink = '#E8457A',
  colorBg = '#f0ede6',
  className,
  style,
}: CubeDotPatternProps) {
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

    /* ── 3D Projection ── */
    const ROT_Y = Math.PI / 4.2
    const ROT_X = Math.PI / 4.8
    const cosY = Math.cos(ROT_Y), sinY = Math.sin(ROT_Y)
    const cosX = Math.cos(ROT_X), sinX = Math.sin(ROT_X)

    // Returns [screenX, screenY, depth]
    function project(x3: number, y3: number, z3: number): [number, number, number] {
      const x1 = x3 * cosY - y3 * sinY
      const y1 = x3 * sinY + y3 * cosY
      const y2 = y1 * cosX - z3 * sinX
      const z2 = y1 * sinX + z3 * cosX
      return [x1, -z2, y2] // screenX, screenY, depth (smaller = closer)
    }

    // Project with offset and scale
    function proj(x3: number, y3: number, z3: number, s: number, ox: number, oy: number): [number, number, number] {
      const [sx, sy, d] = project(x3 * s, y3 * s, z3 * s)
      return [sx + ox, sy + oy, d]
    }

    // Check point in convex polygon
    function pointInQuad(px: number, py: number, quad: [number, number][]): boolean {
      let sign = 0
      for (let i = 0; i < quad.length; i++) {
        const [x1, y1] = quad[i]
        const [x2, y2] = quad[(i + 1) % quad.length]
        const cross = (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1)
        if (cross !== 0) {
          if (sign === 0) sign = cross > 0 ? 1 : -1
          else if ((cross > 0 ? 1 : -1) !== sign) return false
        }
      }
      return true
    }

    // A face: 2D quad + average depth + zone name
    type Zone = 'yellow-front' | 'yellow-left' | 'yellow-right' | 'yellow-top'
      | 'pink-top' | 'pink-front' | 'pink-right'
      | 'white-inner' | 'white-front' | 'white-right'
      | 'white-inner-left' | 'white-inner-back' | 'none'

    interface Face {
      quad: [number, number][]
      depth: number
      zone: Zone
    }

    function buildFaces(s: number, ox: number, oy: number): Face[] {
      const p = (x: number, y: number, z: number) => proj(x, y, z, s, ox, oy)

      // ── Yellow cube (0,0,0)→(1,1,1) ──
      const faces: Face[] = []

      // Front face (y=0)
      const cf = [p(0,0,0), p(1,0,0), p(1,0,1), p(0,0,1)]
      faces.push({
        quad: cf.map(v => [v[0], v[1]] as [number, number]),
        depth: cf.reduce((s, v) => s + v[2], 0) / 4,
        zone: 'yellow-front',
      })

      // Right face (x=1)
      const cr = [p(1,0,0), p(1,1,0), p(1,1,1), p(1,0,1)]
      faces.push({
        quad: cr.map(v => [v[0], v[1]] as [number, number]),
        depth: cr.reduce((s, v) => s + v[2], 0) / 4,
        zone: 'yellow-right',
      })

      // Left face (x=0)
      const cl = [p(0,0,0), p(0,1,0), p(0,1,1), p(0,0,1)]
      faces.push({
        quad: cl.map(v => [v[0], v[1]] as [number, number]),
        depth: cl.reduce((s, v) => s + v[2], 0) / 4,
        zone: 'yellow-left',
      })

      // Top face (z=1)
      const ct = [p(0,0,1), p(1,0,1), p(1,1,1), p(0,1,1)]
      faces.push({
        quad: ct.map(v => [v[0], v[1]] as [number, number]),
        depth: ct.reduce((s, v) => s + v[2], 0) / 4,
        zone: 'yellow-top',
      })

      // ── Inner white box sitting on top ──
      const i = 0.1   // inset from edges
      const bz0 = 1.0  // bottom = top of cube
      const bz1 = 1.25 // top of inner box
      const rimW = 0.06

      // Box front wall (y=i):
      //   pink left edge | white center | pink right edge (all full height)
      const e = rimW
      // Left pink vertical edge
      const bfLE = [p(i,i,bz0), p(i+e,i,bz0), p(i+e,i,bz1), p(i,i,bz1)]
      faces.push({ quad: bfLE.map(v => [v[0],v[1]] as [number,number]), depth: bfLE.reduce((s,v)=>s+v[2],0)/4, zone: 'pink-front' })
      // Right pink vertical edge
      const bfRE = [p(1-i-e,i,bz0), p(1-i,i,bz0), p(1-i,i,bz1), p(1-i-e,i,bz1)]
      faces.push({ quad: bfRE.map(v => [v[0],v[1]] as [number,number]), depth: bfRE.reduce((s,v)=>s+v[2],0)/4, zone: 'pink-front' })
      // White center
      const bfC = [p(i+e,i,bz0), p(1-i-e,i,bz0), p(1-i-e,i,bz1), p(i+e,i,bz1)]
      faces.push({ quad: bfC.map(v => [v[0],v[1]] as [number,number]), depth: bfC.reduce((s,v)=>s+v[2],0)/4, zone: 'white-front' })

      // Box right wall (x=1-i):
      //   pink left edge | white center | pink right edge (all full height)
      // Left pink vertical edge (near front)
      const brLE = [p(1-i,i,bz0), p(1-i,i+e,bz0), p(1-i,i+e,bz1), p(1-i,i,bz1)]
      faces.push({ quad: brLE.map(v => [v[0],v[1]] as [number,number]), depth: brLE.reduce((s,v)=>s+v[2],0)/4, zone: 'pink-right' })
      // Right pink vertical edge (near back)
      const brRE = [p(1-i,1-i-e,bz0), p(1-i,1-i,bz0), p(1-i,1-i,bz1), p(1-i,1-i-e,bz1)]
      faces.push({ quad: brRE.map(v => [v[0],v[1]] as [number,number]), depth: brRE.reduce((s,v)=>s+v[2],0)/4, zone: 'pink-right' })
      // White center
      const brC = [p(1-i,i+e,bz0), p(1-i,1-i-e,bz0), p(1-i,1-i-e,bz1), p(1-i,i+e,bz1)]
      faces.push({ quad: brC.map(v => [v[0],v[1]] as [number,number]), depth: brC.reduce((s,v)=>s+v[2],0)/4, zone: 'white-right' })

      // Inner left wall (x=i) — pink edge at back corner, white center
      const bilPink = [p(i,1-i-e,bz0), p(i,1-i,bz0), p(i,1-i,bz1), p(i,1-i-e,bz1)]
      faces.push({ quad: bilPink.map(v => [v[0],v[1]] as [number,number]), depth: bilPink.reduce((s,v)=>s+v[2],0)/4, zone: 'pink-front' })
      const bilW = [p(i,i,bz0), p(i,1-i-e,bz0), p(i,1-i-e,bz1), p(i,i,bz1)]
      faces.push({ quad: bilW.map(v => [v[0],v[1]] as [number,number]), depth: bilW.reduce((s,v)=>s+v[2],0)/4, zone: 'white-inner-left' })

      // Inner back wall (y=1-i) — pink edge at left corner, white center
      const bibPink = [p(i,1-i,bz0), p(i+e,1-i,bz0), p(i+e,1-i,bz1), p(i,1-i,bz1)]
      faces.push({ quad: bibPink.map(v => [v[0],v[1]] as [number,number]), depth: bibPink.reduce((s,v)=>s+v[2],0)/4, zone: 'pink-right' })
      const bibW = [p(i+e,1-i,bz0), p(1-i,1-i,bz0), p(1-i,1-i,bz1), p(i+e,1-i,bz1)]
      faces.push({ quad: bibW.map(v => [v[0],v[1]] as [number,number]), depth: bibW.reduce((s,v)=>s+v[2],0)/4, zone: 'white-inner-back' })

      // Box top face = pink rim — 4 strips so interior shows through
      const r = i + rimW
      // Front strip
      const btF = [p(i,i,bz1), p(1-i,i,bz1), p(1-i,r,bz1), p(i,r,bz1)]
      faces.push({ quad: btF.map(v => [v[0],v[1]] as [number,number]), depth: btF.reduce((s,v)=>s+v[2],0)/4, zone: 'pink-top' })
      // Back strip
      const btB = [p(i,1-r,bz1), p(1-i,1-r,bz1), p(1-i,1-i,bz1), p(i,1-i,bz1)]
      faces.push({ quad: btB.map(v => [v[0],v[1]] as [number,number]), depth: btB.reduce((s,v)=>s+v[2],0)/4, zone: 'pink-top' })
      // Left strip
      const btL = [p(i,r,bz1), p(r,r,bz1), p(r,1-r,bz1), p(i,1-r,bz1)]
      faces.push({ quad: btL.map(v => [v[0],v[1]] as [number,number]), depth: btL.reduce((s,v)=>s+v[2],0)/4, zone: 'pink-top' })
      // Right strip
      const btR = [p(1-r,r,bz1), p(1-i,r,bz1), p(1-i,1-r,bz1), p(1-r,1-r,bz1)]
      faces.push({ quad: btR.map(v => [v[0],v[1]] as [number,number]), depth: btR.reduce((s,v)=>s+v[2],0)/4, zone: 'pink-top' })

      // Inner floor — covers full box interior to hide yellow underneath
      const bi = [p(i,i,bz0), p(1-i,i,bz0), p(1-i,1-i,bz0), p(i,1-i,bz0)]
      faces.push({
        quad: bi.map(v => [v[0], v[1]] as [number, number]),
        depth: bi.reduce((s, v) => s + v[2], 0) / 4,
        zone: 'white-inner',
      })

      // Sort back-to-front (largest depth first = furthest from camera drawn first)
      // But for classification, we want front-most face, so sort by depth ascending
      faces.sort((a, b) => a.depth - b.depth)

      return faces
    }

    function classifyPoint(px: number, py: number, faces: Face[]): Zone {
      // Inner box faces always take priority over cube faces (they sit on top)
      // Check box faces first, then cube faces
      for (const face of faces) {
        if (face.zone.startsWith('white') || face.zone.startsWith('pink')) {
          if (pointInQuad(px, py, face.quad)) return face.zone
        }
      }
      for (const face of faces) {
        if (face.zone.startsWith('yellow')) {
          if (pointInQuad(px, py, face.quad)) return face.zone
        }
      }
      return 'none'
    }

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
      pdx = new Float32Array(n)
      pdy = new Float32Array(n)

      for (let ii = 0; ii < n; ii++) {
        jx[ii] = (Math.random() - 0.5) * 2 * jitter
        jy[ii] = (Math.random() - 0.5) * 2 * jitter
      }
    }

    const loop = () => {
      rafId = requestAnimationFrame(loop)
      if (!ctx) return

      const cubeSize = Math.min(W, H) * 0.38
      // Center offset
      const [, topY] = project(0, 0, cubeSize * 1.5)
      const [, botY] = project(cubeSize, 0, 0)
      const [leftX] = project(0, cubeSize, cubeSize)
      const [rightX] = project(cubeSize, cubeSize, 0)
      const ox = W / 2 - (leftX + rightX) / 2
      const oy = H / 2 - (topY + botY) / 2

      const faces = buildFaces(cubeSize, ox, oy)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = colorBg
      ctx.fillRect(0, 0, W, H)

      const pathYellowFront = new Path2D()
      const pathYellowLeft = new Path2D()
      const pathYellowRight = new Path2D()
      const pathYellowTop = new Path2D()
      const pathPinkTop = new Path2D()
      const pathPinkFront = new Path2D()
      const pathPinkRight = new Path2D()
      const pathWhiteInner = new Path2D()
      const pathWhiteFront = new Path2D()
      const pathWhiteRight = new Path2D()
      const pathWhiteInnerLeft = new Path2D()
      const pathWhiteInnerBack = new Path2D()

      for (let ri = 0; ri < rows; ri++) {
        const gy = dotSpacing / 2 + ri * dotSpacing
        for (let ci = 0; ci < cols; ci++) {
          const idx = ri * cols + ci
          const hx = dotSpacing / 2 + ci * dotSpacing + jx[idx]
          const hy = gy + jy[idx]

          let fx = -pdx[idx] * spring
          let fy = -pdy[idx] * spring

          if (cursorX !== null) {
            const ex = hx + pdx[idx] - cursorX
            const ey = hy + pdy[idx] - cursorY!
            const d2 = Math.sqrt(ex * ex + ey * ey)
            if (d2 < repelRadius) {
              const f = (1 - d2 / repelRadius) * repelForce
              fx += (ex / (d2 + 0.1)) * f
              fy += (ey / (d2 + 0.1)) * f
            }
          }

          pdx[idx] = (pdx[idx] + fx) * damping
          pdy[idx] = (pdy[idx] + fy) * damping

          const x = hx + pdx[idx]
          const y = hy + pdy[idx]

          const zone = classifyPoint(hx, hy, faces)
          if (zone === 'none') continue

          const r = dotRadius

          switch (zone) {
            case 'yellow-front':
              pathYellowFront.moveTo(x + r, y); pathYellowFront.arc(x, y, r, 0, Math.PI * 2); break
            case 'yellow-left':
              pathYellowLeft.moveTo(x + r, y); pathYellowLeft.arc(x, y, r, 0, Math.PI * 2); break
            case 'yellow-right':
              pathYellowRight.moveTo(x + r, y); pathYellowRight.arc(x, y, r, 0, Math.PI * 2); break
            case 'yellow-top':
              pathYellowTop.moveTo(x + r, y); pathYellowTop.arc(x, y, r, 0, Math.PI * 2); break
            case 'pink-top':
              pathPinkTop.moveTo(x + r, y); pathPinkTop.arc(x, y, r, 0, Math.PI * 2); break
            case 'pink-front':
              pathPinkFront.moveTo(x + r, y); pathPinkFront.arc(x, y, r, 0, Math.PI * 2); break
            case 'pink-right':
              pathPinkRight.moveTo(x + r, y); pathPinkRight.arc(x, y, r, 0, Math.PI * 2); break
            case 'white-inner':
              pathWhiteInner.moveTo(x + r, y); pathWhiteInner.arc(x, y, r, 0, Math.PI * 2); break
            case 'white-front':
              pathWhiteFront.moveTo(x + r, y); pathWhiteFront.arc(x, y, r, 0, Math.PI * 2); break
            case 'white-right':
              pathWhiteRight.moveTo(x + r, y); pathWhiteRight.arc(x, y, r, 0, Math.PI * 2); break
            case 'white-inner-left':
              pathWhiteInnerLeft.moveTo(x + r, y); pathWhiteInnerLeft.arc(x, y, r, 0, Math.PI * 2); break
            case 'white-inner-back':
              pathWhiteInnerBack.moveTo(x + r, y); pathWhiteInnerBack.arc(x, y, r, 0, Math.PI * 2); break
          }
        }
      }

      ctx.globalAlpha = 1
      // Yellow cube
      ctx.fillStyle = '#F7D44E';     ctx.fill(pathYellowTop)
      ctx.fillStyle = colorYellow;   ctx.fill(pathYellowFront)
      ctx.fillStyle = '#E8BF3A';     ctx.fill(pathYellowLeft)
      ctx.fillStyle = '#D4A830';     ctx.fill(pathYellowRight)

      // Outside walls of box — nearly white
      ctx.fillStyle = '#eceae5';    ctx.fill(pathWhiteFront)
      ctx.fillStyle = '#e5e2dc';    ctx.fill(pathWhiteRight)
      // Inside walls (looking down into the box) — clearly grey
      ctx.fillStyle = '#8a867f';    ctx.fill(pathWhiteInnerLeft)
      ctx.fillStyle = '#9e9a93';    ctx.fill(pathWhiteInnerBack)

      // Pink rim — top + edges
      ctx.fillStyle = colorPink;    ctx.fill(pathPinkTop)
      ctx.fillStyle = '#C93A66';    ctx.fill(pathPinkFront)
      ctx.fillStyle = '#AD3058';    ctx.fill(pathPinkRight)

      // White inner floor — opaque to hide yellow underneath
      ctx.fillStyle = '#e8e5de'
      ctx.globalAlpha = 1
      ctx.fill(pathWhiteInner)

      ctx.globalAlpha = 1
    }

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      cursorX = e.clientX - r.left
      cursorY = e.clientY - r.top
    }
    const onMouseLeave = () => { cursorX = null; cursorY = null }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()
    loop()

    return () => {
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      ro.disconnect()
    }
  }, [dotSpacing, dotRadius, jitter, repelRadius, repelForce, spring, damping,
    colorYellow, colorPink, colorBg])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair', ...style }}
    />
  )
}
