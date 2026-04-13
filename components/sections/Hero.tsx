'use client'

import dynamic from 'next/dynamic'
import { useLang } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

const WavePatternCircle = dynamic(() => import('@/components/WavePattern'), { ssr: false })

export default function Hero() {
  const { lang } = useLang()
  const t = translations[lang]

  return (
    <section
      id="home"
      className="min-h-screen relative flex flex-col justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#FDFBF7]" />

      {/* Wave pattern circle with rings */}
      <div className="absolute inset-0">
        <WavePatternCircle
          colorDark="#1E1C18"
          colorLight="#FDFBF7"
          ring1Color="#F5C842"
          ring2Color="#E8457A"
          circleRadius={0.34}
          dotSpacing={4.5}
          dotRadiusMax={2.2}
          dotRadiusMin={0.1}
          jitter={1.2}
          stripeWidth={50}
          waveHeight={130}
          amplitude={18}
          ring1Width={8}
          ring1Gap={3}
          ring2Width={14}
          ring2Gap={4}
          repelRadius={70}
          repelForce={12}
          style={{ cursor: 'default' }}
        />
      </div>

      {/* Blur behind center text */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
        <div className="w-[85vw] max-w-[500px] h-[55vw] max-h-[300px] bg-[#FDFBF7]/40 backdrop-blur-sm rounded-full" style={{ maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 65%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 65%)' }} />
      </div>

      {/* Content — centered in circle */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6 sm:px-8 text-center pointer-events-none">
      <div className="max-w-5xl pointer-events-auto">
        <h1
          className="font-display text-[clamp(2.5rem,12vw,9rem)] text-night leading-[0.88] tracking-tight mb-4 animate-fade-up"
          style={{ opacity: 0, fontWeight: 300, animationDelay: '1s' }}
        >
          Antibes
        </h1>

        <p
          className="section-label mb-4 sm:mb-6 text-sm sm:text-base animate-fade-up"
          style={{ opacity: 0, animationDelay: '1.3s' }}
        >
          {t.hero.welcome}
        </p>

        <div
          className="flex items-center justify-center gap-2 sm:gap-4 animate-fade-up"
          style={{ opacity: 0, animationDelay: '1.6s' }}
        >
          <div className="w-8 sm:w-12 h-px bg-mer/40" />
          <span className="font-sans text-clay text-xs sm:text-sm tracking-wide">
            {t.hero.address}
          </span>
          <div className="w-8 sm:w-12 h-px bg-mer/40" />
        </div>
      </div>
      </div>

      {/* Subtitle — below the circle */}
      <div className="relative z-10 mt-auto pb-16 text-center px-6">
        <p
          className="font-sans text-earth text-base sm:text-lg max-w-xs sm:max-w-md mx-auto leading-relaxed animate-fade-up"
          style={{ opacity: 0, fontWeight: 300, animationDelay: '1.9s' }}
        >
          {t.hero.subtitle}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dune z-10">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-dune animate-bounce" />
      </div>
    </section>
  )
}
