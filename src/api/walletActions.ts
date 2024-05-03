import { Hex, createWalletClient, custom, parseAbiItem, publicActions } from "viem"
import { anvil } from "viem/chains"
import { erc20Abi } from "../constants/erc20.abi"
import { dscEngineABI } from "../constants/dscengine.abi"
import { dscEngineAddress, dscoinAddress } from "../constants/addresses"

function getPublicClient(account: Hex) {
  return createWalletClient({
    chain: anvil,
    transport: custom(window.ethereum),
    account
  }).extend(publicActions);
}


export const fetchTokenBalance = async (tokenAddress: Hex, account: Hex) => {
  const client = getPublicClient(account);

  const data = await client.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account]
  })


  return data as bigint
}

const approveToken = async (tokenAddress: Hex, account: Hex, amount: bigint) => {
  const client = getPublicClient(account);
  const { request } = await client.simulateContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: [dscEngineAddress, amount]
  })

  const txHash = await client.writeContract(request)

  return txHash
}

const depositCollateral = async (tokenAddress: Hex, account: Hex, amount: bigint) => {
  const client = getPublicClient(account);

  const { request } = await client.simulateContract({
    account,
    address: dscEngineAddress,
    abi: dscEngineABI,
    functionName: 'depositCollateral',
    args: [tokenAddress, amount]
  })

  const txHash = await client.writeContract(request)
  return txHash
}

export const aproveAndDepositCollateral = async (tokenAddress: Hex, account: Hex, amount: bigint) => {
  const client = getPublicClient(account);
  const txHash = await approveToken(tokenAddress, account, amount);

  await client.waitForTransactionReceipt({
    hash: txHash
  })

  return depositCollateral(tokenAddress, account, amount)
}

export const redeemCollateral = async (tokenAddress: Hex, account: Hex, amount: bigint) => {
  const client = getPublicClient(account);

  const { request } = await client.simulateContract({
    address: dscEngineAddress,
    abi: dscEngineABI,
    functionName: 'redeemCollateral',
    args: [tokenAddress, amount]
  })

  const txHash = await client.writeContract(request)
  return txHash
}

export const mintDsc = async (account: Hex, amount: bigint) => {
  const client = getPublicClient(account);

  const { request } = await client.simulateContract({
    address: dscEngineAddress,
    abi: dscEngineABI,
    functionName: 'mintDSC',
    args: [amount]
  })

  const txHash = await client.writeContract(request)

  return txHash
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const listenToMint = async (account: Hex, callback: (data: any) => void) => {
  const client = getPublicClient(account);

  const unwatch = client.watchEvent({
    onLogs: (logs) => {
      callback(logs)
    },
    address: dscoinAddress,
    event: parseAbiItem('event DSCMinted(address indexed minter, uint256 value)'),
    args: {
      minter: account
    }
  })

  console.log('Registered listener for minting events')

  return unwatch
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const listentToBurn = async (account: Hex, callback: (data: any) => void) => {
  const client = getPublicClient(account);

  const unwatch = client.watchEvent({
    onLogs: (logs) => {
      callback(logs)
    },
    address: dscEngineAddress,
    event: parseAbiItem('event DSCBurned(address indexed burner, uint256 value)'),
    args: {
      burner: account
    }
  })

  console.log('Registered listener for burning events')

  return unwatch
}

export const burnDsc = async (account: Hex, amount: bigint) => {
  const client = getPublicClient(account);

  const { request } = await client.simulateContract({
    address: dscEngineAddress,
    abi: dscEngineABI,
    functionName: 'burnDSC',
    args: [amount]
  })

  const txHash = await client.writeContract(request)

  return txHash
}

export const getMaxMintableDsc = async (account: Hex) => {
  const client = getPublicClient(account);

  const data = await client.readContract({
    address: dscEngineAddress,
    abi: dscEngineABI,
    functionName: 'getCollateralUSDValue',
    args: [account]
  })

  return data / 2n
}

export const getHealthFactor = async (account: Hex) => {
  const client = getPublicClient(account);

  const data = await client.readContract({
    address: dscEngineAddress,
    abi: dscEngineABI,
    functionName: 'getHealthFactor',
    args: [account]
  })

  return data
}