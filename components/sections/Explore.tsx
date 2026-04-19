'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useLang } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'
import { places, FLAT_COORDS, categoryColors, type Category } from '@/lib/places'
const TGTG_ICON = '/tgtg-icon.png'


type Filter = 'all' | Category | 'tgtg'

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] rounded-2xl bg-parchment flex items-center justify-center border border-stone/25">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-mer border-t-transparent animate-spin" />
        <span className="text-[0.72rem] font-sans text-clay">Loading map...</span>
      </div>
    </div>
  ),
})

export default function Explore() {
  const { lang } = useLang()
  const t = translations[lang]
  const te = t.explore
  const [active, setActive] = useState<Filter>('all')
  const [activePlace, setActivePlace] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const isPaused = useRef(false)
  const rafId = useRef<number>(0)

  const filters: { key: Filter; label: string; emoji?: string; logo?: string }[] = [
    { key: 'all', label: te.all, emoji: '✦' },
    { key: 'coffee', label: te.categories.coffee, emoji: '☕' },
    { key: 'food', label: te.categories.food, emoji: '🍽' },
    { key: 'tgtg', label: 'Too Good To Go', logo: TGTG_ICON },
    { key: 'walks', label: te.categories.walks, emoji: '🌿' },
    { key: 'museums', label: te.categories.museums, emoji: '🏛' },
    { key: 'local-specialties', label: te.categories['local-specialties'], emoji: '🫓' },
  ]

  const filtered = useMemo(
    () =>
      active === 'all'
        ? places
        : active === 'tgtg'
          ? places.filter((p) => p.tgtg)
          : places.filter((p) => p.category === active),
    [active]
  )

  // Track scroll position for fade edges (throttled to avoid re-renders every frame)
  const scrollTicking = useRef(false)
  const updateScrollState = useCallback(() => {
    if (scrollTicking.current) return
    scrollTicking.current = true
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) {
        const left = el.scrollLeft > 8
        const right = el.scrollLeft < el.scrollWidth - el.clientWidth - 8
        setCanScrollLeft((prev) => prev !== left ? left : prev)
        setCanScrollRight((prev) => prev !== right ? right : prev)
      }
      scrollTicking.current = false
    })
  }, [])

  // Auto-scroll animation
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const speed = 1.8 // px per frame

    const tick = () => {
      if (!isPaused.current && el.scrollLeft < el.scrollWidth - el.clientWidth - 1) {
        el.scrollLeft += speed
      } else if (!isPaused.current && el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
        // Reached the end — loop back
        el.scrollLeft = 0
      }
      rafId.current = requestAnimationFrame(tick)
    }

    // Start after a short delay
    const timeout = setTimeout(() => {
      rafId.current = requestAnimationFrame(tick)
    }, 2000)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(rafId.current)
    }
  }, [filtered])

  // Pause auto-scroll on hover / touch
  const pauseScroll = useCallback(() => { isPaused.current = true }, [])
  const resumeScroll = useCallback(() => {
    // Small delay before resuming so it doesn't jerk
    setTimeout(() => { isPaused.current = false }, 1500)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [updateScrollState, filtered])

  const handleMarkerClick = useCallback((id: string) => {
    setActivePlace(id)
    isPaused.current = true
    const el = cardRefs.current[id]
    if (el && scrollRef.current) {
      const container = scrollRef.current
      const scrollLeft = el.offsetLeft - container.offsetLeft - 32
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
    // Resume after user has had time to look
    setTimeout(() => { isPaused.current = false }, 4000)
  }, [])

  const handleCardClick = useCallback((id: string) => {
    setActivePlace((prev) => (prev === id ? null : id))
    isPaused.current = true
    setTimeout(() => { isPaused.current = false }, 4000)
  }, [])

  const getDirectionsUrl = (place: { lat: number; lng: number }) =>
    `https://www.google.com/maps/dir/${FLAT_COORDS.lat},${FLAT_COORDS.lng}/${place.lat},${place.lng}`

  return (
    <section id="explore" className="bg-parchment py-28 relative overflow-hidden">
      <div className="grain absolute inset-0" />

      {/* Header + filters stay in the container */}
      <div className="max-w-5xl mx-auto relative z-10 px-6 sm:px-8">
        {/* Section header */}
        <h2 className="font-display text-4xl sm:text-5xl text-night tracking-tight mb-4">
          {te.title}
        </h2>
        <div className="w-16 h-px bg-mer/30 mb-10 ml-1" />

        {/* Category filters */}
        <div className="flex gap-4 sm:gap-8 mb-8 border-b border-stone/20 overflow-x-auto scrollbar-hide">
          {filters.map((f) => {
            const isActive = active === f.key
            const color = f.key === 'all' || f.key === 'tgtg' ? '#2A2A28' : categoryColors[f.key as Category]
            return (
              <button
                key={f.key}
                onClick={() => {
                  setActive(f.key)
                  setActivePlace(null)
                }}
                className="group relative pb-3 whitespace-nowrap transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  {f.logo ? (
                    <img
                      src={f.logo}
                      alt={f.label}
                      className={`h-4 w-auto transition-all duration-300 ${isActive ? 'grayscale-0 opacity-100' : 'grayscale opacity-50 group-hover:opacity-80 group-hover:grayscale-0'}`}
                    />
                  ) : (
                    <span
                      className={`text-base transition-all duration-300 ${isActive ? 'scale-110 grayscale-0' : 'grayscale opacity-50 group-hover:opacity-80 group-hover:grayscale-0'}`}
                    >
                      {f.emoji}
                    </span>
                  )}
                  <span
                    className={`font-display text-[0.95rem] tracking-tight transition-colors duration-300 ${
                      isActive ? 'text-night' : 'text-earth/40 group-hover:text-earth/70'
                    }`}
                  >
                    {f.label}
                  </span>
                </span>
                {/* Active underline */}
                <span
                  className="absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: isActive ? '100%' : '0%',
                    backgroundColor: color,
                    opacity: isActive ? 1 : 0,
                  }}
                />
              </button>
            )
          })}
        </div>

        {/* Map — full width within container */}
        <div className="rounded-2xl overflow-hidden border border-stone/25 shadow-card">
          <div className="h-[460px] relative">
            <MapView
              filter={active}
              activePlace={activePlace}
              onMarkerClick={handleMarkerClick}
            />
          </div>
          <div className="bg-white px-5 py-3 flex items-center justify-between">
            <span className="text-[0.65rem] font-sans text-clay">Antibes, France</span>
            <a
              href={process.env.NEXT_PUBLIC_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[0.65rem] font-sans font-medium text-mer hover:text-sunset transition-colors"
            >
              Open in Google Maps
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M4 3h5v5M9 3L3 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Full-bleed horizontal card carousel */}
      <div
        className="relative mt-10"
        onMouseEnter={pauseScroll}
        onMouseLeave={resumeScroll}
        onTouchStart={pauseScroll}
        onTouchEnd={resumeScroll}
      >
        {/* Fade edges — full-height, wide gradient */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to right, #F6F2EB, transparent)',
            opacity: canScrollLeft ? 1 : 0,
          }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to left, #F6F2EB, transparent)',
            opacity: canScrollRight ? 1 : 0,
          }}
        />

        {/* Scrollable row — edge to edge */}
        <div
          ref={scrollRef}
          className="overflow-x-auto py-4 px-6 sm:px-12 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-4 w-fit mx-auto">
          {filtered.map((place) => {
            const isSelected = activePlace === place.id
            return (
              <div
                key={place.id}
                ref={(el) => { cardRefs.current[place.id] = el }}
                onClick={() => handleCardClick(place.id)}
                className={`
                  shrink-0 w-[280px] rounded-xl px-5 py-5 cursor-pointer transition-all duration-300
                  ${isSelected
                    ? 'bg-white shadow-float border border-mer/20 scale-[1.02]'
                    : 'bg-white/50 border border-stone/20 hover:bg-white hover:shadow-card hover:border-stone/30'
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`
                      text-lg shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                      transition-colors duration-300
                      ${isSelected ? 'bg-mer-light' : 'bg-parchment'}
                    `}
                  >
                    {place.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-[0.9rem] text-night leading-tight tracking-tight truncate">
                      {place.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[0.6rem] font-sans capitalize font-medium"
                        style={{ color: categoryColors[place.category] }}
                      >
                        {place.category}
                      </span>
                      {place.tgtg && (
                        <img
                          src={TGTG_ICON}
                          alt="Too Good To Go"
                          className="h-3.5 w-auto opacity-80"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <p className="font-sans text-earth/55 text-[0.78rem] leading-relaxed mb-3 line-clamp-3">
                  {place.description[lang]}
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={place.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[0.72rem] font-sans font-medium text-mer hover:text-sunset transition-colors duration-300"
                  >
                    {te.openMaps}
                  </a>
                  <a
                    href={getDirectionsUrl(place)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[0.72rem] font-sans font-medium text-sunset/70 hover:text-sunset transition-colors duration-300"
                  >
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <path d="M8 1v14M8 1L4 5M8 1l4 4M1 11h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(45, 8, 8)"/>
                    </svg>
                    {lang === 'en' ? 'Directions' : 'Trasa'}
                  </a>
                </div>
              </div>
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}
