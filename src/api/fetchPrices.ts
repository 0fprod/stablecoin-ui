import { priceFeedAbi } from '../constants/pricefeed.abi';
import { linkUsdPriceFeedAddress, wEthUsdPriceFeedAddress } from '../constants/addresses';

import { createPublicClient, http } from 'viem';
import { anvil } from 'viem/chains';

export const fetchPrices = async () => {
  const publicClient = createPublicClient({
    chain: anvil,
    transport: http(import.meta.env.VITE_RPC_URL)
  });

  const linkPrice = await publicClient.readContract({
    address: linkUsdPriceFeedAddress,
    abi: priceFeedAbi,
    functionName: 'latestAnswer',
    args: [],
  });

  const ethPrice = await publicClient.readContract({
    address: wEthUsdPriceFeedAddress,
    abi: priceFeedAbi,
    functionName: 'latestAnswer',
    args: [],
  });


  return { linkPrice, ethPrice };
}