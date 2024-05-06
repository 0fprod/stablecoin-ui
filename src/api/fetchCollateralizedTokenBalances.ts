import { dscEngineABI } from '../constants/dscengine.abi';
import { dscEngineAddress } from '../constants/addresses';

import { Hex, createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

export const fetchCollateralizedTokenBalance = async (tokenAddress: Hex, account: Hex) => {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(import.meta.env.VITE_RPC_URL)
  });

  const data = await publicClient.readContract({
    address: dscEngineAddress,
    abi: dscEngineABI,
    functionName: 'getCollateralDeposit',
    account,
    args: [tokenAddress]
  });

  return data as bigint;
};

export const getCollateralValueInUsd = async (priceFeedAddress: Hex, tokenAmount: bigint) => {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(import.meta.env.VITE_RPC_URL)
  });

  const data = await publicClient.readContract({
    address: dscEngineAddress,
    abi: dscEngineABI,
    functionName: 'getUSDValue',
    args: [priceFeedAddress, tokenAmount]
  });

  return data as bigint;
}