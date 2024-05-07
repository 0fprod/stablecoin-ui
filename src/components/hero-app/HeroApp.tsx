import { Hero, Typography } from '@web3uikit/core';
import './HeroApp.css';

export const HeroApp = () => {
  return (
    <div className="hero-wrapper">
      <Hero
        backgroundURL="https://moralis.io/wp-content/uploads/2021/06/blue-blob-background-2.svg"
        height="200px"
        linearGradient="linear-gradient(113.54deg, rgba(103, 58, 194, 0.6) 14.91%, rgba(122, 74, 221, 0.498) 25.92%, rgba(209, 103, 255, 0.03) 55.76%), linear-gradient(160.75deg, #7A4ADD 41.37%, #D57BFF 98.29%)"
        textColor="#FFFFFF"
        title="Decentralized Algorithmic Stablecoin"
        subTitle="Pegged to 1 USD ;)"
        customImage={{
          url: '/dsclogo.png',
        }}
      />
      <Typography monospace={true}>
        Welcome to our DeFi playground! 🎉 Here, you can mint DSC (Dezentralized StableCoin) by locking up collateral
        like LINK or wETH. But there's a catch – you've got to be twice as covered with collateral to mint. Otherwise,
        your health factor could take a hit and other users might swoop in for liquidation! 😱 So, buckle up and
        double-check your collateral before you dive in. 💼
      </Typography>
    </div>
  );
};
