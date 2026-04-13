'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useLang } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'


function SeaBurst({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const firedRef = useRef(false)

  useEffect(() => {
    if (!trigger || firedRef.current) return
    firedRef.current = true

    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colors = ['#1B6B6D', '#2A9D8F', '#5BC0BE', '#ffffff', '#a0d8d5', '#d0efed']
    const yellowIdx = Math.floor(Math.random() * 60)
    const particles: {
      x: number; y0: number; vx: number
      r: number; color: string; alpha: number; decay: number
      waveAmp: number; waveFreq: number; wavePhase: number
    }[] = []

    for (let i = 0; i < 60; i++) {
      const speed = 1.5 + Math.random() * 3
      particles.push({
        x: 0,
        y0: H / 2 + (Math.random() - 0.5) * 3,
        vx: speed,
        r: 0.6 + Math.random() * 0.8,
        color: i === yellowIdx ? '#F5C842' : colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.7 + Math.random() * 0.3,
        decay: 0.006 + Math.random() * 0.01,
        waveAmp: 1 + Math.random() * 3,
        waveFreq: 0.08 + Math.random() * 0.1,
        wavePhase: Math.random() * Math.PI * 2,
      })
    }

    let rafId = 0
    let t = 0
    const loop = () => {
      t++
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      let alive = false
      for (const p of particles) {
        if (p.alpha <= 0) continue
        alive = true
        p.x += p.vx
        p.alpha -= p.decay
        const y = p.y0 + Math.sin(p.x * p.waveFreq + p.wavePhase) * p.waveAmp

        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      if (alive) rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none"
      style={{ left: 0, top: -20, width: 200, height: 50 }}
    />
  )
}

function DistanceIndicator({ lang }: { lang: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [burst, setBurst] = useState(false)
  const [waving, setWaving] = useState(false)
  const [count, setCount] = useState(0)
  const [time, setTime] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Start waving + counter immediately, fire burst when dashes reach "The sea"
  useEffect(() => {
    if (!visible) return
    setWaving(true)
    const burstTimer = setTimeout(() => setBurst(true), 1700)
    // Increment counter in sync with dots appearing
    // Each dot delays i*80ms then takes 500ms to appear, so it's visible around i*80+250ms
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= 20; i++) {
      timers.push(setTimeout(() => setCount(i), i * 80 + 250))
    }
    return () => { clearTimeout(burstTimer); timers.forEach(clearTimeout) }
  }, [visible])

  // Continuous wave animation loop
  useEffect(() => {
    if (!waving) return
    let start = performance.now()
    const tick = (now: number) => {
      setTime((now - start) / 1000)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [waving])

  return (
    <div ref={ref} className="flex flex-col flex-1 min-w-0 ml-0 sm:ml-6 sm:self-end mb-[-14px]">
      {/* Row: 20 dashes → The Sea */}
      <div className="flex items-center gap-0 overflow-hidden">
        {/* 20 dashes that appear one by one left→right */}
        <div className="flex-1 flex items-center justify-between gap-[5px]">
          {Array.from({ length: 20 }, (_, i) => {
            const waveY = waving ? Math.sin(time * 2 + i * 0.4) * 2 : 0
            return (
              <span
                key={i}
                className="block"
                style={{
                  transform: `translateY(${waveY}px)`,
                }}
              >
                <span
                  className="block w-[3px] h-[3px] rounded-full bg-earth/25"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'scale(1)' : 'scale(0)',
                    transition: `opacity 500ms ease-out ${visible ? i * 80 : 0}ms, transform 500ms ease-out ${visible ? i * 80 : 0}ms`,
                  }}
                />
              </span>
            )
          })}
        </div>

        {/* The Sea label */}
        <span
          className="font-mono text-[0.85rem] tracking-[0.2em] uppercase text-mer whitespace-nowrap ml-3 transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-12px)',
            transitionDelay: visible ? '1700ms' : '0ms',
          }}
        >
          {lang === 'en' ? 'The sea' : 'Morze'}
        </span>

        {/* Burst to the right of "The sea" */}
        <div className="relative">
          <SeaBurst trigger={burst} />
        </div>
      </div>

      {/* 20m label centered below the dashes */}
      <div
        className="flex items-center justify-center gap-1.5 mr-12 transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transitionDelay: visible ? '100ms' : '0ms',
        }}
      >
        <svg width="14" height="8" viewBox="0 0 14 8" className="text-mer/40">
          <path d="M0 4c1.5-2 2.5-2 3.5 0s2 2 3.5 0 2.5-2 3.5 0 2 2 3.5 0" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span className="font-mono text-[0.8rem] text-mer/60 tracking-wider tabular-nums">{count}m</span>
        <svg width="14" height="8" viewBox="0 0 14 8" className="text-mer/40">
          <path d="M0 4c1.5-2 2.5-2 3.5 0s2 2 3.5 0 2.5-2 3.5 0 2 2 3.5 0" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  )
}

