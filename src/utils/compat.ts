import Decimal from 'decimal.js';

// Inline replacements for @kamino-finance/kliquidity-sdk imports.
// kliquidity-sdk transitively imports @orca-so/whirlpools-core which ships a .wasm
// that is fatal for Metro/Hermes bundlers. These implementations match the
// signatures used across this SDK without pulling in the wasm dependency.

export async function batchFetch<T, R>(
  items: T[],
  fetchFn: (chunk: T[]) => Promise<R[]>,
  chunkSize = 100
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const fetched = await fetchFn(items.slice(i, i + chunkSize));
    results.push(...fetched);
  }
  return results;
}

export function chunks<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function collToLamportsDecimal(amount: Decimal, decimals: number): Decimal {
  return amount.mul(new Decimal(10).pow(decimals));
}

export const DECIMALS_SOL = 9;

export function aprToApy(apr: Decimal, periods = 365): Decimal {
  if (apr.isZero()) return new Decimal(0);
  return new Decimal(1).add(apr.div(periods)).pow(periods).sub(1);
}

export type MintToPriceMap = {
  [mint: string]: { price: Decimal; name: string };
};

export type KaminoPrices = {
  spot: MintToPriceMap;
  twap: MintToPriceMap;
};
