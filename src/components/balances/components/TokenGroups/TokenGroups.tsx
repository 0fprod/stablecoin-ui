import { Hex, parseEther } from 'viem';
import React, { useCallback, useEffect } from 'react';
import { Token } from '../../../../constants/symbols';
import { useDscEngine } from '../../../../hooks/useDscEngine';
import { useTokenBalances } from '../../../../hooks/useTokenBalances';
import { useNotificationHandlers } from '../../../../hooks/useNotificationHandlers';
import { dscoinAddress, linkTokenAddress, wEthTokenAddress } from '../../../../constants/addresses';
import { useStats } from '../../../../hooks/useStats';
import { CollateralTokenGroup } from '../CollateralToken/CollateralToken';
import '../../Balances.css';
import StablecoinToken from '../StableCoinToken/StablecoinToken';

interface TokenGroupsProps {
  account: Hex;
}

export const TokenGroups: React.FC<TokenGroupsProps> = ({ account }) => {
  const [tokens] = React.useState<Token[]>([Token.Link, Token.wETH]);
  const [linkAmount, setLinkAmount] = React.useState<bigint>(0n);
  const [wEthAmount, setWEthAmount] = React.useState<bigint>(0n);
  const [dscAmount, setDscAmount] = React.useState<bigint>(0n);
  const [maxMintableDscoin, setMaxMintableDscoin] = React.useState<bigint>(0n);
  const {
    linkBalance,
    wEthBalance,
    dscBalance,
    isLoadingLinkBalance,
    isLoadingWEthBalance,
    isLoadingDscBalance,
    linkCollateralBalance,
    wEthCollateralBalance,
    isLoadingLinkCollateral,
    isLoadingWEthCollateral,
    updateCollateralBalance,
    updateTokenBalance,
  } = useTokenBalances(account);
  const {
    isActionRunning,
    aproveAndDepositCollateral,
    redeemCollateral,
    mintDsc,
    burnDsc,
    registerMintListener,
    registerBurnListener,
  } = useDscEngine();
  const { fetchStats } = useStats();
  const { showTxCompleteNotification, showErrorNotification, showSubmittedTxNotification } = useNotificationHandlers();

  const onChange = useCallback((token: Token, value: string) => {
    if (!value) return;
    if (token === Token.Link) setLinkAmount(parseEther(value));
    if (token === Token.wETH) setWEthAmount(parseEther(value));
    if (token === Token.DSC) {
      setDscAmount(parseEther(value));
      setMaxMintableDscoin(0n);
    }
  }, []);

  const onApproveAndDeposit = useCallback(
    async (token: Token) => {
      const tokenAddress: Hex = token === Token.Link ? linkTokenAddress : wEthTokenAddress;
      const tokenAmount: bigint = token === Token.Link ? linkAmount : wEthAmount;

      aproveAndDepositCollateral(tokenAddress, account, tokenAmount)
        .then(async () => {
          await updateCollateralBalance(tokenAddress);
          await updateTokenBalance(tokenAddress);
          showTxCompleteNotification();
        })
        .catch(showErrorNotification);
    },
    [
      account,
      linkAmount,
      wEthAmount,
      aproveAndDepositCollateral,
      showTxCompleteNotification,
      showErrorNotification,
      updateCollateralBalance,
      updateTokenBalance,
    ]
  );

  const onRedeem = useCallback(
    async (token: Token) => {
      const tokenAddress: Hex = token === Token.Link ? linkTokenAddress : wEthTokenAddress;
      const tokenAmount: bigint = token === Token.Link ? linkAmount : wEthAmount;

      redeemCollateral(tokenAddress, account, tokenAmount)
        .then(async () => {
          await updateCollateralBalance(tokenAddress);
          await updateTokenBalance(tokenAddress);
          showTxCompleteNotification();
        })
        .catch(showErrorNotification);
    },
    [
      account,
      linkAmount,
      wEthAmount,
      redeemCollateral,
      showTxCompleteNotification,
      showErrorNotification,
      updateCollateralBalance,
      updateTokenBalance,
    ]
  );

  const onMint = useCallback(() => {
    mintDsc(account, dscAmount).then(showSubmittedTxNotification).catch(showErrorNotification);
  }, [mintDsc, dscAmount, account, showSubmittedTxNotification, showErrorNotification]);

  const onBurn = useCallback(() => {
    burnDsc(account, dscAmount).then(showSubmittedTxNotification).catch(showErrorNotification);
  }, [burnDsc, dscAmount, account, showSubmittedTxNotification, showErrorNotification]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    registerMintListener(account, async (_data) => {
      showTxCompleteNotification();
      fetchStats();
      await updateTokenBalance(dscoinAddress);
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    registerBurnListener(account, async (_data) => {
      showTxCompleteNotification();
      fetchStats();
      await updateTokenBalance(dscoinAddress);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="balances">
      {tokens.map((token) => (
        <CollateralTokenGroup
          key={token}
          asCollateral={token === Token.Link ? linkCollateralBalance : wEthCollateralBalance}
          inWallet={token === Token.Link ? linkBalance : wEthBalance}
          token={token}
          isLoadingCollateral={token === Token.Link ? isLoadingLinkCollateral : isLoadingWEthCollateral}
          isLoadingWalletBalances={token === Token.Link ? isLoadingLinkBalance : isLoadingWEthBalance}
          shouldDisableActions={isLoadingLinkBalance || isLoadingLinkCollateral || isActionRunning}
          onChange={onChange}
          onApproveAndDeposit={onApproveAndDeposit}
          onRedeem={onRedeem}
        />
      ))}
      <StablecoinToken
        dscBalance={dscBalance}
        isLoadingDscBalance={isLoadingDscBalance}
        onChange={onChange}
        onMint={onMint}
        onBurn={onBurn}
        isActionRunning={isActionRunning}
        value={maxMintableDscoin}
      />
    </div>
  );
};
