import { Hex } from "viem";

export interface GqlHolder {
  user: Hex;
  id: Hex;
  balance: bigint;
}

