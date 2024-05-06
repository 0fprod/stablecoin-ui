import React, { useEffect, useRef } from 'react';
import './Collateralized.css';
import { Button, Table, Tag } from '@web3uikit/core';
import { Blockie } from '@web3uikit/web3';
import { MagicWand } from '@web3uikit/icons';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useDscEngine } from '../../hooks/useDscEngine';
import { fetchHolders } from '../../graphql/fetchHolders';
import { Hex } from 'viem';
import { DomainHolder, mapFromGqlHolderToDomainHolder } from '../models/Holder';
import { LiquidateModal } from './modal/liquidate';

export const Collateralized: React.FC = () => {
  const { address } = useAccount();
  const { data, isLoading, isError } = useQuery({
    queryKey: [address],
    queryFn: () => fetchHolders(address as Hex),
  });
  const { getHealthFactor } = useDscEngine();
  const [holdersData, setHoldersData] = React.useState<DomainHolder[]>([]);
  const prevData = useRef(data);
  const prevHolderData = useRef(holdersData);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [insolventUserToLiquidate, setInsolventUserToLiquidate] = React.useState<string>('');

  const getHealthFactorColor = (_holder: DomainHolder): 'green' | 'red' | 'yellow' => {
    if (_holder.healthFactor > 15) {
      return 'green';
    } else if (_holder.healthFactor < 1) {
      return 'red';
    }

    return 'yellow';
  };

  useEffect(() => {
    if (data && data != prevData.current && address) {
      const mappedData = data.map(mapFromGqlHolderToDomainHolder);
      setHoldersData(mappedData);
      prevData.current = data;
    }
  }, [data, address, getHealthFactor]);

  useEffect(() => {
    if (address && holdersData.length && holdersData != prevHolderData.current) {
      const fetchHealthFactor = async () => {
        const promises = holdersData.map(async (holder) => {
          const healthFactor = await getHealthFactor(holder.walletAddress as Hex);
          return { ...holder, healthFactor };
        });
        const results = await Promise.allSettled(promises);
        const updatedHoldersData = results.map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            console.error(`Failed to fetch health factor for holder at index ${index}`);
            return holdersData[index];
          }
        });
        const holdersWithHf = updatedHoldersData.map((holder) => {
          return {
            ...holder,
            healthFactor: Number(holder.healthFactor) / 10 ** 18,
          };
        });
        setHoldersData(holdersWithHf);
        prevHolderData.current = holdersWithHf;
      };
      fetchHealthFactor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, holdersData]);

  const onLiquidate = (insolvetUser: string) => {
    setInsolventUserToLiquidate(insolvetUser);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setInsolventUserToLiquidate('');
  };

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <section className="holders">
      <h2>Collateralized</h2>
      <Table
        columnsConfig="0.25fr 1fr 1fr 1fr"
        data={holdersData.map((holder) => [
          <Blockie seed={holder.walletAddress} />,
          <span style={{ margin: 'auto 0' }}>{holder.walletAddress}</span>,
          <Tag color={getHealthFactorColor(holder)} text={holder.healthFactor.toFixed(2)} />,
          <Button
            icon={<MagicWand fontSize="1rem" />}
            disabled={false}
            text="Woosh!"
            theme="secondary"
            onClick={() => {
              onLiquidate(holder.walletAddress);
            }}
          />,
        ])}
        header={['', 'Wallet Address', 'Health Factor', 'Liquidate!']}
        maxPages={1}
        noPagination
        onPageNumberChanged={() => {}}
        onRowClick={() => {}}
        pageSize={holdersData.length}
      />
      <LiquidateModal
        isVisible={showModal}
        closeModal={closeModal}
        insolventUserToLiquidate={insolventUserToLiquidate as Hex}
      />
    </section>
  );
};
