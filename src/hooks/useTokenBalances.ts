import { useCallback, useEffect, useState } from "react";
import { Hex } from "viem";
import { linkTokenAddress, wEthTokenAddress, dscoinAddress } from "../constants/addresses";
import { fetchTokenBalance } from "../api/walletActions";
import { fetchCollateralizedTokenBalance } from "../api/fetchCollateralizedTokenBalances";

export const useTokenBalances = (account: Hex) => {
  // Token balances
  const [linkBalance, setLinkBalance] = useState<bigint>(0n);
  const [wEthBalance, setWEthBalance] = useState<bigint>(0n);
  const [dscBalance, setDscBalance] = useState<bigint>(0n);
  const [linkCollateralBalance, setLinkCollateralBalance] = useState<bigint>(0n);
  const [wEthCollateralBalance, setWEthCollateralBalance] = useState<bigint>(0n);
  // Loading states
  const [isLoadingLinkBalance, setIsLoadingLinkBalance] = useState<boolean>(true);
  const [isLoadingWEthBalance, setIsLoadingWEthBalance] = useState<boolean>(true);
  const [isLoadingDscBalance, setIsLoadingDscBalance] = useState<boolean>(true);
  const [isLoadingLinkCollateral, setIsLoadingLinkCollateral] = useState<boolean>(true);
  const [isLoadingWEthCollateral, setIsLoadingWEthCollateral] = useState<boolean>(true);

  const updateBalance = useCallback(async (tokenAddress: Hex, setBalanceFn: (balance: bigint) => void, setIsLoadingFn: (isLoading: boolean) => void, fetchBalanceFn: (tokenAddress: Hex, account: Hex) => Promise<bigint>) => {
    setIsLoadingFn(true);
    fetchBalanceFn(tokenAddress, account)
      .then(balance => {
        setBalanceFn(balance);
        setIsLoadingFn(false);
      })
      .finally(() => {
        setIsLoadingFn(false);
      });
  }, [account]);

  const refreshAllWalletBalances = useCallback(async () => {
    setIsLoadingLinkBalance(true);
    setIsLoadingWEthBalance(true);
    setIsLoadingDscBalance(true);

    updateBalance(linkTokenAddress, setLinkBalance, setIsLoadingLinkBalance, fetchTokenBalance);
    updateBalance(wEthTokenAddress, setWEthBalance, setIsLoadingWEthBalance, fetchTokenBalance);
    updateBalance(dscoinAddress, setDscBalance, setIsLoadingDscBalance, fetchTokenBalance);
  }, [updateBalance]);

  const refreshAllCollateralBalances = useCallback(async () => {
    setIsLoadingLinkCollateral(true);
    setIsLoadingWEthCollateral(true);

    await updateBalance(linkTokenAddress, setLinkCollateralBalance, setIsLoadingLinkCollateral, fetchCollateralizedTokenBalance);
    await updateBalance(wEthTokenAddress, setWEthCollateralBalance, setIsLoadingWEthCollateral, fetchCollateralizedTokenBalance);
  }, [updateBalance]);

  const updateTokenBalance = useCallback((tokenAddress: Hex) => {
    if (tokenAddress === linkTokenAddress) {
      setIsLoadingLinkBalance(true);
      return updateBalance(linkTokenAddress, setLinkBalance, setIsLoadingLinkBalance, fetchTokenBalance);
    } else if (tokenAddress === wEthTokenAddress) {
      setIsLoadingWEthBalance(true);
      return updateBalance(wEthTokenAddress, setWEthBalance, setIsLoadingWEthBalance, fetchTokenBalance);
    } else if (tokenAddress === dscoinAddress) {
      setIsLoadingDscBalance(true);
      return updateBalance(dscoinAddress, setDscBalance, setIsLoadingDscBalance, fetchTokenBalance);
    }
  }, [updateBalance]);

  const updateCollateralBalance = useCallback((tokenAddress: Hex) => {
    if (tokenAddress === linkTokenAddress) {
      setIsLoadingLinkCollateral(true);
      return updateBalance(linkTokenAddress, setLinkCollateralBalance, setIsLoadingLinkCollateral, fetchCollateralizedTokenBalance);
    } else if (tokenAddress === wEthTokenAddress) {
      setIsLoadingWEthCollateral(true);
      return updateBalance(wEthTokenAddress, setWEthCollateralBalance, setIsLoadingWEthCollateral, fetchCollateralizedTokenBalance);
    }
  }, [updateBalance]);

  useEffect(() => {
    refreshAllWalletBalances();
    refreshAllCollateralBalances();
  }, [refreshAllWalletBalances, refreshAllCollateralBalances]);

  return {
    linkBalance,
    wEthBalance,
    dscBalance,
    linkCollateralBalance,
    wEthCollateralBalance,
    isLoadingLinkBalance,
    isLoadingWEthBalance,
    isLoadingDscBalance,
    isLoadingLinkCollateral,
    isLoadingWEthCollateral,
    refreshAllWalletBalances,
    refreshAllCollateralBalances,
    updateTokenBalance,
    updateCollateralBalance
  };
};
