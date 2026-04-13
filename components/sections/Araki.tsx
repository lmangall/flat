'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useLang } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'
import DotFadeBox from '@/components/DotFadeBox'
import DotHeart from '@/components/DotHeart'

const SunArc = dynamic(() => import('@/components/SunArc'), { ssr: false })


export default function Araki() {
  const { lang } = useLang()
  const t = translations[lang]
  const ta = t.araki
  const [showSun, setShowSun] = useState(false)
  const [heartScatter, setHeartScatter] = useState(0)

  const openSun = useCallback(() => setShowSun(true), [])
  const closeSun = useCallback(() => setShowSun(false), [])

  const cards = [ta.stuff, ta.hair, ta.food, ta.walks, ta.night]

  return (
    <section id="araki" className="bg-parchment py-28 px-6 sm:px-8 relative overflow-hidden">
      <div className="grain absolute inset-0" />

      {/* Sun overlay */}
      {showSun && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer sun-overlay-enter"
          onClick={closeSun}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={{
              background: 'radial-gradient(ellipse at 50% 45%, rgba(253,251,247,0.97) 0%, rgba(253,251,247,0.93) 30%, rgba(253,251,247,0.7) 50%, rgba(253,251,247,0.3) 65%, rgba(253,251,247,0) 80%)',
            }}
          />
          {/* Content */}
          <div className="relative z-10 w-full max-w-4xl px-6 overflow-visible">
            <SunArc className="h-56 sm:h-80 mb-4" />
            <p className="font-sans text-earth/60 text-[0.82rem] italic leading-relaxed sun-caption sun-stream sm:whitespace-nowrap overflow-visible sm:w-max mx-auto text-center px-4 sm:px-0">
              Araki&apos;s favourite humans move his place across the flat so he can nap in the warm light as long as possible.
            </p>

          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <h2 className="font-display text-4xl sm:text-5xl text-night tracking-tight mb-4">
          {ta.title}
        </h2>
        <div className="w-16 h-px bg-mer/30 mb-6 ml-1" />
        <p className="font-sans text-earth/70 text-[0.95rem] leading-relaxed max-w-xl mb-6">
          {ta.intro}
        </p>

        {/* Pro tip link */}
        <button
          onClick={openSun}
          className="font-sans text-[0.8rem] text-mer hover:text-mer/80 transition-colors mb-10 inline-flex items-center gap-1.5 group"
        >
          <span className="text-sm">☀️</span>
          <span className="underline decoration-mer/30 underline-offset-2 group-hover:decoration-mer/60">
            pro tip
          </span>
        </button>

        {/* Photo + Cards + Yellow box layout */}
        <div className="grid lg:grid-cols-[400px_1fr] gap-10 items-start">
          {/* Dog photo — editorial crop */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-float group">
            <Image
              src={`${process.env.NEXT_PUBLIC_BLOB_URL}/araki.jpg`}
              alt="Araki"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/15 to-transparent" />
          </div>

          {/* Right column: cards + yellow box */}
          <div className="flex flex-col justify-between h-full">
            {/* Info cards */}
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1">
              {cards.map((card, i) => (
                <div key={i} className="py-1.5">
                  <div className="flex items-center gap-3 mb-1">
                    {i === 0 ? (
                      <span className="relative shrink-0" style={{ width: 24, height: 24 }}>
                        <DotHeart size={24} color="#DC2626" colorAccent="#DC2626" accentRatio={0} onScatter={setHeartScatter} />
                        <span
                          className="absolute inset-0 flex items-center justify-center text-lg pointer-events-none"
                          style={{ opacity: heartScatter, transition: 'opacity 0.8s ease-in' }}
                        >
                          ❤️
                        </span>
                      </span>
                    ) : (
                      <span className="text-lg">
                        {card.emoji}
                      </span>
                    )}
                    <h3
                      className="font-display text-lg text-night tracking-tight"
                      style={i === 0 ? {
                        backgroundImage: 'linear-gradient(120deg, currentColor 40%, #DC2626 50%, currentColor 60%)',
                        backgroundSize: '200% 100%',
                        backgroundPosition: heartScatter > 0.3 ? '0% center' : '100% center',
                        transition: 'background-position 1.2s ease',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      } : undefined}
                    >
                      {card.title}
                    </h3>
                  </div>
                  <p className="font-sans text-earth/65 text-[0.82rem] leading-relaxed">
                    {i === 1 && card.text.includes('sitting') ? (
                      <>
                        He has to be <span className="underline decoration-earth/25 decoration-[0.5px] underline-offset-2">sitting at his place</span> while you prepare his food. {card.text.split('. ').slice(1).join('. ')}
                      </>
                    ) : i === 1 && card.text.includes('siedzieć') ? (
                      <>
                        Musi <span className="underline decoration-earth/25 decoration-[0.5px] underline-offset-2">siedzieć na swoim miejscu</span>, kiedy przygotowujecie mu jedzenie. {card.text.split('. ').slice(1).join('. ')}
                      </>
                    ) : card.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Yellow box callout with photo */}
            <DotFadeBox
              color="#F5C842"
              colorAccent="#F2A0B5"
              accentRatio={0.06}
              dotSpacing={12}
              dotRadiusMax={2.2}
              dotRadiusMin={0.5}
              jitter={1.5}
              className="mt-4 p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
                {/* Photo with progressive blur at edges */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 relative">
                  {/* Blurred background layer */}
                  <img
                    src={`${process.env.NEXT_PUBLIC_BLOB_URL}/araki-box.jpg`}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'blur(8px)' }}
                  />
                  {/* Sharp foreground with fade mask */}
                  <img
                    src={`${process.env.NEXT_PUBLIC_BLOB_URL}/araki-box.jpg`}
                    alt="The yellow box"
                    className="relative w-full h-full object-cover"
                    style={{
                      maskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
                      maskComposite: 'intersect',
                      WebkitMaskComposite: 'destination-in',
                    }}
                  />
                </div>
                {/* Text */}
                <div className="text-center sm:text-left">
                  <h3 className="font-display text-lg sm:text-xl text-night tracking-tight mb-2">
                    📦 {lang === 'en' ? 'The Yellow Box' : 'Żółte Pudełko'}
                  </h3>
                  <p className="font-sans text-night/80 text-[0.85rem] sm:text-[0.9rem] leading-relaxed">
                    {lang === 'en'
                      ? "Extra Araki stuff is in the yellow box or in the kitchen! (other leashes, snacks, passport for train, muzzle...)"
                      : 'Wszystko jest w żółtym pudełku w kuchni — rozpoznacie je od razu!'}
                  </p>
                </div>
              </div>
            </DotFadeBox>
          </div>
        </div>
      </div>
    </section>
  )
}
