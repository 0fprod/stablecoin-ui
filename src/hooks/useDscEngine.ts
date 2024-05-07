/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';

import {
  aproveAndDepositCollateral,
  burnDsc,
  mintDsc,
  redeemCollateral,
  getMaxMintableDsc,
  listenToMint,
  listentToBurn,
  getHealthFactor,
  liquidate,
} from '../api/walletActions';
import { Hex } from 'viem';

export const useDscEngine = () => {
  const [isActionRunning, setIsActionRunning] = useState(false);

  const wrapAction = async (action: (...args: any[]) => Promise<any>): Promise<any> => {
    setIsActionRunning(true);
    return action()
      .finally(() => setIsActionRunning(false));
  };

  const registerMintListener = useCallback(async (account: Hex, callback: (data: any) => void) => {
    const unregister = await listenToMint(account, callback);
    return () => unregister();
  }, []);

  const registerBurnListener = useCallback(async (account: Hex, callback: (data: any) => void) => {
    const unregister = await listentToBurn(account, callback);
    return () => unregister();
  }, []);

  return {
    isActionRunning,
    redeemCollateral: (tokenAddress: Hex, account: Hex, amount: bigint) =>
      wrapAction(() => redeemCollateral(tokenAddress, account, amount)),
    aproveAndDepositCollateral: (tokenAddress: Hex, account: Hex, amount: bigint) =>
      wrapAction(() => aproveAndDepositCollateral(tokenAddress, account, amount)),
    getMaxMintableDsc: (account: Hex) => wrapAction(() => getMaxMintableDsc(account)),
    mintDsc: (account: Hex, amount: bigint) => wrapAction(() => mintDsc(account, amount)),
    burnDsc: (account: Hex, amount: bigint) => wrapAction(() => burnDsc(account, amount)),
    registerMintListener,
    registerBurnListener,
    getHealthFactor: (account: Hex) => wrapAction(() => getHealthFactor(account)),
    liquidate: (insolventUser: Hex, collateralAddress: Hex, dscToBurn: bigint) => wrapAction(() => liquidate(insolventUser, collateralAddress, dscToBurn)),
  };
};
