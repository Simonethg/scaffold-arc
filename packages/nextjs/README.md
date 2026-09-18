# @scaffold-arc/nextjs

**Powered by [AcademiaQA.com](https://academiaqa.com)**

## Para todos

Pantalla de prueba de **scaffold-arc** con marca [Simonethg](https://simonethg.com). Tres historias en español:

1. **Te pagan o pagás en USDC** — sueldo, factura o café; un solo saldo en dólares.
2. **¿Te alcanzó el pago?** — template de Ethereum vs pago completo en Arc.
3. **Mandás un pago: ¿cuánto gas?** — fee en USDC, con aviso si estás bajo el piso de 20 Gwei.

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

Brand CSS: `app/globals.css`. Selectores de test: `data-testid`.

Regenerar capturas (con el dev server arriba):

```bash
npx playwright install chromium   # una vez
yarn screenshots
```

**Powered by [AcademiaQA.com](https://academiaqa.com)**
