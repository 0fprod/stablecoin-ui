import { useEffect, useState } from 'react';
import { Hex } from 'viem';
import { linkTokenAddress, wEthTokenAddress } from '../constants/addresses';
import { fetchCollateralizedTokenBalance } from '../api/fetchCollateralizedTokenBalances';

export const useCollateralBalances = (account?: Hex) => {
  const [linkCollateralBalance, setLinkCollateralBalance] = useState<bigint>(0n);
  const [wEthCollateralBalance, setWEthCollateralBalance] = useState<bigint>(0n);

  useEffect(() => {
    const fetchCollateralBalances = async () => {
      if (account === undefined) return;

      const linkCollateralBalance = await fetchCollateralizedTokenBalance(linkTokenAddress, account);
      const wEthCollateralBalance = await fetchCollateralizedTokenBalance(wEthTokenAddress, account);

      setLinkCollateralBalance(linkCollateralBalance);
      setWEthCollateralBalance(wEthCollateralBalance);
    };

    fetchCollateralBalances();
  }, [account]);

  return { linkCollateralBalance, wEthCollateralBalance };
}
