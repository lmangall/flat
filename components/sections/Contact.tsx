'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useLang } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

const WavePatternCircle = dynamic(() => import('@/components/WavePattern'), { ssr: false })

const WA_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function Contact() {
  const { lang, setLang } = useLang()
  const t = translations[lang]
  const tc = t.contact
  const waveRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = waveRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="contact" className="bg-night py-28 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="absolute bottom-0 right-0 w-96 h-96 opacity-10"
        style={{ background: 'radial-gradient(circle at 100% 100%, #1B6B6D, transparent 70%)' }}
      />

      <div className="max-w-5xl mx-auto relative z-10 px-6 sm:px-8">
        {/* Section header */}
        <h2 className="font-display text-4xl sm:text-5xl text-cream tracking-tight mb-12">
          {tc.title}
        </h2>

        {/* WhatsApp buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-16">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_LEO_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-4 bg-cream/[0.03] backdrop-blur-sm border border-cream/10 text-cream pl-5 pr-7 py-5 font-sans text-base rounded-2xl hover:border-mer/40 hover:bg-mer/[0.06] transition-all duration-500"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366]/20 transition-colors duration-500">
              {WA_ICON}
            </span>
            <div className="flex flex-col">
              <span className="font-medium tracking-wide">{tc.leo}</span>
              <span className="text-xs text-cream/30 mt-0.5">Leo</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="ml-auto text-cream/20 group-hover:text-mer group-hover:translate-x-0.5 transition-all duration-500">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_MARTYNA_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-4 bg-cream/[0.03] backdrop-blur-sm border border-cream/10 text-cream pl-5 pr-7 py-5 font-sans text-base rounded-2xl hover:border-sunset/30 hover:bg-sunset/[0.06] transition-all duration-500"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366]/20 transition-colors duration-500">
              {WA_ICON}
            </span>
            <div className="flex flex-col">
              <span className="font-medium tracking-wide">{tc.martyna}</span>
              <span className="text-xs text-cream/30 mt-0.5">Martyna</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="ml-auto text-cream/20 group-hover:text-sunset group-hover:translate-x-0.5 transition-all duration-500">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          <div
            className="relative flex items-center gap-4 bg-cream/[0.02] border border-cream/[0.06] text-cream/20 pl-5 pr-7 py-5 font-sans text-base rounded-2xl cursor-not-allowed"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-cream/[0.04] text-cream/15">
              {WA_ICON}
            </span>
            <div className="flex flex-col">
              <span className="font-medium tracking-wide">{tc.group}</span>
              <span className="text-xs text-cream/15 mt-0.5">{tc.groupNote}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Wave pattern — full width, lazy loaded */}
      <div ref={waveRef} className="mt-20 h-[500px] overflow-hidden">
        {visible && (
          <WavePatternCircle
            colorDark="#FDFBF7"
            colorLight="#1E1C18"
            ring1Color="#F5C842"
            ring2Color="#E8457A"
            circleRadius={0.34}
            dotSpacing={5}
            dotRadiusMax={1.8}
            dotRadiusMin={0.15}
            stripeWidth={28}
            waveHeight={70}
            amplitude={10}
            ring1Width={8}
            ring1Gap={2}
            ring2Width={17}
            ring2Gap={3}
            repelRadius={40}
            repelForce={10}
            hollowCenter={false}
            drift
          />
        )}
      </div>

      {/* Footer */}
      <div className="pb-6 pt-4">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 border-t border-cream/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={process.env.NEXT_PUBLIC_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-cream/40 text-[0.75rem] tracking-wider hover:text-mer transition-colors"
          >
            📍 {process.env.NEXT_PUBLIC_ADDRESS}
          </a>
          <div className="flex items-center gap-4">
            <div className="flex gap-0.5 bg-cream/[0.04] rounded-full p-0.5 border border-cream/[0.08]">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 text-[0.6rem] font-sans font-medium tracking-wider transition-all duration-300 rounded-full ${
                  lang === 'en'
                    ? 'bg-cream/15 text-cream/70'
                    : 'text-cream/25 hover:text-cream/50'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('pl')}
                className={`px-2 py-0.5 text-[0.6rem] font-sans font-medium tracking-wider transition-all duration-300 rounded-full ${
                  lang === 'pl'
                    ? 'bg-cream/15 text-cream/70'
                    : 'text-cream/25 hover:text-cream/50'
                }`}
              >
                PL
              </button>
            </div>
            <a
              href="/wave"
              className="font-sans text-cream/25 text-[0.7rem] tracking-wider hover:text-cream/60 transition-colors"
            >
              Wave
            </a>
            <a
              href="/cube"
              className="font-sans text-cream/25 text-[0.7rem] tracking-wider hover:text-cream/60 transition-colors"
            >
              Cube
            </a>
            <a
              href="/patterns"
              className="font-sans text-cream/25 text-[0.7rem] tracking-wider hover:text-cream/60 transition-colors"
            >
              Patterns
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
