import { useCallback, useEffect, useState } from 'react';
import { Hex } from 'viem';
import { linkTokenAddress, wEthTokenAddress } from '../constants/addresses';
import { fetchCollateralizedTokenBalance } from '../api/fetchCollateralizedTokenBalances';

export const useCollateralBalances = (account?: Hex) => {
  const [linkCollateralBalance, setLinkCollateralBalance] = useState<bigint>(0n);
  const [wEthCollateralBalance, setWEthCollateralBalance] = useState<bigint>(0n);
  const [isLoadingCollaterals, setIsLoadingCollaterals] = useState<boolean>(true);

  const updateCollateralBalances = useCallback(async () => {
    if (account === undefined) return;
    setIsLoadingCollaterals(true);
    const linkCollateralBalance = await fetchCollateralizedTokenBalance(linkTokenAddress, account);
    const wEthCollateralBalance = await fetchCollateralizedTokenBalance(wEthTokenAddress, account);

    setLinkCollateralBalance(linkCollateralBalance);
    setWEthCollateralBalance(wEthCollateralBalance);
    setIsLoadingCollaterals(false);
  }, [account]);

  useEffect(() => {
    updateCollateralBalances();
  }, [updateCollateralBalances]);

  return { linkCollateralBalance, wEthCollateralBalance, isLoadingCollaterals, updateCollateralBalances };
}
