import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { 
  useReadContract, 
  useWriteContract, 
  useAccount, 
  useBalance, 
  useWaitForTransactionReceipt 
} from "wagmi";
import { parseEther, formatEther } from "viem";
import toast, { Toaster } from "react-hot-toast";

// KOMPONEN (Pastikan file ini ada di folder /src/components/)
import NeonTitle from "./components/NeonTitle";
import TVLChart from "./components/TVLChart";

// KONTRAK DATA (GANTI DENGAN HASIL REMIX)
const CONTRACT_ADDRESS = "0xd2f9411079a3362d3e20cef1719cf2d8a3923d8d"; 
const CONTRACT_ABI = [ /* PASTE ABI JSON DARI REMIX DISINI */ ];

export default function App() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");

  // 1. Ambil Saldo Wallet (ETH di Dompet)
  const { data: userBalance } = useBalance({ address });

  // 2. Ambil Saldo Vault (ETH yang sudah di-Staking)
  const { data: vaultBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf', 
    args: [address],
  });

  const { data: hash, writeContract, isPending } = useWriteContract();

  // 3. Monitor Status Transaksi
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isPending) toast.loading("Confirm in Wallet...", { id: "tx" });
    if (isConfirming) toast.loading("Verifying on Base...", { id: "tx" });
    if (isConfirmed) {
      toast.success("Transaction Confirmed! 🎉", { id: "tx", duration: 5000 });
      setAmount(""); 
    }
  }, [isPending, isConfirming, isConfirmed]);

  // FUNGSI AKSI
  const handleDeposit = () => {
    if (!amount || amount === "0") return toast.error("Enter an amount!");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'deposit', 
      value: parseEther(amount),
    });
  };

  const handleWithdraw = () => {
    if (!amount || amount === "0") return toast.error("Enter an amount!");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'withdraw',
      args: [parseEther(amount)],
    });
  };

  return (
    <div className="app-shell">
      <Toaster position="top-center" toastOptions={{ className: 'hot-toast-bar' }} />
      
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
          {/* VAULT CARD */}
          <div className="glass-card vault-card">
            <div className="card-header">
              <h3 className="card-title">Vault Control</h3>
              <div className={`status-pill ${isConnected ? 'active' : ''}`}>
                {isConnected ? '● Connected' : '○ Disconnected'}
              </div>
            </div>

            <div className="balance-info">
              <div className="balance-item">
                <span className="label">Wallet Balance</span>
                <span className="value">{userBalance ? Number(userBalance.formatted).toFixed(5) : "0.000"} ETH</span>
              </div>
              <div className="balance-item highlighted">
                <span className="label">Staked in Vault</span>
                <span className="value">{vaultBalance ? Number(formatEther(vaultBalance)).toFixed(5) : "0.000"} ETH</span>
              </div>
            </div>
            
            <div className="deposit-box">
              <div className="input-header">
                <label>Amount (ETH)</label>
                <div className="max-buttons">
                  <button className="btn-max dep" onClick={() => setAmount(userBalance?.formatted || "0")}>MAX DEP</button>
                  <button className="btn-max with" onClick={() => setAmount(vaultBalance ? formatEther(vaultBalance) : "0")}>MAX WITH</button>
                </div>
              </div>

              <input 
                type="number" placeholder="0.00" className="vault-input"
                value={amount} onChange={(e) => setAmount(e.target.value)}
              />
              
              <div className="button-group">
                <button className="btn-withdraw raksasa" onClick={handleWithdraw} disabled={isPending || isConfirming}>
                  {isConfirming ? "Wait..." : "Withdraw"}
                </button>
                <button className="btn-deposit raksasa" onClick={handleDeposit} disabled={isPending || isConfirming}>
                  {isConfirming ? "Wait..." : "Deposit"}
                </button>
              </div>

              <button className="btn-claim" onClick={() => toast.success("Rewards claimed (Simulated)")}>
                ✨ Claim Rewards
              </button>
            </div>
          </div>

          {/* CHART CARD */}
          <div className="glass-card chart-card">
            <h3 className="card-title">Live TVL Performance</h3>
            <TVLChart />
            <p className="hint">Data fetched in real-time from Base Layer 2</p>
          </div>
        </div>
      </main>
    </div>
  );
}
