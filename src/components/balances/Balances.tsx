import './Balances.css';
import { formatUnits, parseEther } from 'viem';
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Key, LogOut, Wallet, LockClosed, Bin, Archive, Holders } from '@web3uikit/icons';
import { Button, Input, Tooltip } from '@web3uikit/core';
import { useWalletBalances } from '../../hooks/useWalletBalances';
import { useCollateralBalances } from '../../hooks/useCollateralBalances';
import { useDscEngine } from '../../hooks/useDscEngine';
import { linkTokenAddress, wEthTokenAddress } from '../../constants/addresses';
import { Token } from '../../constants/symbols';

export const Balances: React.FC = () => {
  const { address } = useAccount();
  const [linkAmount, setLinkAmount] = useState<bigint>(0n);
  const [wEthAmount, setWEthAmount] = useState<bigint>(0n);
  const [dscAmount, setDscAmount] = useState<bigint>(0n);
  const { dscBalance, linkBalance, wEthBalance } = useWalletBalances(address);
  const { approveToken, depositCollateral, redeemCollateral, mintDsc, burnDsc } = useDscEngine();
  const { linkCollateralBalance, wEthCollateralBalance } = useCollateralBalances(address);

  const onApprove = async (token: Token) => {
    if (!address) return;
    const tokenAddress = token === Token.Link ? linkTokenAddress : wEthTokenAddress;
    const amount = token === Token.Link ? linkAmount : wEthAmount;
    await approveToken(tokenAddress, address, amount);
  };

  const onDeposit = async (token: Token) => {
    if (!address) return;
    const tokenAddress = token === Token.Link ? linkTokenAddress : wEthTokenAddress;
    const amount = token === Token.Link ? linkAmount : wEthAmount;
    await depositCollateral(tokenAddress, address, amount);
  };

  const onRedeem = async (token: Token) => {
    if (!address) return;
    const tokenAddress = token === Token.Link ? linkTokenAddress : wEthTokenAddress;
    const amount = token === Token.Link ? linkAmount : wEthAmount;
    await redeemCollateral(tokenAddress, address, amount);
  };

  const onChange = (token: Token, value: string) => {
    if (!value) return;
    if (token === Token.Link) setLinkAmount(parseEther(value));
    if (token === Token.wETH) setWEthAmount(parseEther(value));
    if (token === Token.DSC) setDscAmount(parseEther(value));
  };

  const onMint = () => {
    if (!address) return;
    mintDsc(address, dscAmount);
  };

  const onBurn = () => {
    if (!address) return;
    burnDsc(address, dscAmount);
  };

  return (
    <section>
      <h2>Balances</h2>
      <div className="balances">
        <TokenGroup
          asCollateral={linkCollateralBalance}
          inWallet={linkBalance}
          token={Token.Link}
          onChange={onChange}
          onApprove={onApprove}
          onDeposit={onDeposit}
          onRedeem={onRedeem}
        />
        <TokenGroup
          asCollateral={wEthCollateralBalance}
          inWallet={wEthBalance}
          token={Token.wETH}
          onChange={onChange}
          onApprove={onApprove}
          onDeposit={onDeposit}
          onRedeem={onRedeem}
        />
        <div className="group">
          {formatUnits(dscBalance, 18)} DSC
          <div className="center">
            <Input type="number" onChange={(e) => onChange(Token.DSC, e.target.value)} />
          </div>
          <div className="actions">
            <Button icon={<Holders fontSize="1rem" />} text="Mint" theme="moneyPrimary" onClick={onMint} />
            <Button icon={<Bin fontSize="1rem" />} text="Burn" color="red" theme="colored" onClick={onBurn} />
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
  onChange: (token: Token, value: string) => void;
  onApprove: (token: Token) => Promise<void>;
  onDeposit: (token: Token) => Promise<void>;
  onRedeem: (token: Token) => Promise<void>;
}

const TokenGroup: React.FC<TokenGroupProps> = ({
  asCollateral,
  inWallet,
  token,
  onChange,
  onApprove,
  onDeposit,
  onRedeem,
}) => (
  <div className="group">
    <TokenAmountWithTooltip asCollateral={asCollateral} inWallet={inWallet} token={token} />
    <div className="center">
      <Input type="number" onChange={(e) => onChange(token, e.target.value)} />
    </div>
    <div className="actions">
      <Button icon={<Key fontSize="1rem" />} text="Approve" theme="secondary" onClick={() => onApprove(token)} />
      <Button icon={<Archive fontSize="1rem" />} text="Deposit" theme="moneyPrimary" onClick={() => onDeposit(token)} />
      <Button
        icon={<LogOut fontSize="1rem" />}
        text="Redeem"
        color="red"
        theme="colored"
        onClick={() => onRedeem(token)}
      />
    </div>
  </div>
);

interface AmountWithToolTipProps {
  asCollateral: bigint;
  inWallet: bigint;
  token: string;
}

const TokenAmountWithTooltip: React.FC<AmountWithToolTipProps> = ({ asCollateral, inWallet, token }) => (
  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
    <Tooltip content="As collateral" position="bottom" className="amount-with-icon">
      <LockClosed fontSize="18px" color="gray" /> {formatUnits(asCollateral, 18)} {token}
    </Tooltip>

    <Tooltip content="Available in wallet" position="bottom" className="amount-with-icon">
      <Wallet fontSize="18px" color="green" /> {formatUnits(inWallet, 18)} {token}
    </Tooltip>
  </div>
);
