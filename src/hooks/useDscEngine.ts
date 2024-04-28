import { approveToken, burnDsc, depositCollateral, mintDsc, redeemCollateral, getMaxMintableDsc } from '../api/walletActions'

export const useDscEngine = () => {
  return { approveToken, depositCollateral, redeemCollateral, mintDsc, burnDsc, getMaxMintableDsc }
}
