/** Mirrors packages/foundry/src/UsdcUnits.sol + Usdc.sol fee helpers for the playground. */

export const NATIVE_DECIMALS = 18;
export const ERC20_DECIMALS = 6;
export const SCALE = 10n ** BigInt(NATIVE_DECIMALS - ERC20_DECIMALS); // 1e12
export const MIN_MAX_FEE_PER_GAS_GWEI = 20n;
export const GWEI = 10n ** 9n;

/** Whole USDC (e.g. 1.5) → ERC-20 units (6 decimals). */
export function fromWholeUsdc(whole: string): bigint | null {
  const trimmed = whole.trim();
  if (!/^\d+(\.\d{1,6})?$/.test(trimmed)) return null;
  const [intPart, frac = ""] = trimmed.split(".");
  const fracPadded = (frac + "000000").slice(0, 6);
  try {
    return BigInt(intPart) * 10n ** 6n + BigInt(fracPadded);
  } catch {
    return null;
  }
}

export function erc20ToNative(erc20Amount: bigint): bigint {
  return erc20Amount * SCALE;
}

export function nativeToErc20(nativeAmount: bigint): bigint {
  return nativeAmount / SCALE;
}

/** Naive Ethereum port: compare raw msg.value (18d) to ERC-20 amount (6d). */
export function naiveValueCoversErc20(msgValue: bigint, requiredErc20: bigint): boolean {
  return msgValue >= requiredErc20;
}

export function nativeCoversErc20(nativeAmount: bigint, requiredErc20: bigint): boolean {
  return nativeToErc20(nativeAmount) >= requiredErc20;
}

export function feeErc20(gasLimit: bigint, maxFeePerGasWei: bigint): bigint {
  return nativeToErc20(gasLimit * maxFeePerGasWei);
}

export function formatErc20(amount: bigint): string {
  const neg = amount < 0n;
  const v = neg ? -amount : amount;
  const whole = v / 10n ** 6n;
  const frac = (v % 10n ** 6n).toString().padStart(6, "0").replace(/0+$/, "");
  const body = frac ? `${whole}.${frac}` : `${whole}`;
  return neg ? `-${body}` : body;
}

export function formatUsd(amountErc20: bigint): string {
  return `$${formatErc20(amountErc20)} USDC`;
}
