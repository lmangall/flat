'use client'

import dynamic from 'next/dynamic'

const WavePatternRings = dynamic(() => import('@/components/WavePatternRings'), { ssr: false })

export default function PatternPage() {
  return (
    <div className="w-screen h-screen bg-[#f0ede6] flex items-center justify-center">
      <div className="w-[min(400px,80vw)] h-[min(400px,80vw)]">
        <WavePatternRings
          dotSpacing={3}
          dotRadius={1.0}
          ring1Width={8}
          ring1Gap={3}
          ring1Color="#F5C842"
          ring2Width={14}
          ring2Gap={4}
          ring2Color="#E8457A"
          circleRadius={0.42}
          speed={0.15}
        />
      </div>
    </div>
  )
}
