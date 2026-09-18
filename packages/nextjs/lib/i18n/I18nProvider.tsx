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
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  LOCALE_STORAGE_KEY,
  detectBrowserLocale,
  isLocale,
  type Locale,
} from "./locales";
import en from "./dictionaries/en.json";
import es from "./dictionaries/es.json";
import ptBR from "./dictionaries/pt-BR.json";
import zh from "./dictionaries/zh.json";
import ar from "./dictionaries/ar.json";

export type MessageKey = keyof typeof en;

const DICTS: Record<Locale, Record<MessageKey, string>> = {
  en,
  es,
  "pt-BR": ptBR,
  zh,
  ar,
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, vars?: Record<string, string>) => string;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<I18nContextValue | null>(null);

function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  const meta = LOCALE_META[locale];
  document.documentElement.lang = meta.htmlLang;
  document.documentElement.dir = meta.dir;
  document.documentElement.dataset.locale = locale;
}

function interpolate(template: string, vars?: Record<string, string>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let initial = detectBrowserLocale();
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(stored)) initial = stored;
    } catch {
      // ignore storage errors
    }
    setLocaleState(initial);
    applyDocumentLocale(initial);
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    applyDocumentLocale(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  }, []);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string>) => {
      const dict = DICTS[locale] ?? DICTS.en;
      return interpolate(dict[key] ?? DICTS.en[key] ?? key, vars);
    },
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      dir: LOCALE_META[locale].dir,
    }),
    [locale, setLocale, t],
  );

  // Avoid a flash of wrong language after hydration; still render children.
  return (
    <I18nContext.Provider value={value}>
      <div suppressHydrationWarning data-i18n-ready={ready ? "true" : "false"}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
