import './Balances.css';
import React from 'react';
import { useAccount } from 'wagmi';
import { TokenGroups } from './components/TokenGroups/TokenGroups';

export const Balances: React.FC = () => {
  const { address } = useAccount();

  if (!address) {
    return <h3> Connect your wallet! </h3>;
  }

  return (
    <section>
      <h2>Balances</h2>
      <TokenGroups account={address} />
    </section>
  );
};
