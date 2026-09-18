"use client";

import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n/locales";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className="locale-switcher"
      data-testid="locale-switcher"
      role="group"
      aria-label={t("localeSwitcherLabel")}
    >
      {LOCALES.map((code: Locale) => {
        const meta = LOCALE_META[code];
        const selected = locale === code;
        return (
          <button
            key={code}
            type="button"
            className="locale-flag"
            data-testid={`locale-${code}`}
            aria-label={meta.label}
            title={meta.label}
            aria-pressed={selected}
            onClick={() => setLocale(code)}
          >
            <span aria-hidden="true" className="locale-flag-emoji">
              {meta.flag}
            </span>
          </button>
        );
      })}
    </div>
  );
}
