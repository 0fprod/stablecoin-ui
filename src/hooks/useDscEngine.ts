import { approveToken, burnDsc, depositCollateral, mintDsc, redeemCollateral } from '../api/walletActions'

// create a hook that exports the functions from the walletActions file
export const useDscEngine = () => {
  return { approveToken, depositCollateral, redeemCollateral, mintDsc, burnDsc }
}
