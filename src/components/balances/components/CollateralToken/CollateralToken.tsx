import { Input, Button } from '@web3uikit/core';
import { Archive, LogOut } from '@web3uikit/icons';
import { Token } from '../../../../constants/symbols';
import React from 'react';
import { TokenAmountWithTooltip } from '../TokenAmountWithTooltip/TokenAmountWithTooltip';
import '../../Balances.css';

interface CollateralTokenGroupProps {
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

export const CollateralTokenGroup: React.FC<CollateralTokenGroupProps> = ({
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
