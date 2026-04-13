'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Lang = 'en' | 'pl'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  hasChosen: boolean
}

const LanguageContext = createContext<LangCtx>({ lang: 'en', setLang: () => {}, hasChosen: false })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')
  const [hasChosen, setHasChosen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('lang')
    if (stored === 'en' || stored === 'pl') {
      setLangState(stored)
      setHasChosen(true)
    }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    setHasChosen(true)
    localStorage.setItem('lang', l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, hasChosen }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
