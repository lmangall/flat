'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

export default function Navbar() {
  const { lang, setLang } = useLang()
  const t = translations[lang]
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { href: '#flat', label: t.nav.flat },
    { href: '#araki', label: t.nav.araki },
    { href: '#around', label: t.nav.around },
    { href: '#explore', label: t.nav.explore },
    { href: '#contact', label: t.nav.contact },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream/85 backdrop-blur-xl shadow-subtle border-b border-stone/40'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <a
          href="#home"
          className={`font-display text-[1.35rem] tracking-tight transition-colors duration-300 ${
            scrolled ? 'text-night' : 'text-night'
          } hover:text-mer`}
        >
          Antibes
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-clay hover:text-night font-sans text-[0.8rem] font-normal tracking-wide transition-colors duration-300 relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-mer group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language toggle */}
          <div className="flex gap-0.5 bg-parchment/80 rounded-full p-0.5 border border-stone/30">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-[0.65rem] font-sans font-medium tracking-wider transition-all duration-300 rounded-full ${
                lang === 'en'
                  ? 'bg-white text-night shadow-subtle'
                  : 'text-clay hover:text-night'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('pl')}
              className={`px-2.5 py-1 text-[0.65rem] font-sans font-medium tracking-wider transition-all duration-300 rounded-full ${
                lang === 'pl'
                  ? 'bg-white text-night shadow-subtle'
                  : 'text-clay hover:text-night'
              }`}
            >
              PL
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-night p-1.5"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {menuOpen ? (
                <path d="M4 4L16 16M4 16L16 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              ) : (
                <>
                  <line x1="2" y1="5" x2="18" y2="5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  <line x1="2" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  <line x1="2" y1="15" x2="18" y2="15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream/95 backdrop-blur-xl border-t border-stone/20 px-6 py-5">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block text-earth hover:text-mer font-sans text-sm py-3 border-b border-stone/20 last:border-0 transition-colors"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
