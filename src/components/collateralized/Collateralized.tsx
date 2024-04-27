import React from 'react';
import './Collateralized.css';
import { Button, Table, Tag } from '@web3uikit/core';
import { Blockie } from '@web3uikit/web3';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { MagicWand } from '@web3uikit/icons';

const trimAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const generateRandomAccounts = (): string[] => {
  const accounts: string[] = [];
  for (let i = 0; i < 3; i++) {
    const key = generatePrivateKey();
    const account = privateKeyToAccount(key);
    accounts.push(trimAddress(account.address.toLowerCase()));
  }

  return accounts;
};

export const Collateralized: React.FC = () => {
  const randomAccounts = generateRandomAccounts();
  const holdersData = [
    {
      walletAddress: randomAccounts[0],
      healthFactor: 1,
      liquidateEnabled: true,
    },
    {
      walletAddress: randomAccounts[1],
      healthFactor: 0.5,
      liquidateEnabled: true,
    },
    {
      walletAddress: randomAccounts[2],
      healthFactor: 2,
      liquidateEnabled: false,
    },
  ];

  // create a functoin that returns 'green' if healthFactor is greater than 1, otherwise 'red'
  const getHealthFactorColor = (healthFactor: number): 'green' | 'red' => {
    return healthFactor > 1 ? 'green' : 'red';
  };

  return (
    <section className="holders">
      <h2>Collateralized</h2>
      <Table
        columnsConfig="0.25fr 1fr 1fr 1fr"
        data={holdersData.map((holder) => [
          <Blockie seed={holder.walletAddress} />,
          <span style={{ margin: 'auto 0' }}>{holder.walletAddress}</span>,
          <Tag color={getHealthFactorColor(holder.healthFactor)} text={holder.healthFactor.toString()} />,
          <Button
            icon={<MagicWand fontSize="1rem" />}
            disabled={!holder.liquidateEnabled}
            text="Woosh!"
            theme="secondary"
          />,
        ])}
        header={['', 'Wallet Address', 'Health Factor', 'Liquidatable']}
        maxPages={1}
        noPagination
        onPageNumberChanged={() => {}}
        onRowClick={() => {}}
        pageSize={holdersData.length}
      />
    </section>
  );
};
