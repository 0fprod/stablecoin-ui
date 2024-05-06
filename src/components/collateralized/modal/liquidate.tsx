import { Modal, Button, Typography, Loading } from '@web3uikit/core';
import React, { useEffect } from 'react';
import { useDscEngine } from '../../../hooks/useDscEngine';
import { useTokenBalances } from '../../../hooks/useTokenBalances';
import { Cross, Chainlink, Eth } from '@web3uikit/icons';
import { Hex, formatUnits } from 'viem';
import {
  linkUsdPriceFeedAddress,
  wEthUsdPriceFeedAddress,
  linkTokenAddress,
  wEthTokenAddress,
} from '../../../constants/addresses';
import { formatUsd } from '../../../utils/utils';
import { useAccount } from 'wagmi';
import { useNotificationHandlers } from '../../../hooks/useNotificationHandlers';

interface LiquidateModalProps {
  isVisible: boolean;
  closeModal: () => void;
  insolventUserToLiquidate: Hex;
}

export const LiquidateModal: React.FC<LiquidateModalProps> = ({ isVisible, closeModal, insolventUserToLiquidate }) => {
  const { liquidate } = useDscEngine();
  const { address } = useAccount();
  const { dscBalance, isLoadingDscBalance } = useTokenBalances(address as Hex);
  const { linkCollateralBalance, wEthCollateralBalance, getCollateralValueInUsd } =
    useTokenBalances(insolventUserToLiquidate);
  const [linkValueInUsd, setLinkValueInUsd] = React.useState<bigint>(0n);
  const [wEthValueInUsd, setWEthValueInUsd] = React.useState<bigint>(0n);
  const { showErrorNotification, showSubmittedTxNotification } = useNotificationHandlers();

  const takeWeth = async () => {
    await liquidateCollateral(wEthTokenAddress, wEthValueInUsd);
    closeModal();
  };

  const takeLink = async () => {
    await liquidateCollateral(linkTokenAddress, linkValueInUsd);
    closeModal();
  };

  const liquidateCollateral = async (tokenAddress: Hex, dscToBurn: bigint) => {
    liquidate(insolventUserToLiquidate, tokenAddress, dscToBurn)
      .then(showSubmittedTxNotification)
      .catch(showErrorNotification);
  };

  useEffect(() => {
    getCollateralValueInUsd(wEthUsdPriceFeedAddress, wEthCollateralBalance).then(setWEthValueInUsd);
    getCollateralValueInUsd(linkUsdPriceFeedAddress, linkCollateralBalance).then(setLinkValueInUsd);
  }, [linkCollateralBalance, wEthCollateralBalance, getCollateralValueInUsd]);

  return (
    <div>
      <Modal title="Liquidate user" hasFooter={false} isVisible={isVisible}>
        <Typography variant="h4">Insolvent User: {insolventUserToLiquidate}</Typography>
        <br />
        <Typography variant="p">
          In order to liquidate someone you must pay in DSC the worth in USD of the collateral they have deposited. Plus
          the insolvent user must have a health factor lower than 1.
        </Typography>
        <br />
        <Typography variant="p">
          Your current balance is {isLoadingDscBalance ? <Loading /> : formatUnits(dscBalance, 18)} DSC. The user has:
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '2rem 0 0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>wETH Balance: {formatUnits(wEthCollateralBalance, 18)}</div>
              <div>Link Balance: {formatUnits(linkCollateralBalance, 18)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>wETH Value: {formatUsd(wEthValueInUsd)} </div>
              <div>Link Value: {formatUsd(linkValueInUsd)} </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '2rem' }}>
            <Button icon={<Eth />} onClick={takeWeth} text="Take WETH" theme="outline" />
            <Button icon={<Chainlink />} onClick={takeLink} text="Take LINK" theme="outline" />
            <Button icon={<Cross />} onClick={closeModal} theme="colored" color="red" text="Close" />
          </div>
        </div>
      </Modal>
    </div>
  );
};
