import './Balances.css';
import { Hex, formatUnits, parseEther } from 'viem';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Key, LogOut, Wallet, LockClosed, Bin, Archive, Holders, AlertCircle } from '@web3uikit/icons';
import { Button, Input, Loading, Tooltip, useNotification } from '@web3uikit/core';
import { useWalletBalances } from '../../hooks/useWalletBalances';
import { useCollateralBalances } from '../../hooks/useCollateralBalances';
import { useDscEngine } from '../../hooks/useDscEngine';
import { linkTokenAddress, wEthTokenAddress } from '../../constants/addresses';
import { Token } from '../../constants/symbols';
import { getDetails } from '../../utils/error.handler';
import { TxHashLink } from '../tx-link/TxHashLink';
import { useStats } from '../../hooks/useStats';

export const Balances: React.FC = () => {
  const [linkAmount, setLinkAmount] = useState<bigint>(0n);
  const [wEthAmount, setWEthAmount] = useState<bigint>(0n);
  const [dscAmount, setDscAmount] = useState<bigint>(0n);
  const [maxMintableDsc, setMaxMintableDsc] = useState<bigint>(0n);
  const [isActionRunning, setIsActionRunning] = useState<boolean>(false);
  const dispatch = useNotification();
  const { address } = useAccount();
  const { approveToken, depositCollateral, redeemCollateral, mintDsc, burnDsc, getMaxMintableDsc } = useDscEngine();
  const { dscBalance, linkBalance, wEthBalance, isLoadingWalletBalances, updateWalletBalances } =
    useWalletBalances(address);
  const { linkCollateralBalance, wEthCollateralBalance, isLoadingCollaterals, updateCollateralBalances } =
    useCollateralBalances(address);
  const { fetchStats } = useStats(address);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showErrorNotification = (e: any) => {
    console.error('Error -->', e);
    dispatch({
      type: 'error',
      message: getDetails(e.message),
      title: 'Error!',
      icon: <AlertCircle fontSize={20} />,
      position: 'topR',
    });
  };

  const showSuccessNotification = (txHash: Hex) => {
    dispatch({
      type: 'info',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      message: TxHashLink({ txHash }),
      title: 'Error!',
      icon: <AlertCircle fontSize={20} />,
      position: 'topR',
    });
  };

  const updateBalances = () => {
    updateWalletBalances();
    updateCollateralBalances();
    fetchStats();
  };

  const onApprove = async (token: Token) => {
    if (!address) return;
    setIsActionRunning(true);
    const tokenAddress = token === Token.Link ? linkTokenAddress : wEthTokenAddress;
    const amount = token === Token.Link ? linkAmount : wEthAmount;
    approveToken(tokenAddress, address, amount)
      .then(showSuccessNotification)
      .catch(showErrorNotification)
      .finally(() => setIsActionRunning(false));
  };

  const onDeposit = async (token: Token) => {
    if (!address) return;
    setIsActionRunning(true);
    const tokenAddress = token === Token.Link ? linkTokenAddress : wEthTokenAddress;
    const amount = token === Token.Link ? linkAmount : wEthAmount;
    depositCollateral(tokenAddress, address, amount)
      .then(updateBalances)
      .catch(showErrorNotification)
      .finally(() => setIsActionRunning(false));
  };

  const onRedeem = async (token: Token) => {
    if (!address) return;
    setIsActionRunning(true);
    const tokenAddress = token === Token.Link ? linkTokenAddress : wEthTokenAddress;
    const amount = token === Token.Link ? linkAmount : wEthAmount;
    redeemCollateral(tokenAddress, address, amount)
      .then(updateBalances)
      .catch(showErrorNotification)
      .finally(() => setIsActionRunning(false));
  };

  const onMint = async () => {
    if (!address) return;
    setIsActionRunning(true);
    mintDsc(address, dscAmount)
      .then(updateBalances)
      .catch(showErrorNotification)
      .finally(() => setIsActionRunning(false));
  };

  const onBurn = async () => {
    if (!address) return;
    setIsActionRunning(true);
    burnDsc(address, dscAmount)
      .then(updateBalances)
      .catch(showErrorNotification)
      .finally(() => setIsActionRunning(false));
  };

  const onChange = (token: Token, value: string) => {
    if (!value) return;
    if (token === Token.Link) setLinkAmount(parseEther(value));
    if (token === Token.wETH) setWEthAmount(parseEther(value));
    if (token === Token.DSC) setDscAmount(parseEther(value));
  };

  const setMaxMintableDscAmount = () => {
    if (!address) return;
    getMaxMintableDsc(address)
      .then((amount) => {
        const formattedAmount = formatUnits(amount - dscBalance, 18);
        setMaxMintableDsc(BigInt(formattedAmount));
      })
      .catch(showErrorNotification);
  };

  useEffect(() => {
    setIsActionRunning(isLoadingWalletBalances || isLoadingCollaterals);
  }, [isLoadingWalletBalances, isLoadingCollaterals]);

  const walletText = `${formatUnits(dscBalance, 18)} DSC`;

  return (
    <section>
      <h2>Balances</h2>
      <div className="balances">
        <TokenGroup
          asCollateral={linkCollateralBalance}
          isLoadingCollateral={isLoadingCollaterals}
          isLoadingWalletBalances={isLoadingWalletBalances}
          shouldDisableActions={isActionRunning}
          inWallet={linkBalance}
          token={Token.Link}
          onChange={onChange}
          onApprove={onApprove}
          onDeposit={onDeposit}
          onRedeem={onRedeem}
        />
        <TokenGroup
          asCollateral={wEthCollateralBalance}
          isLoadingCollateral={isLoadingCollaterals}
          isLoadingWalletBalances={isLoadingWalletBalances}
          shouldDisableActions={isActionRunning}
          inWallet={wEthBalance}
          token={Token.wETH}
          onChange={onChange}
          onApprove={onApprove}
          onDeposit={onDeposit}
          onRedeem={onRedeem}
        />
        <div className="group">
          <Tooltip content="Available in wallet" position="bottom" className="amount-with-icon">
            <Wallet fontSize="18px" color="green" /> {isLoadingWalletBalances ? <Loading /> : walletText}
          </Tooltip>
          <div className="center">
            <Input
              type="number"
              onChange={(e) => onChange(Token.DSC, e.target.value)}
              value={maxMintableDsc.toString()}
            />
          </div>
          <div className="actions">
            <Button
              icon={<Key fontSize="1rem" />}
              text="Set max dsc"
              theme="secondary"
              onClick={setMaxMintableDscAmount}
              disabled={isActionRunning}
            />
            <Button
              icon={<Holders fontSize="1rem" />}
              text="Mint"
              theme="moneyPrimary"
              onClick={onMint}
              disabled={isActionRunning}
            />
            <Button
              icon={<Bin fontSize="1rem" />}
              text="Burn"
              color="red"
              theme="colored"
              onClick={onBurn}
              disabled={isActionRunning}
            />
          </div>
        </div>
      </div>
    </section>
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
  onApprove: (token: Token) => Promise<void>;
  onDeposit: (token: Token) => Promise<void>;
  onRedeem: (token: Token) => Promise<void>;
}

const TokenGroup: React.FC<TokenGroupProps> = ({
  asCollateral,
  inWallet,
  token,
  isLoadingCollateral,
  isLoadingWalletBalances,
  shouldDisableActions,
  onChange,
  onApprove,
  onDeposit,
  onRedeem,
}) => (
  <div className="group">
    <TokenAmountWithTooltip
      isLoadingCollateral={isLoadingCollateral}
      isLoadingWalletBalances={isLoadingWalletBalances}
      asCollateral={asCollateral}
      inWallet={inWallet}
      token={token}
    />
    <div className="center">
      <Input type="number" onChange={(e) => onChange(token, e.target.value)} />
    </div>
    <div className="actions">
      <Button
        icon={<Key fontSize="1rem" />}
        text="Approve"
        theme="secondary"
        onClick={() => onApprove(token)}
        disabled={shouldDisableActions}
      />
      <Button
        icon={<Archive fontSize="1rem" />}
        text="Deposit"
        theme="moneyPrimary"
        onClick={() => onDeposit(token)}
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

interface AmountWithToolTipProps {
  asCollateral: bigint;
  inWallet: bigint;
  token: string;
  isLoadingCollateral: boolean;
  isLoadingWalletBalances: boolean;
}

const TokenAmountWithTooltip: React.FC<AmountWithToolTipProps> = ({
  asCollateral,
  inWallet,
  token,
  isLoadingCollateral,
  isLoadingWalletBalances,
}) => {
  const collateralText = `${formatUnits(asCollateral, 18)} ${token}`;
  const walletText = `${formatUnits(inWallet, 18)} ${token}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
      <Tooltip content="As collateral" position="bottom" className="amount-with-icon">
        <LockClosed fontSize="18px" color="gray" />
        {isLoadingCollateral ? <Loading /> : collateralText}
      </Tooltip>

      <Tooltip content="Available in wallet" position="bottom" className="amount-with-icon">
        <Wallet fontSize="18px" color="green" /> {isLoadingWalletBalances ? <Loading /> : walletText}
      </Tooltip>
    </div>
  );
};