export default function TheFlat() {
  const { lang } = useLang()
  const t = translations[lang]
  const tf = t.flat
  const [galleryOpen, setGalleryOpen] = useState(false)

  return (
    <section id="flat" className="bg-cream py-28 px-6 sm:px-8 relative overflow-hidden">
      <div className="grain absolute inset-0" />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header + distance indicator */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end gap-0">
            <h2 className="font-display text-4xl sm:text-5xl text-night tracking-tight whitespace-nowrap">
              {tf.title}
            </h2>

            {/* ── 20m ── The Sea (fades in left→right) */}
            <DistanceIndicator lang={lang} />
          </div>
        </div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-20">
          <div className="py-6 border-b border-stone/30">
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-0.5">{tf.location.emoji}</span>
              <div>
                <h3 className="font-display text-xl text-night mb-2 tracking-tight">
                  {tf.location.title}
                </h3>
                <p className="font-sans text-earth/70 leading-relaxed text-[0.85rem]">
                  {tf.location.text}
                </p>
              </div>
            </div>
          </div>

          <div className="py-6 border-b border-stone/30">
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-0.5">{tf.practical.emoji}</span>
              <div>
                <h3 className="font-display text-xl text-night mb-2 tracking-tight">
                  {tf.practical.title}
                </h3>
                <p className="font-sans text-earth/70 leading-relaxed text-[0.85rem]">
                  {tf.practical.text}
                </p>
              </div>
            </div>
          </div>

          <div className="py-6 border-b border-stone/30">
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-0.5">{tf.humidity.emoji}</span>
              <div>
                <h3 className="font-display text-xl text-night mb-2 tracking-tight">
                  {tf.humidity.title}
                </h3>
                <p className="font-sans text-earth/70 leading-relaxed text-[0.85rem]">
                  It&apos;s really important to open the windows regularly —{' '}
                  <a
                    href="https://www.tiktok.com/@liamcarps/video/7325103756696210721"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted decoration-earth/30 hover:decoration-earth/60 transition-colors"
                    title="Leo knows a thing or two about ventilation from his Berlin days"
                  >
                    especially upstairs
                  </a>
                  , where humidity builds up fast. Same story in the bathroom: we usually leave the towels outside to dry rather than keeping them in there.
                </p>
              </div>
            </div>
          </div>

          <div className="py-6 border-b border-stone/30">
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-0.5">🏠</span>
              <div>
                <h3 className="font-display text-xl text-night mb-2 tracking-tight">
                  Address
                </h3>
                <p className="font-sans font-medium text-night text-base">
                  {process.env.NEXT_PUBLIC_ADDRESS_SHORT}
                </p>
                <p className="font-sans text-earth/60 text-base">Antibes, France</p>
                <a
                  href="https://maps.app.goo.gl/example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm font-sans font-medium text-mer hover:text-sunset transition-colors"
                >
                  Open in Maps
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-px">
                    <path d="M4 3h5v5M9 3L3 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Photo gallery — collapsible with peek */}
        <div>
          <h3 className="font-display text-2xl text-night mb-6 tracking-tight">
            {tf.gallery.title}
          </h3>

          {/* Gallery with peek, blur, fade, and smooth reveal */}
          <div className="relative">
            <div
              className="overflow-hidden transition-[max-height] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ maxHeight: galleryOpen ? '5000px' : '380px' }}
            >
              {/* Masonry-ish grid */}
              <div className="columns-2 md:columns-3 gap-3 space-y-3">
                {tf.gallery.items.map((item, i) => (
                  <div
                    key={i}
                    className="relative break-inside-avoid rounded-xl overflow-hidden group transition-all duration-700"
                    style={{
                      filter: galleryOpen ? 'blur(0px)' : 'blur(1.5px)',
                      opacity: galleryOpen ? 1 : 0.85,
                      transform: galleryOpen ? 'scale(1)' : 'scale(0.98)',
                      transitionDelay: galleryOpen ? `${i * 80}ms` : '0ms',
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={item.caption}
                      width={600}
                      height={800}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 [filter:saturate(1.3)_contrast(1.1)_brightness(1.02)]"
                    />
                    {/* Vignette */}
                    <div className="absolute inset-0 rounded-xl" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.35)' }} />
                    {/* Caption overlay */}
                    <div
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent pt-10 pb-3 px-3 transition-opacity duration-500"
                      style={{
                        opacity: galleryOpen ? 1 : 0,
                        transitionDelay: galleryOpen ? `${200 + i * 80}ms` : '0ms',
                      }}
                    >
                      <p className="font-sans text-white/90 text-xs sm:text-sm leading-snug">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Video */}
                <div
                  className="relative break-inside-avoid rounded-xl overflow-hidden transition-all duration-700"
                  style={{
                    filter: galleryOpen ? 'blur(0px)' : 'blur(1.5px)',
                    opacity: galleryOpen ? 1 : 0.85,
                    transform: galleryOpen ? 'scale(1)' : 'scale(0.98)',
                    transitionDelay: galleryOpen ? `${tf.gallery.items.length * 80}ms` : '0ms',
                  }}
                >
                  <video
                    src={tf.gallery.video.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-auto [filter:saturate(1.3)_contrast(1.1)_brightness(1.02)]"
                  />
                  {/* Vignette */}
                  <div className="absolute inset-0 rounded-xl" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.35)' }} />
                  <div
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent pt-10 pb-3 px-3 transition-opacity duration-500"
                    style={{
                      opacity: galleryOpen ? 1 : 0,
                      transitionDelay: galleryOpen ? `${200 + tf.gallery.items.length * 80}ms` : '0ms',
                    }}
                  >
                    <p className="font-sans text-white/90 text-xs sm:text-sm leading-snug">
                      {tf.gallery.video.caption}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient fade at the cut edge + button */}
            <div
              className={`absolute inset-x-0 bottom-0 transition-all duration-700 ${galleryOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              {/* Tall soft fade from cream into the photos */}
              <div
                className="h-[240px]"
                style={{
                  background: `linear-gradient(to top,
                    #FDFBF7 0%,
                    #FDFBF7 15%,
                    color-mix(in srgb, #FDFBF7 90%, transparent) 30%,
                    color-mix(in srgb, #FDFBF7 60%, transparent) 50%,
                    color-mix(in srgb, #FDFBF7 25%, transparent) 70%,
                    transparent 100%
                  )`,
                }}
              />
              {/* Button anchored at the bottom of the fade */}
              <div className="absolute inset-x-0 bottom-6 flex justify-center">
                <button
                  onClick={() => setGalleryOpen(true)}
                  className="group/btn font-sans text-xs tracking-[0.15em] uppercase text-earth/60 hover:text-night transition-all cursor-pointer flex items-center gap-3 px-7 py-3.5 rounded-full border border-stone/40 hover:border-earth/30 bg-cream/90 backdrop-blur-sm shadow-subtle hover:shadow-card"
                >
                  {lang === 'en' ? 'See all photos' : 'Zobacz wszystkie'}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="transition-transform duration-300 group-hover/btn:translate-y-0.5"
                  >
                    <path d="M2.5 4.5l3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
