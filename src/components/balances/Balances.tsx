import './Balances.css';
// import { BaseError, Hex, formatUnits, parseEther } from 'viem';
// import React, { useCallback, useEffect, useState } from 'react';
// import { LogOut, Wallet, LockClosed, Bin, Archive, Holders, AlertCircle, CheckCircle } from '@web3uikit/icons';
// import { Button, Input, Loading, Tooltip, useNotification } from '@web3uikit/core';
// import { useWalletBalances } from '../../hooks/useWalletBalances';
// import { useCollateralBalances } from '../../hooks/useCollateralBalances';
// import { useDscEngine } from '../../hooks/useDscEngine';
// import { linkTokenAddress, wEthTokenAddress } from '../../constants/addresses';
// import { Token } from '../../constants/symbols';
// import { getErrorFromBaseError } from '../../utils/error.handler';
// import { TxHashLink } from '../tx-link/TxHashLink';
// import { useStats } from '../../hooks/useStats';
import React from 'react';
import { useAccount } from 'wagmi';
import { TokenGroups } from './components/TokenGroups/TokenGroups';

export const Balances: React.FC = () => {
  const { address } = useAccount();

  if (!address) {
    return <h3> Connect your wallet! </h3>;
  }

  return (
    <section>
      <h2>Balances</h2>
      <TokenGroups account={address} />
    </section>
  );
};

// const BalancesLegacy: React.FC = () => {
//   const [linkAmount, setLinkAmount] = useState<bigint>(0n);
//   const [wEthAmount, setWEthAmount] = useState<bigint>(0n);
//   const [dscAmount, setDscAmount] = useState<bigint>(0n);
//   const [maxMintableDsc, setMaxMintableDsc] = useState<bigint>(0n);
//   const [isActionRunning, setIsActionRunning] = useState<boolean>(false);
//   const dispatch = useNotification();
//   const { address } = useAccount();
//   const { aproveAndDepositCollateral, redeemCollateral, mintDsc, burnDsc, getMaxMintableDsc, listenToMint } =
//     useDscEngine();
//   const { dscBalance, linkBalance, wEthBalance, isLoadingWalletBalances, updateWalletBalances } =
//     useWalletBalances(address);
//   const { linkCollateralBalance, wEthCollateralBalance, isLoadingCollaterals, updateCollateralBalances } =
//     useCollateralBalances(address);
//   const { fetchStats } = useStats(address);

//   const showErrorNotification = (e: BaseError) => {
//     let message = '';

//     if (e instanceof BaseError) {
//       message = getErrorFromBaseError(e);
//     }

//     dispatch({
//       type: 'error',
//       message,
//       title: 'Error!',
//       icon: <AlertCircle fontSize={20} />,
//       position: 'topR',
//     });
//   };

//   const showSubmittedTxNotification = (txHash: Hex) => {
//     dispatch({
//       type: 'info',
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-expect-error
//       message: TxHashLink({ txHash }),
//       title: 'Tx submitted!',
//       icon: <AlertCircle fontSize={20} />,
//       position: 'topR',
//     });
//   };

//   const showTxCompleteNotification = useCallback(() => {
//     dispatch({
//       type: 'success',
//       message: 'Transaction completed!',
//       title: 'Hooray!',
//       icon: <CheckCircle fontSize={20} />,
//       position: 'topR',
//     });
//   }, [dispatch]);

//   const updateBalances = useCallback(async () => {
//     await updateWalletBalances();
//     await updateCollateralBalances();
//     await fetchStats();
//     setIsActionRunning(false);
//     showTxCompleteNotification();
//   }, [updateWalletBalances, updateCollateralBalances, fetchStats, showTxCompleteNotification]);

//   const onApproveAndDeposit = async (token: Token) => {
//     if (!address) return;
//     setIsActionRunning(true);
//     const tokenAddress = token === Token.Link ? linkTokenAddress : wEthTokenAddress;
//     const amount = token === Token.Link ? linkAmount : wEthAmount;
//     aproveAndDepositCollateral(tokenAddress, address, amount)
//       .then(updateBalances)
//       .catch(showErrorNotification)
//       .finally(() => setIsActionRunning(false));
//   };

//   const onRedeem = async (token: Token) => {
//     if (!address) return;
//     setIsActionRunning(true);
//     const tokenAddress = token === Token.Link ? linkTokenAddress : wEthTokenAddress;
//     const amount = token === Token.Link ? linkAmount : wEthAmount;
//     redeemCollateral(tokenAddress, address, amount)
//       .then(updateBalances)
//       .catch(showErrorNotification)
//       .finally(() => setIsActionRunning(false));
//   };

//   const onMint = async () => {
//     if (!address) return;
//     setIsActionRunning(true);
//     mintDsc(address, dscAmount)
//       .then(showSubmittedTxNotification)
//       .catch((err) => {
//         showErrorNotification(err);
//         setIsActionRunning(false);
//       });
//   };

//   const onBurn = async () => {
//     if (!address) return;
//     setIsActionRunning(true);
//     burnDsc(address, dscAmount)
//       .then(updateBalances)
//       .catch(showErrorNotification)
//       .finally(() => setIsActionRunning(false));
//   };

//   const onChange = (token: Token, value: string) => {
//     if (!value) return;
//     if (token === Token.Link) setLinkAmount(parseEther(value));
//     if (token === Token.wETH) setWEthAmount(parseEther(value));
//     if (token === Token.DSC) setDscAmount(parseEther(value));
//   };

