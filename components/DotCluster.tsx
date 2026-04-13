/**
 * Pill-shaped dense dot field placed behind section titles.
 * Yellow dots on the left dissolve into pink on the right,
 * clipped to a pill/capsule shape echoing the Hero wave-pattern.
 */
export default function DotCluster({ className = '' }: { className?: string }) {
  const cols = 30
  const rows = 10
  const spacing = 5
  const jitter = 1.5
  const yellow = '#F5C842'
  const pink = '#E8457A'

  const seed = (i: number) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
    return x - Math.floor(x)
  }

  const dots: { cx: number; cy: number; r: number; color: string; opacity: number }[] = []
  const pad = 6
  const w = (cols - 1) * spacing + pad * 2
  const h = (rows - 1) * spacing + pad * 2
  const pillCx = w / 2
  const pillCy = h / 2
  const pillRx = w / 2
  const pillRy = h / 2

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col
      const jx = (seed(i) - 0.5) * jitter
      const jy = (seed(i + 50) - 0.5) * jitter
      const cx = col * spacing + jx + pad
      const cy = row * spacing + jy + pad

      // Pill-shape test: ellipse distance
      const ex = (cx - pillCx) / pillRx
      const ey = (cy - pillCy) / pillRy
      const ellipseDist = ex * ex + ey * ey
      if (ellipseDist > 1) continue

      const t = col / (cols - 1)
      const edgeFade = 1 - Math.pow(ellipseDist, 0.6) // fade near pill edge

      // Size: large left, shrinking right
      const baseR = 1.9 * (1 - t * 0.7) + 0.35
      const r = baseR * (0.5 + edgeFade * 0.5)

      // Dissolve trailing right edge
      const drop = t > 0.5 ? (t - 0.5) / 0.5 : 0
      if (seed(i + 99) < drop * 0.55) continue
      // Dissolve near pill boundary
      if (ellipseDist > 0.65 && seed(i + 77) < (ellipseDist - 0.65) * 1.5) continue

      let color: string
      if (t < 0.35) {
        color = yellow
      } else if (t > 0.65) {
        color = pink
      } else {
        color = seed(i + 33) > 0.5 ? yellow : pink
      }

      const opacity = Math.max(0.25, edgeFade * (1 - drop * 0.4))

      dots.push({ cx, cy, r: Math.max(r, 0.2), color, opacity })
    }
  }

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      aria-hidden="true"
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={d.color} opacity={d.opacity} />
      ))}
    </svg>
  )
}
