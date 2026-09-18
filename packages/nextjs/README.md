# @scaffold-arc/nextjs

**Powered by [AcademiaQA.com](https://academiaqa.com)**

## Para todos

Pantalla de prueba de **scaffold-arc** — **muestra visual para equipos de producto**.

[Repo para developers](https://github.com/Simonethg/scaffold-arc).

En el header: mascota (sin nombre personal) + selector de idioma **solo con banderas**. Cinco locales:

| Código | Idioma |
|---|---|
| `en` | English |
| `es` | Español (Argentina) 🇦🇷 |
| `pt-BR` | Português (Brasil) |
| `zh` | 中文 |
| `ar` | العربية (RTL) |

Tres ejemplos educativos (traducidos: problema → mejora Arc → resultado en dólares):

1. **Un solo saldo USDC (no dos filas)** — en otras chains ves dos saldos; en Arc una sola fila en dólares (detalle técnico colapsado).
2. **¿Te alcanzó el pago?** — el template de Ethereum acepta una fracción; Arc exige el monto completo.
3. **Mandás un pago: ¿cuánto gas en dólares?** — gas en USDC (dólares previsibles); aviso si el precio queda bajo el mínimo de 20 Gwei.

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
