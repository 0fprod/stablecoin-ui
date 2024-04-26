import './Nav.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Nav = () => {
  return (
    <nav className="nav">
      <ConnectButton chainStatus="icon" />
    </nav>
  );
};
