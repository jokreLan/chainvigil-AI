"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultLocale, localeCookieName, normalizeLocale, type Locale } from "./config";
import { translate, type MessageKey } from "./messages";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function writeLocale(locale: Locale) {
  try {
    window.localStorage.setItem(localeCookieName, locale);
  } catch {
    // ignore
  }
  document.cookie = `${localeCookieName}=${locale}; path=/; max-age=31536000; samesite=lax`;
  document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale?: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? defaultLocale);

  useEffect(() => {
    if (initialLocale) {
      setLocaleState(initialLocale);
      writeLocale(initialLocale);
      return;
    }
    try {
      const stored = window.localStorage.getItem(localeCookieName);
      if (stored) {
        const next = normalizeLocale(stored);
        setLocaleState(next);
        writeLocale(next);
        return;
      }
    } catch {
      // ignore
    }
    writeLocale(locale);
  }, [initialLocale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeLocale(next);
  }, []);

  const t = useCallback((key: MessageKey) => translate(locale, key), [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: defaultLocale as Locale,
      setLocale: (_locale: Locale) => undefined,
      t: (key: MessageKey) => translate(defaultLocale, key),
    };
  }
  return ctx;
}

export function useT() {
  return useLocale().t;
}
