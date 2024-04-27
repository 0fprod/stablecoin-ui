import './App.css';
import { Balances } from './components/balances/Balances';
import { Github } from './components/github/Github';
import { HeroApp } from './components/hero-app/HeroApp';
import { Collateralized } from './components/collateralized/Collateralized';
import { Nav } from './components/nav/Nav';
import { Prices } from './components/prices/Prices';
import { Stats } from './components/stats/Stats';

function App() {
  return (
    <main>
      <Github />
      <Nav />
      <HeroApp />
      <Prices />
      <Stats />
      <Balances />
      <Collateralized />
    </main>
  );
}

export default App;
