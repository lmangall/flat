'use client'

import WavePattern from '@/components/WavePattern'

export default function WavePage() {
  return (
    <div className="w-screen h-screen">
      <WavePattern drift />
    </div>
  )
}
