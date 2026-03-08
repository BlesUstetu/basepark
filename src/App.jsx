import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { 
  useReadContract, 
  useWriteContract, 
  useAccount, 
  useBalance 
} from "wagmi";
import { parseEther, formatEther } from "viem";

// KOMPONEN (Pastikan file-file ini ada di folder components)
import NeonTitle from "./components/NeonTitle";
import TVLChart from "./components/TVLChart";

// KONFIGURASI KONTRAK DARI REMIX
const CONTRACT_ADDRESS = "0xd2f9411079a3362d3e20cef1719cf2d8a3923d8d"; 
const CONTRACT_ABI = [ /* PASTE ABI JSON DARI REMIX DISINI */ ];

export default function App() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [tvlData, setTvlData] = useState([]);

  // 1. Ambil Saldo ETH User di dompet
  const { data: userBalance } = useBalance({
    address: address,
  });

  // 2. Ambil Saldo User yang tersimpan di dalam Vault (Read Contract)
  const { data: vaultBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf', // Sesuaikan nama fungsi di Remix
    args: [address],
  });

  const { writeContract } = useWriteContract();

  // FUNGSI TRANSAKSI
  const handleDeposit = () => {
    if (!amount) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'deposit', 
      value: parseEther(amount),
    });
  };

  const handleWithdraw = () => {
    if (!amount) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'withdraw',
      args: [parseEther(amount)],
    });
  };

  // Simulasi TVL Chart
  useEffect(() => {
    const interval = setInterval(() => {
      setTvlData(prev => [...prev.slice(-10), {
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        tvl: Math.random() * 100 + 150
      }]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="logo">BASEPARK<span>VAULT</span></div>
        <ConnectButton label="Connect" />
      </nav>

      <main className="container">
        <div className="hero">
          <NeonTitle />
          <p className="subtitle">Secure High-Yield Vault on Base Network</p>
        </div>

        <div className="dashboard-grid">
          {/* KARTU INTERAKSI VAULT */}
          <div className="glass-card vault-card">
            <div className="card-header">
              <h3 className="card-title">Vault Interface</h3>
              <div className={`status-pill ${isConnected ? 'active' : ''}`}>
                {isConnected ? '● Connected' : '○ Disconnected'}
              </div>
            </div>

            {/* TAMPILAN SALDO USER */}
            <div className="balance-info">
              <div className="balance-item">
                <span className="label">Wallet Balance</span>
                <span className="value">
                  {userBalance ? Number(userBalance.formatted).toFixed(4) : "0.00"} ETH
                </span>
              </div>
              <div className="balance-item highlighted">
                <span className="label">Staked in Vault</span>
                <span className="value">
                  {vaultBalance ? Number(formatEther(vaultBalance)).toFixed(4) : "0.00"} ETH
                </span>
              </div>
            </div>
            
            <div className="deposit-box">
              <div className="input-header">
                <label>Amount to Process</label>
                <button className="btn-max" onClick={() => setAmount(userBalance?.formatted || "0")}>MAX</button>
              </div>
              <input 
                type="number" 
                placeholder="0.00" 
                className="vault-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              
              <div className="button-group">
                <button className="btn-withdraw" onClick={handleWithdraw}>Withdraw</button>
                <button className="btn-deposit" onClick={handleDeposit}>Deposit</button>
              </div>

              <button className="btn-claim" onClick={() => alert("Claim logic here!")}>
                ✨ Claim Accumulating Rewards
              </button>
            </div>
          </div>

          {/* KARTU GRAFIK */}
          <div className="glass-card chart-card">
            <h3 className="card-title">Protocol Growth (TVL)</h3>
            <TVLChart data={tvlData} />
            <p className="hint">TVL is calculated across all users on Base Network</p>
          </div>
        </div>
      </main>
    </div>
  );
}
