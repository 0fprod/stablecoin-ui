import { useCallback, useEffect, useState } from "react";
import { fetchCirculatingSupply, fetchHealthFactor, fetchHolders } from "../api/fetchStats";
import { Hex } from "viem";

export const useStats = (account?: Hex) => {
  const [circulatingSupply, setCirculatingSupply] = useState<bigint>(0n);
  const [holders, setHolders] = useState<bigint>(0n);
  const [healthFactor, setHealthFactor] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const circulatingSupply = await fetchCirculatingSupply();
    const holders = await fetchHolders();
    const healthFactor = account ? await fetchHealthFactor(account) : BigInt(0);

    setCirculatingSupply(circulatingSupply);
    setHolders(holders);
    setHealthFactor(healthFactor);
    setIsLoading(false);
  }, [account]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { circulatingSupply, holders, healthFactor, isLoading, fetchStats };
}