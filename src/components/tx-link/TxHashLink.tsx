import { Hex } from 'viem';

interface TxHashLinkProps {
  txHash: Hex;
}

export const TxHashLink: React.FC<TxHashLinkProps> = ({ txHash }) => {
  return (
    <>
      Transaction submited! &nbsp;
      <u>
        <i>
          <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" style={{ textDecoration: 'underline' }}>
            {txHash}
          </a>
        </i>
      </u>
    </>
  );
};
