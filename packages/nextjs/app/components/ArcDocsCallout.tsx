"use client";

import { useI18n, type MessageKey } from "@/lib/i18n/I18nProvider";
import { ARC_DOCS } from "@/lib/arcDocs";

type ArcDocsCalloutProps = {
  testId: string;
  blurbKey: MessageKey;
  primaryHref: string;
  primaryLinkKey: MessageKey;
  primaryLinkTestId: string;
};

export function ArcDocsCallout({
  testId,
  blurbKey,
  primaryHref,
  primaryLinkKey,
  primaryLinkTestId,
}: ArcDocsCalloutProps) {
  const { t } = useI18n();

  return (
    <aside
      className="arc-docs-callout"
      data-testid={testId}
      aria-label={t("arcDocsCalloutLabel")}
    >
      <p className="muted" style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
        {t(blurbKey)}
      </p>
      <p className="arc-docs-links">
        <a
          href={primaryHref}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={primaryLinkTestId}
        >
          {t(primaryLinkKey)}
        </a>
        <span aria-hidden="true"> · </span>
        <a
          href={ARC_DOCS.home}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={`${testId}-home`}
        >
          {t("arcDocsHomeLink")}
        </a>
      </p>
    </aside>
  );
}
