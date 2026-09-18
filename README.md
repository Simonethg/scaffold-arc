# scaffold-arc

**Fork this to ship on Arc.** Your Ethereum template will not survive here unchanged — on Arc the native token *is* USDC, and copying EVM boilerplate written for ETH will silently double your balances on screen or strand your transactions in the mempool.

scaffold-arc is a permissionless starter for [Arc](https://docs.arc.io/), Circle's L1 where USDC is the native gas token. No Circle API key, no Supabase, no managed wallets required: MetaMask + the public faucet is enough to go from clone to deployed contract.

> Status: early and moving daily. `v0.1` (forkable template with a working Memo payment example on mainnet) lands this week. See the [roadmap](#roadmap) for what exists today vs. what is coming.

## Why your Ethereum template will not work

Arc is EVM-compatible (Osaka baseline) — Solidity, Foundry, viem and wagmi all work. What breaks is every assumption about the native token. These are the four footguns this scaffold exists to neutralize:

### 1. USDC has 18 decimals natively and 6 on the ERC-20 interface — same funds

`msg.value` and the native balance use **18 decimals**. `USDC.balanceOf()` (ERC-20 at `0x3600…0000`) returns **6 decimals**. They are two views over the **same balance** — there is no wrapped USDC on Arc.

```solidity
// WRONG (naive Ethereum port): off by 10^12
require(usdc.balanceOf(user) >= msg.value, "insufficient");

// The ERC-20 view also truncates sub-USDC dust:
// a native balance of 0.0000009 USDC reads as balanceOf == 0.
```

Never mix the two units in pool math, LTV checks, or balance displays. Never render "native USDC" and "ERC-20 USDC" as two balance rows — that shows users double their money.

### 2. The mempool enforces a 20 Gwei floor — below it, transactions vanish

Transactions with `maxFeePerGas < 20 gwei` are **silently dropped**: no error, no receipt, never mined. Foundry, ethers and viem defaults can land below the floor on a quiet chain.

```bash
forge script script/Deploy.s.sol --rpc-url arc_testnet --broadcast --with-gas-price 20gwei
```

Fees are denominated in USDC, so show them to users in dollars (target: ~$0.001 per ERC-20 transfer), not in Gwei.

### 3. Value transfers can revert for reasons that do not exist on Ethereum

- Sending value to `address(0)` **reverts** (burning the native USDC is forbidden).
- Transfers to or from **blocklisted addresses revert at runtime** — and a reverted blocklist transfer still consumes gas.
- Sending value to a contract that already self-destructed **reverts** (treated as a forbidden burn).
- `SELFDESTRUCT` on a contract holding USDC **moves that USDC** to the beneficiary (it is the account's native balance, not an ERC-20 entry).

Testnet seeds a known blocklisted address (`0x7099…79C8`, index 1 of the standard test mnemonic) so you can exercise these reverts — it is in [`deployments/addresses.json`](deployments/addresses.json).

### 4. No onchain randomness, no blobs, instant finality

`PREVRANDAO` always returns `0` (use a VRF or oracle). Blob transactions (EIP-4844) are rejected. Finality is deterministic in under a second: one confirmation is final, no reorg handling needed — fire your webhooks immediately.

Full reference: [Arc EVM differences](https://docs.arc.io/arc/references/evm-differences).

## Network details

| | Arc Mainnet | Arc Testnet |
|---|---|---|
| Chain ID | `5042` | `5042002` |
| RPC | `https://rpc.mainnet.arc.io` | `https://rpc.testnet.arc.io` |
| Explorer | [explorer.arc.io](https://explorer.arc.io) | [testnet.arcscan.app](https://testnet.arcscan.app) |
| Gas token | USDC (native 18d / ERC-20 6d) | USDC (native 18d / ERC-20 6d) |
| Faucet | — | [faucet.circle.com](https://faucet.circle.com) |
| viem chain | `import { arc } from "viem/chains"` | `import { arcTestnet } from "viem/chains"` |

Canonical predeployed contracts (Memo, Multicall3From, Permit2, Multicall3, CREATE2 factory, USDC, EURC) live in [`deployments/addresses.json`](deployments/addresses.json) — import them instead of copy-pasting from docs.

## Quickstart

Requirements: Node 20+, Yarn, [Foundry](https://getfoundry.sh).

```bash
git clone https://github.com/Simonethg/scaffold-arc.git
cd scaffold-arc
yarn foundry:build
yarn foundry:test
```

To deploy against Arc Testnet you will need testnet USDC for gas: request it at [faucet.circle.com](https://faucet.circle.com) (select Arc Testnet), then:

```bash
cp packages/foundry/.env.example packages/foundry/.env   # add your PRIVATE_KEY
```

## What's inside

```
packages/
├── foundry/    # Solidity contracts, Arc-aware config, decimal-safety tests
├── sdk/        # (D2+) parseUsdc, gas floor guard, fee-in-USD, Memo encoding, arc:pay spec
└── nextjs/     # (D3+) wallet UI with a SINGLE USDC balance and fees shown in USD
deployments/    # canonical Arc contract addresses, importable JSON
```

The only Solidity shipped today is [`UsdcUnits`](packages/foundry/src/UsdcUnits.sol) — the seed of the USDC decimal-safety library — with [tests](packages/foundry/test/UsdcUnits.t.sol) that encode footgun #1 as executable documentation.

## Roadmap

Daily pushes; one usable deliverable per week.

- [x] **D1** — Monorepo, Arc network config, footguns README, decimal-safety seed
- [ ] **D2** — `Usdc.sol` library + tests that fail on naive Ethereum ports
- [ ] **D3** — Next.js + wagmi: wallet connect, single USDC balance
- [ ] **D4** — Gas helper: 20 Gwei floor guard, fees displayed in USD
- [ ] **D5** — `MemoPayment` example: pay USDC with an invoice ID via the predeployed Memo contract
- [ ] **D6** — Mainnet deploy via CREATE2 + Blockscout verification
- [ ] **D7** — `v0.1`: GitHub Template enabled, fork-to-ship README
- [ ] **v0.2** (week 3) — batch pay via Multicall3From, `arc:pay` payment-request spec + QR, Permit2/ERC-20 revoke component, Playwright e2e + axe-core in CI, tokenlist
- [ ] **v0.3** (week 4) — canonical EAS deployment on Arc, splits + transparent treasury example

## Testing & accessibility

Contracts: Foundry (`yarn foundry:test`). Every UI component that lands in `packages/nextjs` from D3 onward ships with `data-testid` selectors and is scanned with axe-core **scoped to the component** at 390 px and 1440 px viewports; critical and serious violations block merge (WCAG 2.1/2.2 AA). Playwright e2e and the full CI pipeline arrive with v0.2.

## License

[MIT](LICENSE)
