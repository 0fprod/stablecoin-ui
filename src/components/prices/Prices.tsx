import { Loading, PlanCard, Typography } from '@web3uikit/core';
import './Prices.css';
import { usePrices } from '../../hooks/usePrices';
import { formatUnits } from 'viem';
import { useEffect } from 'react';

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
    <Typography color="white" variant="h1" weight="700">
      {formatWithDecimals(value)} $
    </Typography>
  );
};

export const Prices: React.FC = () => {
  const { linkPrice, ethPrice, updatePrices, isLoading } = usePrices();
  const width = '290px';
  const height = '300px';

  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
    }, 30000); // 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, [updatePrices]);

  return (
    <div>
      <h2>Prices</h2>
      <div className="prices">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <PlanCard
            description={
              <Typography color="white" variant="caption14" weight="550" key="link-feed">
                Via Chainlink Data Feeds
              </Typography>
            }
            features={[]}
            height={height}
            width={width}
            horizontalLine
            isCurrentPlan
            price={<PriceDisplay isLoading={isLoading} value={linkPrice} />}
            themeColor="rgba(103, 58, 194, 0.6)"
            title="Link"
          />
        </div>
        <div
          key="WETH"
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <PlanCard
            description={
              <Typography color="white" variant="caption14" weight="550" key="eth-feed">
                Via Chainlink Data Feeds
              </Typography>
            }
            features={[]}
            height={height}
            width={width}
            horizontalLine
            isCurrentPlan
            price={<PriceDisplay isLoading={isLoading} value={ethPrice} />}
            themeColor="rgba(103, 58, 194, 0.6)"
            title="wETH"
          />
        </div>
      </div>
    </div>
  );
};

// create a function that format the given bigint to a string and fix the decimal places to 4
const formatWithDecimals = (value: bigint) => {
  const valueLength = value.toString().length;
  return formatUnits(value, 8)
    .toString()
    .slice(0, valueLength - 3);
};
