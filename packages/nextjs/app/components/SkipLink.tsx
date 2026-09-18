"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";

export function SkipLink() {
  const { t } = useI18n();
  return (
    <a className="skip-link" href="#contenido-principal" data-testid="skip-to-content">
      {t("skipToContent")}
    </a>
  );
}
