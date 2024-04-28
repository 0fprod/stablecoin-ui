import './Stats.css';
import { Illustration, Widget } from '@web3uikit/core';
import { useStats } from '../../hooks/useStats';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { formatUnits } from 'viem';

export const Stats = () => {
  const { address } = useAccount();
  const { circulatingSupply, holders, healthFactor, isLoading, fetchStats } = useStats(address);

  const formatHealthFactor = (factor: bigint) => {
    const formatted = (Number(factor) / 10 ** 18).toFixed(2) + ' %';
    return formatted;
  };

  useEffect(() => {
    if (address) {
      fetchStats();
    }
  }, [address, fetchStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <section>
      <h2>Stats</h2>
      <div className="stats">
        {address && (
          <div className="group">
            <Widget info={formatHealthFactor(healthFactor)} title="Your Health Factor" isLoading={isLoading} />
            <Illustration logo="confirmed" width="180" height="180px" />
          </div>
        )}
        <div className="group">
          <Widget info={formatUnits(circulatingSupply, 18)} title="Circulating supply" isLoading={isLoading} />
          <Illustration logo="token" width="180" height="180px" />
        </div>
        <div className="group">
          <Widget info={holders.toString()} title="Total Holders" isLoading={isLoading} />
          <Illustration logo="beanBoyStepThree" width="180" height="180px" />
        </div>
      </div>
    </section>
  );
};
