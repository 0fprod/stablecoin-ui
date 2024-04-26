import { Hex, createPublicClient, createWalletClient, custom, http } from "viem"
import { sepolia } from "viem/chains"
import { erc20Abi } from "../constants/erc20.abi"
import { dscEngineABI } from "../constants/dscengine.abi"
import { dscEngineAddress } from "../constants/addresses"

export const fetchTokenBalance = async (tokenAddress: Hex, account: Hex) => {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(import.meta.env.VITE_RPC_URL)
  })

  const data = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account]
  })

  return data as bigint
}

export const approveToken = async (tokenAddress: Hex, account: Hex, amount: bigint) => {
  const publicWallet = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
    account,
  })

  const data = await publicWallet.writeContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: [dscEngineAddress, amount]
  })

  return data
}

export const depositCollateral = async (tokenAddress: Hex, account: Hex, amount: bigint) => {
  const publicWallet = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
    account
  })

  const data = await publicWallet.writeContract({
    account,
    address: dscEngineAddress,
    abi: dscEngineABI,
    functionName: 'depositCollateral',
    args: [tokenAddress, amount]
  })

  return data
}

export const redeemCollateral = async (tokenAddress: Hex, account: Hex, amount: bigint) => {
  const publicWallet = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
    account
  })

  const data = await publicWallet.writeContract({
    address: dscEngineAddress,
    abi: dscEngineABI,
    functionName: 'redeemCollateral',
    args: [tokenAddress, amount]
  })

  return data
}

export const mintDsc = async (account: Hex, amount: bigint) => {
  const publicWallet = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
    account
  })

  const data = await publicWallet.writeContract({
    address: dscEngineAddress,
    abi: dscEngineABI,
    functionName: 'mintDSC',
    args: [amount]
  })

  return data
}

export const burnDsc = async (account: Hex, amount: bigint) => {
  const publicWallet = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
    account
  })

  const data = await publicWallet.writeContract({
    address: dscEngineAddress,
    abi: dscEngineABI,
    functionName: 'burnDSC',
    args: [amount]
  })

  return data
}