// export const formatHealthFactor = (factor: bigint): string => {
//   const formatted = (Number(factor) / 10 ** 18).toFixed(2);
//   return BigInt(formatted.toString());
// };

import { formatUnits } from "viem";

// export a function that receives 129000 or 10000 and returns 129,000 $ or 10,000 $
export const formatUsd = (amount: bigint): string => {
  const units = formatUnits(amount, 18)
  return Number(units).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}