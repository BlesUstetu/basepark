import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { parseEther } from "viem";

// KOMPONEN (Pastikan file ini ada di folder components)
import NeonTitle from "./components/NeonTitle";
import TVLChart from "./components/TVLChart";

// KONFIGURASI KONTRAK DARI REMIX
const CONTRACT_ADDRESS = "0xd2f9411079a3362d3e20cef1719cf2d8a3923d8d"; // <--- Ganti ID Remix
const CONTRACT_ABI = [ /* PASTE ABI JSON DARI REMIX DISINI */ ];

export default function App() {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [tvlData, setTvlData] = useState([]);

  const { writeContract } = useWriteContract();

  // Fungsi untuk Deposit
  const handleDeposit = () => {
    if (!amount) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'deposit', // Sesuaikan nama fungsi di Solidity kamu
      args: [], 
      value: parseEther(amount), // Mengirim ETH sesuai input
    });
  };

  // Simulasi/Read Data TVL
  useEffect(() => {
    const interval = setInterval(() => {
      setTvlData(prev => [...prev.slice(-10), {
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        tvl: Math.random() * 100 + 50
      }]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="logo">BASEPARK<span>VAULT</span></div>
        <ConnectButton label="Connect Wallet" />
      </nav>

      <main className="container">
        <div className="hero">
          <NeonTitle />
          <p className="subtitle">High-Yield Autonomous Vault on Base Network</p>
        </div>

        <div className="dashboard-grid">
          {/* BAGIAN DEPOSIT */}
          <div className="glass-card vault-card">
            <h3 className="card-title">Vault Deposit</h3>
            <div className="status-row">
              <span>Status:</span>
              <span className={isConnected ? "text-green" : "text-red"}>
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            
            <div className="deposit-box">
              <input 
                type="number" 
                placeholder="0.00 ETH" 
                className="vault-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button className="btn-deposit" onClick={handleDeposit}>
                Deposit
              </button>
            </div>
            <p className="hint">Funds are locked for 7 days</p>
          </div>

          {/* BAGIAN GRAFIK */}
          <div className="glass-card chart-card">
            <h3 className="card-title">TVL Performance</h3>
            <TVLChart data={tvlData} />
          </div>
        </div>
      </main>
    </div>
  );
}
