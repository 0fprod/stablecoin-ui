import { Tooltip, Loading } from '@web3uikit/core';
import { LockClosed, Wallet } from '@web3uikit/icons';
import { formatUnits } from 'viem';
import { Token } from '../../../../constants/symbols';

interface AmountWithToolTipProps {
  asCollateral: bigint;
  inWallet: bigint;
  tokenSymbol: Token;
  isLoadingCollateral: boolean;
  isLoadingWalletBalances: boolean;
}

const AmountWithIcon: React.FC<{ icon: React.ReactNode; isLoading: boolean; text: string; tooltip: string }> = ({
  icon,
  isLoading,
  text,
  tooltip,
}) => {
  return (
    <Tooltip content={tooltip} position="bottom" className="amount-with-icon">
      {icon}
      {isLoading ? <Loading spinnerColor="#891234" /> : text}
    </Tooltip>
  );
};

export const TokenAmountWithTooltip: React.FC<AmountWithToolTipProps> = ({
  asCollateral,
  inWallet,
  tokenSymbol,
  isLoadingCollateral,
  isLoadingWalletBalances,
}) => {
  const collateralText = `${formatUnits(asCollateral, 18)} ${tokenSymbol}`;
  const walletText = `${formatUnits(inWallet, 18)} ${tokenSymbol}`;
  const walletTooltip = `Available in wallet`;
  const collateralTooltip = `Collateralized`;

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
      <AmountWithIcon
        icon={<LockClosed fontSize="18px" color="gray" />}
        isLoading={isLoadingCollateral}
        text={collateralText}
        tooltip={collateralTooltip}
      />
      <AmountWithIcon
        icon={<Wallet fontSize="18px" color="green" />}
        isLoading={isLoadingWalletBalances}
        text={walletText}
        tooltip={walletTooltip}
      />
    </div>
  );
};

type DscTokenTooltipProps = Pick<AmountWithToolTipProps, 'isLoadingWalletBalances' | 'inWallet' | 'tokenSymbol'>;
export const DSCTokenAmountWithTooltip: React.FC<DscTokenTooltipProps> = ({
  inWallet,
  isLoadingWalletBalances,
  tokenSymbol,
}) => {
  return (
    <Tooltip content="Available in wallet" position="bottom" className="amount-with-icon">
      <Wallet fontSize="18px" color="green" />{' '}
      {isLoadingWalletBalances ? <Loading spinnerColor="#891234" /> : `${formatUnits(inWallet, 18)} ${tokenSymbol}`}
    </Tooltip>
  );
};
