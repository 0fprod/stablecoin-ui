import { useEffect, useState } from "react";
import { Hex } from "viem";
import { linkTokenAddress, wEthTokenAddress, dscoinAddress } from "../constants/addresses";
import { fetchTokenBalance } from "../api/walletActions";

export const useWalletBalances = (account?: Hex) => {
  const [linkBalance, setLinkBalance] = useState<bigint>(0n);
  const [wEthBalance, setWEthBalance] = useState<bigint>(0n);
  const [dscBalance, setDscBalance] = useState<bigint>(0n);
  const [isLoadingWalletBalances, setIsLoadingWalletBalance] = useState<boolean>(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (account === undefined) return;
      setIsLoadingWalletBalance(true);
      const linkBalance = await fetchTokenBalance(linkTokenAddress, account);
      const wEthBalance = await fetchTokenBalance(wEthTokenAddress, account);
      const dscBalance = await fetchTokenBalance(dscoinAddress, account);

      setLinkBalance(linkBalance);
      setWEthBalance(wEthBalance);
      setDscBalance(dscBalance);
      setIsLoadingWalletBalance(false);
    };

    fetchBalances();
  }, [account]);

  return { linkBalance, wEthBalance, dscBalance, isLoadingWalletBalances };
}