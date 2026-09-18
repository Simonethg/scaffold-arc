# Playground screenshots

Current files (USDC use cases + i18n flag switcher + mascot header):

- `playground-usdc-desktop.png` — viewport 1440×900 (full page)
- `playground-usdc-mobile.png` — viewport 390×844 (full page)

## How to regenerate

1. In one terminal, from the monorepo root:

```bash
yarn nextjs:dev
```

2. In another terminal (with the server at `http://localhost:3000`):

```bash
npx playwright install chromium   # once
yarn screenshots
```

The script [`scripts/capture-playground.mjs`](../../scripts/capture-playground.mjs) writes both PNGs into this directory.

Referenced from the root README and `packages/nextjs/README.md`.
