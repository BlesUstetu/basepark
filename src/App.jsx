import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract, useAccount } from "wagmi";
import NeonTitle from "./components/NeonTitle";
import VaultCard from "./components/VaultCard";
import TVLChart from "./components/TVLChart";

// KONEKSI SMART CONTRACT DARI REMIX
const CONTRACT_ADDRESS = "0xd2f9411079a3362d3e20cef1719cf2d8a3923d8d"; // <--- GANTI INI
const CONTRACT_ABI = [ /* PASTE ABI DARI REMIX DISINI */ ];

export default function App() {
  const { isConnected } = useAccount();
  const [tvlData, setTvlData] = useState([]);

  // Membaca total saldo dari Smart Contract
  const { data: totalAssets } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "totalAssets", 
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTvlData((prev) => [
        ...prev.slice(-15),
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tvl: totalAssets ? Number(totalAssets) / 1e18 : Math.random() * 100,
        },
      ]);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalAssets]);

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="logo">BASEPARK<span>VAULT</span></div>
        <ConnectButton showBalance={false} chainStatus="icon" />
      </nav>

      <main className="container">
        <header className="hero">
          <NeonTitle />
          <p className="subtitle">Secure your assets in the premier vault on Base Network</p>
        </header>

        <div className="dashboard-grid">
          <div className="card-section">
            <VaultCard address={CONTRACT_ADDRESS} abi={CONTRACT_ABI} />
          </div>
          
          <div className="chart-section">
            <div className="glass-card">
              <h3>Vault Performance (TVL)</h3>
              <TVLChart data={tvlData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
