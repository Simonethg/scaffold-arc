"use client";

import Image from "next/image";
import { UsdcPlayground } from "./components/UsdcPlayground";
import { LocaleSwitcher } from "./components/LocaleSwitcher";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="shell">
      <header className="site-header" data-testid="site-header">
        <div className="header-brand">
          <a
            href="https://simonethg.com"
            target="_blank"
            rel="noopener noreferrer"
            className="brand-mascot-link"
            data-testid="brand-link"
          >
            <Image
              src="/brand/mascot-face-yellow.png"
              alt={t("brandMascotAlt")}
              width={40}
              height={40}
              className="brand-mascot"
              data-testid="brand-mascot"
              priority
            />
          </a>
          <p className="product-name" data-testid="product-name">
            {t("productName")}
          </p>
        </div>
        <div className="header-actions">
          <LocaleSwitcher />
          <a
            href="https://github.com/Simonethg/scaffold-arc"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="repo-link"
          >
            {t("github")}
          </a>
        </div>
      </header>

      <main id="contenido-principal">
        <section className="hero" data-testid="hero">
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroLede")}</p>
        </section>

        <UsdcPlayground />
      </main>

      <footer className="site-footer" data-testid="site-footer">
        <p>
          {t("poweredBy")}{" "}
          <a
            href="https://academiaqa.com"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="academiaqa-link"
          >
            AcademiaQA.com
          </a>
        </p>
      </footer>
    </div>
  );
}
