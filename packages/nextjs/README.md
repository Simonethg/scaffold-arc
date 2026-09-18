# @scaffold-arc/nextjs

**Powered by [AcademiaQA.com](https://academiaqa.com)**

## For everyone

Test screen for **scaffold-arc** — a **visual sample for product teams**.

[Developer repo](https://github.com/Simonethg/scaffold-arc).

In the header: mascot (no personal name) + **flags-only** language switcher. Five locales:

| Code | Language |
|---|---|
| `en` | English |
| `es` | Español (Argentina) 🇦🇷 |
| `pt-BR` | Português (Brasil) |
| `zh` | 中文 |
| `ar` | العربية (RTL) |

Three educational examples (translated: problem → Arc improvement → dollar result):

1. **One USDC balance (not two rows)** — other chains show two balances; on Arc one dollar row (technical detail collapsed).
2. **Did the payment cover it?** — an Ethereum template accepts a fraction; Arc requires the full amount.
3. **You send a payment: how much gas in dollars?** — gas in USDC (predictable dollars); warning if the price sits under the 20 Gwei floor.

Screenshots (desktop 1440 + mobile 390): see [`docs/screenshots/`](../../docs/screenshots/).

## For developers

```bash
# from the monorepo root
yarn
yarn nextjs:dev
# http://localhost:3000
```

Routes:

- `/` — USDC playground (salary / invoice / fee use cases)

i18n: `lib/i18n/` (dictionaries + `I18nProvider`). Brand CSS: `app/globals.css` (CJK/Arabic fallbacks documented). Selectors: `data-testid` (`locale-switcher`, `brand-mascot`, …).

Regenerate screenshots (with the dev server running):

```bash
npx playwright install chromium   # once
yarn screenshots
```

**Powered by [AcademiaQA.com](https://academiaqa.com)**
