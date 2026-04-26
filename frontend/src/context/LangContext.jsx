import { createContext, useContext, useState } from 'react'

export const LANGS = [
  { code: 'es',  label: 'ES',      full: 'Español'  },
  { code: 'nah', label: 'NAH',     full: 'Náhuatl'  },
  { code: 'tot', label: 'TOT',     full: 'Totonaco' },
]

const LangContext = createContext({ lang: 'es', setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem('cv-lang') || 'es'
  )

  function changeLang(code) {
    setLang(code)
    localStorage.setItem('cv-lang', code)
  }

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
