'use client'

import { useLang } from '@/components/LanguageProvider'

export default function FloatingLangPicker() {
  const { lang, setLang, hasChosen } = useLang()

  if (hasChosen) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="flex gap-1 bg-night/90 backdrop-blur-xl rounded-full p-1 border border-cream/10 shadow-lg">
        <button
          onClick={() => setLang('en')}
          className={`px-4 py-2 text-xs font-sans font-medium tracking-wider transition-all duration-300 rounded-full ${
            lang === 'en'
              ? 'bg-cream text-night'
              : 'text-cream/50 hover:text-cream'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLang('pl')}
          className={`px-4 py-2 text-xs font-sans font-medium tracking-wider transition-all duration-300 rounded-full ${
            lang === 'pl'
              ? 'bg-cream text-night'
              : 'text-cream/50 hover:text-cream'
          }`}
        >
          PL
        </button>
      </div>
    </div>
  )
}
