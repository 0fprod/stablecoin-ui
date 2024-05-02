import './TokenGroups.css';
import { Hex, parseEther } from 'viem';
import React from 'react';
import { Input, Button } from '@web3uikit/core';
import { Archive, LogOut, Holders, Bin } from '@web3uikit/icons';
import { DSCTokenAmountWithTooltip, TokenAmountWithTooltip } from '../TokenAmountWithTooltip/TokenAmountWithTooltip';
import { Token } from '../../../../constants/symbols';
import { useDscEngine } from '../../../../hooks/useDscEngine';
import { useTokenBalances } from '../../../../hooks/useTokenBalances';
import { useNotificationHandlers } from '../../../../hooks/useNotificationHandlers';
import { dscoinAddress, linkTokenAddress, wEthTokenAddress } from '../../../../constants/addresses';
import { useStats } from '../../../../hooks/useStats';

interface TokenGroupsProps {
  account: Hex;
}

export const TokenGroups: React.FC<TokenGroupsProps> = ({ account }) => {
  const [tokens] = React.useState<Token[]>([Token.Link, Token.wETH]);
  const [linkAmount, setLinkAmount] = React.useState<bigint>(0n);
  const [wEthAmount, setWEthAmount] = React.useState<bigint>(0n);
  const [dscAmount, setDscAmount] = React.useState<bigint>(0n);
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

  const onChange = React.useCallback((token: Token, value: string) => {
    if (!value) return;
    if (token === Token.Link) setLinkAmount(parseEther(value));
    if (token === Token.wETH) setWEthAmount(parseEther(value));
    if (token === Token.DSC) setDscAmount(parseEther(value));
  }, []);

  const onApproveAndDeposit = React.useCallback(
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

  const onRedeem = React.useCallback(
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

  const onMint = React.useCallback(() => {
    mintDsc(account, dscAmount).then(showSubmittedTxNotification).catch(showErrorNotification);
  }, [mintDsc, dscAmount, account, showSubmittedTxNotification, showErrorNotification]);

  const onBurn = React.useCallback(() => {
    burnDsc(account, dscAmount).then(showSubmittedTxNotification).catch(showErrorNotification);
  }, [burnDsc, dscAmount, account, showSubmittedTxNotification, showErrorNotification]);

  React.useEffect(() => {
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
        <TokenGroupLegacy
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
      <div className="group">
        <DSCTokenAmountWithTooltip
          inWallet={dscBalance}
          isLoadingWalletBalances={isLoadingDscBalance}
          tokenSymbol={Token.DSC}
        />
        <div className="center">
          <Input type="number" onChange={(e) => onChange(Token.DSC, e.target.value)} />
        </div>
        <div className="actions">
          <Button
            icon={<Holders fontSize="1rem" />}
            text="Mint"
            theme="moneyPrimary"
            onClick={() => onMint()}
            disabled={isLoadingDscBalance || isActionRunning}
          />
          <Button
            icon={<Bin fontSize="1rem" />}
            text="Burn"
            color="red"
            theme="colored"
            onClick={() => onBurn()}
            disabled={isLoadingDscBalance || isActionRunning}
          />
        </div>
      </div>
    </div>
  );
};

interface TokenGroupProps {
  asCollateral: bigint;
  inWallet: bigint;
  token: Token;
  isLoadingCollateral: boolean;
  isLoadingWalletBalances: boolean;
  shouldDisableActions: boolean;
  onChange: (token: Token, value: string) => void;
  onApproveAndDeposit: (token: Token) => Promise<void>;
  onRedeem: (token: Token) => Promise<void>;
}

const TokenGroupLegacy: React.FC<TokenGroupProps> = ({
  asCollateral,
  inWallet,
  token,
  isLoadingCollateral,
  isLoadingWalletBalances,
  shouldDisableActions,
  onChange,
  onApproveAndDeposit,
  onRedeem,
}) => (
  <div className="group">
    <TokenAmountWithTooltip
      isLoadingCollateral={isLoadingCollateral}
      isLoadingWalletBalances={isLoadingWalletBalances}
      asCollateral={asCollateral}
      inWallet={inWallet}
      tokenSymbol={token}
    />
    <div className="center">
      <Input type="number" onChange={(e) => onChange(token, e.target.value)} />
    </div>
    <div className="actions">
      <Button
        icon={<Archive fontSize="1rem" />}
        text="Aprove and deposit"
        theme="moneyPrimary"
        onClick={() => onApproveAndDeposit(token)}
        disabled={shouldDisableActions}
      />
      <Button
        icon={<LogOut fontSize="1rem" />}
        text="Redeem"
        color="red"
        theme="colored"
        onClick={() => onRedeem(token)}
        disabled={shouldDisableActions}
      />
    </div>
  </div>
);
