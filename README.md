# scaffold-arc

**Powered by [AcademiaQA.com](https://academiaqa.com)**

---

## For everyone

### What it is (plain language)

**scaffold-arc** is a starter kit for building apps on [Arc](https://docs.arc.io/), Circle’s blockchain where gas is paid in **USDC** (digital dollars), not ETH.

We ship **safe USDC helpers** (they avoid decimal and gas footguns) plus a **test playground**.

If you copy an Ethereum template as-is, you can:

- see **double money** on screen (because USDC shows up in two forms that are the same balance), or
- send transactions that **never appear** (because Arc enforces a minimum fee).

**For product:** the playground in `packages/nextjs` is a **visual sample** only — [Simonethg](https://simonethg.com) branding (mascot in the header, no personal-name wordmark) — with LatAm fintech-style examples.

**For developers:** code, tests, and docs live in the repo — [Developer repo](https://github.com/Simonethg/scaffold-arc).

### Languages (flag switcher)

The header has a flags-only switcher (`data-testid="locale-switcher"`). Locales:

| Code | Language |
|---|---|
| `en` | English |
| `es` | Español (Argentina) 🇦🇷 |
| `pt-BR` | Português (Brasil) |
| `zh` | 中文 |
| `ar` | العربية (RTL) |

The choice is stored in `localStorage`. Defaults: `es` / `pt-BR` from the browser when applicable, otherwise `en`.

### UI screenshots

Playground at `http://localhost:3000` (after `yarn nextjs:dev`):

![USDC playground — desktop](docs/screenshots/playground-usdc-desktop.png)

![USDC playground — mobile](docs/screenshots/playground-usdc-mobile.png)

> If the images are missing in your clone, see [`docs/screenshots/README.md`](docs/screenshots/README.md) to regenerate them (desktop 1440 + mobile 390).

### Playground use cases (no jargon)

| UI example | What you learn |
|---|---|
| **One USDC balance (not two rows)** | Problem: on Ethereum / templates you see two balances and it looks like double money. Arc fix: native USDC → **one dollar row**; don’t duplicate money on screen. |
| **Did the payment cover it?** | Problem: an Ethereum template uses the wrong scale and accepts a tiny fraction (you come up short). Arc fix: compare the **full USDC amount** before saying OK. |
| **You send a payment: how much gas in dollars?** | Problem: on other chains gas is paid in an unfamiliar token. Arc fix: the **send cost** is shown in **USDC / dollars**. If the price sits under the 20 Gwei floor, the transaction can vanish. |

No wallet required today — it’s a test calculator. MetaMask comes in the next deliverable.

---

## For developers

### Quickstart

Requirements: Node 20+, Yarn, [Foundry](https://getfoundry.sh).

```bash
git clone https://github.com/Simonethg/scaffold-arc.git
cd scaffold-arc
yarn
yarn foundry:test      # 17 Solidity tests
yarn nextjs:dev        # UI → http://localhost:3000
```

Forge only:

```bash
yarn foundry:build
yarn foundry:test
```

### What exists today

```
packages/
├── foundry/    # UsdcUnits + Usdc libs, naive-port tests
├── nextjs/     # Simonethg playground (USDC conversion / naive / fee)
└── sdk/        # placeholder
deployments/    # canonical Arc addresses JSON
docs/screenshots/
```

Solidity:

- [`UsdcUnits`](packages/foundry/src/UsdcUnits.sol) — 18↔6 conversion
- [`Usdc`](packages/foundry/src/Usdc.sol) — balances, transfer guards, fee math
- [`NaiveEthereumPort`](packages/foundry/src/examples/NaiveEthereumPort.sol) — wrong patterns for tests only

UI: [`packages/nextjs`](packages/nextjs) — i18n playground (`en` / `es` / `pt-BR` / `zh` / `ar`), flag switcher, mascot header, `data-testid`, brand tokens from simonethg.com.

### Network details

| | Arc Mainnet | Arc Testnet |
|---|---|---|
| Chain ID | `5042` | `5042002` |
| RPC | `https://rpc.mainnet.arc.io` | `https://rpc.testnet.arc.io` |
| Explorer | [explorer.arc.io](https://explorer.arc.io) | [testnet.arcscan.app](https://testnet.arcscan.app) |
| Gas token | USDC (native 18d / ERC-20 6d) | same |
| Faucet | — | [faucet.circle.com](https://faucet.circle.com) |

Addresses: [`deployments/addresses.json`](deployments/addresses.json).

### Why your Ethereum template will not work

1. **USDC 18 vs 6 decimals — same funds.** Never mix `msg.value` with `balanceOf`. Never show two USDC rows.
2. **20 Gwei floor.** Below it, txs are silently dropped.
3. **Value to `address(0)` / blocklist / self-destruct burns revert** on Arc.
4. **No onchain randomness** (`PREVRANDAO` = 0); finality &lt; 1s.

Full reference: [Arc EVM differences](https://docs.arc.io/arc/references/evm-differences).

### Roadmap

- [x] D1 — Monorepo, Arc config, footguns README
- [x] D2 — `Usdc.sol` + naive-port tests
- [x] UI playground (Simonethg) for USDC math / fee floor
- [x] i18n: `en`, `es`, `pt-BR`, `zh`, `ar` (RTL) + flag-only locale switcher
- [ ] D3 — wagmi wallet + single USDC balance
- [ ] D4 — gas helper in SDK
- [ ] D5 — MemoPayment example
- [ ] D6 — Mainnet CREATE2 + verify
- [ ] D7 — v0.1 GitHub Template
- [ ] v0.2 — batch pay, arc:pay, revoke, CI + axe
- [ ] v0.3 — EAS + splits

### Testing & accessibility

- Contracts: `yarn foundry:test`
- UI: `data-testid` primary; axe-core scoped to component at 390 px and 1440 px (critical/serious block merge). Automated axe CI arrives with v0.2.

### License

[MIT](LICENSE)

**Powered by [AcademiaQA.com](https://academiaqa.com)**
