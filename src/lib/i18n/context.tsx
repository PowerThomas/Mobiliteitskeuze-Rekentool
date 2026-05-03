'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Locale, Translations, locales, nl } from './translations';

type LocaleContextValue = {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'nl',
  t: nl,
  setLocale: () => undefined,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('nl');

  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null;
    if (stored && stored in locales) {
      setLocaleState(stored);
      return;
    }
    // Auto-detect from browser language when no explicit preference is stored.
    const browserLang = navigator.language ?? '';
    if (browserLang.startsWith('en')) {
      setLocaleState('en');
    }
    // Otherwise keep 'nl' (the initial state default).
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem('locale', next);
    document.documentElement.lang = next;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, t: locales[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
