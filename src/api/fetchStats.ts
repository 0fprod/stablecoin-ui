import { Hex, createPublicClient, http } from 'viem';
import { dscoinabi } from '../constants/dscoin.abi';
import { dscoinAddress as address, dscEngineAddress } from "../constants/addresses";
import { sepolia } from 'viem/chains';
import { dscEngineABI } from '../constants/dscengine.abi';


export const fetchCirculatingSupply = async (): Promise<bigint> => {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(import.meta.env.VITE_RPC_URL)
  })

  const data = await publicClient.readContract({
    address,
    abi: dscoinabi,
    functionName: 'circulatingSupply',
  })

  return data as bigint
};

export const fetchHolders = async (): Promise<bigint> => {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(import.meta.env.VITE_RPC_URL)
  })

  const data = await publicClient.readContract({
    address,
    abi: dscoinabi,
    functionName: 'totalHolders',
  })

  return data as bigint
};

export const fetchHealthFactor = async (account: Hex): Promise<bigint> => {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(import.meta.env.VITE_RPC_URL)
  })

  const data = await publicClient.readContract({
    address: dscEngineAddress,
    abi: dscEngineABI,
    functionName: 'getHealthFactor',
    args: [account]
  })

  const maxHealthFactor = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;
  if (data == maxHealthFactor) return BigInt(0);

  return data as bigint
}