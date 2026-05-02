'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Language = 'en' | 'si'

type LanguageContextValue = {
  language: Language
  isSinhala: boolean
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const saved = window.localStorage.getItem('siyowin-language')
    if (saved === 'si' || saved === 'en') {
      setLanguage(saved)
    }
  }, [])

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    isSinhala: language === 'si',
    toggleLanguage: () => {
      setLanguage((current) => {
        const next = current === 'en' ? 'si' : 'en'
        window.localStorage.setItem('siyowin-language', next)
        return next
      })
    },
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    return {
      language: 'en' as const,
      isSinhala: false,
      toggleLanguage: () => {},
    }
  }

  return context
}
