import React from 'react';
import { Token } from '../../../../constants/symbols';
import { Input, Button } from '@web3uikit/core';
import { Holders, Bin } from '@web3uikit/icons';
import { DSCTokenAmountWithTooltip } from '../TokenAmountWithTooltip/TokenAmountWithTooltip';
import '../../Balances.css';
import { formatUnits } from 'viem';

interface StablecoinTokenProps {
  dscBalance: bigint;
  isLoadingDscBalance: boolean;
  onChange: (token: Token, value: string) => void;
  onMint: () => void;
  onBurn: () => void;
  isActionRunning: boolean;
  value: bigint;
}

const StablecoinToken: React.FC<StablecoinTokenProps> = ({
  dscBalance,
  isLoadingDscBalance,
  onChange,
  onMint,
  onBurn,
  isActionRunning,
  value,
}) => {
  return (
    <div className="group">
      <DSCTokenAmountWithTooltip
        inWallet={dscBalance}
        isLoadingWalletBalances={isLoadingDscBalance}
        tokenSymbol={Token.DSC}
      />
      <div className="center">
        <Input
          type="number"
          onChange={(e) => onChange(Token.DSC, e.target.value)}
          value={formatUnits(value, 18).toString()}
        />
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
  );
};

export default StablecoinToken;
