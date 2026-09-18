export const LOCALES = ["en", "es", "pt-BR", "zh", "ar"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "scaffold-arc-locale";

export const LOCALE_META: Record<
  Locale,
  { flag: string; label: string; dir: "ltr" | "rtl"; htmlLang: string }
> = {
  en: { flag: "🇬🇧", label: "English", dir: "ltr", htmlLang: "en" },
  es: { flag: "🇦🇷", label: "Español (Argentina)", dir: "ltr", htmlLang: "es" },
  "pt-BR": {
    flag: "🇧🇷",
    label: "Português (Brasil)",
    dir: "ltr",
    htmlLang: "pt-BR",
  },
  zh: { flag: "🇨🇳", label: "中文", dir: "ltr", htmlLang: "zh-CN" },
  ar: { flag: "🇸🇦", label: "العربية", dir: "rtl", htmlLang: "ar" },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** Prefer es / pt-BR from browser, otherwise English. */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const candidates = [
    navigator.language,
    ...(navigator.languages ?? []),
  ].filter(Boolean);

  for (const raw of candidates) {
    const lower = raw.toLowerCase();
    if (lower.startsWith("es")) return "es";
    if (lower.startsWith("pt")) return "pt-BR";
    if (lower.startsWith("zh")) return "zh";
    if (lower.startsWith("ar")) return "ar";
    if (lower.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}