//   const setMaxMintableDscAmount = () => {
//     if (!address) return;
//     getMaxMintableDsc(address)
//       .then((amount) => {
//         const formattedAmount = formatUnits(amount - dscBalance, 18);
//         setMaxMintableDsc(BigInt(formattedAmount));
//       })
//       .catch(showErrorNotification);
//   };

//   useEffect(() => {
//     setIsActionRunning(isLoadingWalletBalances || isLoadingCollaterals);
//   }, [isLoadingWalletBalances, isLoadingCollaterals]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!address) return;
//       const unwatch = await listenToMint(address, updateBalances);
//       return () => unwatch();
//     };
//     fetchData();
//   }, [address, listenToMint, updateBalances]);

//   return (
//     <section>
//       <h2>Balances</h2>
//       <div className="balances">
//         <TokenGroupLegacy
//           asCollateral={linkCollateralBalance}
//           isLoadingCollateral={isLoadingCollaterals}
//           isLoadingWalletBalances={isLoadingWalletBalances}
//           shouldDisableActions={isActionRunning}
//           inWallet={linkBalance}
//           token={Token.Link}
//           onChange={onChange}
//           onApproveAndDeposit={onApproveAndDeposit}
//           onRedeem={onRedeem}
//         />
//         <TokenGroupLegacy
//           asCollateral={wEthCollateralBalance}
//           isLoadingCollateral={isLoadingCollaterals}
//           isLoadingWalletBalances={isLoadingWalletBalances}
//           shouldDisableActions={isActionRunning}
//           inWallet={wEthBalance}
//           token={Token.wETH}
//           onChange={onChange}
//           onApproveAndDeposit={onApproveAndDeposit}
//           onRedeem={onRedeem}
//         />
//         <div className="group">
//           <Tooltip content="Available in wallet" position="bottom" className="amount-with-icon">
//             <Wallet fontSize="18px" color="green" />{' '}
//             {isLoadingWalletBalances || isActionRunning ? <Loading /> : `${formatUnits(dscBalance, 18)} DSC`}
//           </Tooltip>
//           <div className="center">
//             <Input
//               type="number"
//               onChange={(e) => onChange(Token.DSC, e.target.value)}
//               value={maxMintableDsc.toString()}
//             />
//           </div>
//           <div className="actions">
//             <Button
//               icon={<Holders fontSize="1rem" />}
//               text="Mint"
//               theme="moneyPrimary"
//               onClick={onMint}
//               disabled={isActionRunning}
//             />
//             <Button
//               icon={<Bin fontSize="1rem" />}
//               text="Burn"
//               color="red"
//               theme="colored"
//               onClick={onBurn}
//               disabled={isActionRunning}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// interface TokenGroupProps {
//   asCollateral: bigint;
//   inWallet: bigint;
//   token: Token;
//   isLoadingCollateral: boolean;
//   isLoadingWalletBalances: boolean;
//   shouldDisableActions: boolean;
//   onChange: (token: Token, value: string) => void;
//   onApproveAndDeposit: (token: Token) => Promise<void>;
//   onRedeem: (token: Token) => Promise<void>;
// }

// const TokenGroupLegacy: React.FC<TokenGroupProps> = ({
//   asCollateral,
//   inWallet,
//   token,
//   isLoadingCollateral,
//   isLoadingWalletBalances,
//   shouldDisableActions,
//   onChange,
//   onApproveAndDeposit,
//   onRedeem,
// }) => (
//   <div className="group">
//     <TokenAmountWithTooltip
//       isLoadingCollateral={isLoadingCollateral || shouldDisableActions}
//       isLoadingWalletBalances={isLoadingWalletBalances || shouldDisableActions}
//       asCollateral={asCollateral}
//       inWallet={inWallet}
//       token={token}
//     />
//     <div className="center">
//       <Input type="number" onChange={(e) => onChange(token, e.target.value)} />
//     </div>
//     <div className="actions">
//       <Button
//         icon={<Archive fontSize="1rem" />}
//         text="Aprove and deposit"
//         theme="moneyPrimary"
//         onClick={() => onApproveAndDeposit(token)}
//         disabled={shouldDisableActions}
//       />
//       <Button
//         icon={<LogOut fontSize="1rem" />}
//         text="Redeem"
//         color="red"
//         theme="colored"
//         onClick={() => onRedeem(token)}
//         disabled={shouldDisableActions}
//       />
//     </div>
//   </div>
// );

// interface AmountWithToolTipProps {
//   asCollateral: bigint;
//   inWallet: bigint;
//   token: string;
//   isLoadingCollateral: boolean;
//   isLoadingWalletBalances: boolean;
// }

// const TokenAmountWithTooltip: React.FC<AmountWithToolTipProps> = ({
//   asCollateral,
//   inWallet,
//   token,
//   isLoadingCollateral,
//   isLoadingWalletBalances,
// }) => {
//   const collateralText = `${formatUnits(asCollateral, 18)} ${token}`;
//   const walletText = `${formatUnits(inWallet, 18)} ${token}`;

//   return (
//     <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
//       <Tooltip content="As collateral" position="bottom" className="amount-with-icon">
//         <LockClosed fontSize="18px" color="gray" />
//         {isLoadingCollateral ? <Loading /> : collateralText}
//       </Tooltip>

//       <Tooltip content="Available in wallet" position="bottom" className="amount-with-icon">
//         <Wallet fontSize="18px" color="green" /> {isLoadingWalletBalances ? <Loading /> : walletText}
//       </Tooltip>
//     </div>
//   );
// };
