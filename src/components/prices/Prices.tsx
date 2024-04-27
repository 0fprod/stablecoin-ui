import { LinkTo, Loading, PlanCard, Typography } from '@web3uikit/core';
import './Prices.css';
import { usePrices } from '../../hooks/usePrices';
import { formatUnits } from 'viem';
import { ReactElement, useEffect } from 'react';
import { Eth, Chainlink } from '@web3uikit/icons';
import { Token } from '../../constants/symbols';

export const Prices: React.FC = () => {
  const { linkPrice, ethPrice, updatePrices, isLoading } = usePrices();
  const width = '290px';
  const height = '350px';

  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
    }, 30000); // 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, [updatePrices]);

  const renderPlanCard = (title: Token, token: Token, price: bigint, icon: ReactElement, address: string) => {
    return (
      <div
        key={token}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PlanCard
          description={
            <Typography variant="caption14" weight="550" key={`${token}-feed`}>
              Via Chainlink Data Feeds
            </Typography>
          }
          features={[]}
          width={width}
          height={height}
          horizontalLine
          isCurrentPlan
          ctaButton={
            <div className="faucet" key={`${token}-cta`}>
              <LinkTo icon={icon} address={address} text="Faucet" type="external" />
            </div>
          }
          price={<PriceDisplay isLoading={isLoading} value={price} key={`${token}-price`} />}
          themeColor="rgba(103, 58, 194, 0.6)"
          title={title}
        />
      </div>
    );
  };

  return (
    <div>
      <h2>Prices</h2>
      <div className="prices">
        {renderPlanCard(
          Token.Link,
          Token.Link,
          linkPrice,
          <Chainlink fontSize="2rem" />,
          'https://faucets.chain.link/sepolia'
        )}
        {renderPlanCard(
          Token.wETH,
          Token.wETH,
          ethPrice,
          <Eth fontSize="2rem" />,
          'https://sepolia.etherscan.io/address/0xdd13E55209Fd76AfE204dBda4007C227904f0a81#writeContract#F5'
        )}
      </div>
    </div>
  );
};

interface PriceDisplayProps {
  isLoading: boolean;
  value: bigint;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ isLoading, value }) => {
  if (isLoading) {
    return (
      <div style={{ margin: 'auto' }}>
        <Loading size={12} spinnerColor="cornflowerblue" spinnerType="wave" />
      </div>
    );
  }

  return (
    <Typography variant="h1" weight="700">
      {formatWithDecimals(value)} $
    </Typography>
  );
};

// create a function that format the given bigint to a string and fix the decimal places to 4
const formatWithDecimals = (value: bigint) => {
  const valueLength = value.toString().length;
  return formatUnits(value, 8)
    .toString()
    .slice(0, valueLength - 4);
};
