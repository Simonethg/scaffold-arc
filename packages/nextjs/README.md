# @scaffold-arc/nextjs

**Powered by [AcademiaQA.com](https://academiaqa.com)**

## Para todos

Pantalla de prueba de **scaffold-arc**. En el header: mascota (sin nombre personal) + selector de idioma **solo con banderas**. Cinco locales:

| Código | Idioma |
|---|---|
| `en` | English |
| `es` | Español (Argentina) 🇦🇷 |
| `pt-BR` | Português (Brasil) |
| `zh` | 中文 |
| `ar` | العربية (RTL) |

Tres ejemplos (traducidos):

1. **Te pagan o pagás en USDC** — sueldo, factura o café; un solo saldo en dólares.
2. **¿Te alcanzó el pago?** — template de Ethereum vs pago completo en Arc.
3. **Mandás un pago: ¿cuánto gas en dólares?** — costo de enviar la transacción en USDC; aviso si el precio del gas queda bajo el mínimo de 20 Gwei.

Capturas (desktop 1440 + móvil 390): ver [`docs/screenshots/`](../../docs/screenshots/).

## Para developers

```bash
# desde la raíz del monorepo
yarn
yarn nextjs:dev
# http://localhost:3000
```

Rutas:

- `/` — playground USDC (casos de uso sueldo / factura / fee)

i18n: `lib/i18n/` (dictionaries + `I18nProvider`). Brand CSS: `app/globals.css` (fallbacks CJK/Arabic documentados). Selectores: `data-testid` (`locale-switcher`, `brand-mascot`, …).

Regenerar capturas (con el dev server arriba):

```bash
npx playwright install chromium   # una vez
yarn screenshots
```

**Powered by [AcademiaQA.com](https://academiaqa.com)**
