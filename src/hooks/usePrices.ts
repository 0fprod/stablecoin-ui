import { useState, useEffect } from "react";
import { fetchPrices } from "../api/fetchPrices";

export const usePrices = () => {
  const [linkPrice, setLinkPrice] = useState<bigint>(0n);
  const [ethPrice, setEthPrice] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  const updatePrices = async () => {
    setIsLoading(true);
    const { ethPrice, linkPrice } = await fetchPrices();

    setLinkPrice(linkPrice);
    setEthPrice(ethPrice);
    setIsLoading(false);
  }


  useEffect(() => {
    const fetchEthAndLinkPrices = async () => {
      await updatePrices();
    }

    fetchEthAndLinkPrices();
  }, []);

  return { linkPrice, ethPrice, updatePrices, isLoading };
}