# Capturas del playground

Archivos actuales (casos de uso USDC + switcher de banderas i18n + mascota en header):

- `playground-usdc-desktop.png` — viewport 1440×900 (full page)
- `playground-usdc-mobile.png` — viewport 390×844 (full page)

## Cómo regenerarlas

1. En una terminal, desde la raíz del monorepo:

```bash
yarn nextjs:dev
```

2. En otra terminal (con el servidor en `http://localhost:3000`):

```bash
npx playwright install chromium   # una vez
yarn screenshots
```

El script [`scripts/capture-playground.mjs`](../../scripts/capture-playground.mjs) escribe ambos PNG en este directorio.

Referenciadas desde el README raíz y `packages/nextjs/README.md`.
