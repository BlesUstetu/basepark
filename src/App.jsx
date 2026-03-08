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

// KONFIGURASI KONTRAK (GANTI DENGAN DATA REMIX KAMU)
const CONTRACT_ADDRESS = "0xd2f9411079a3362d3e20cef1719cf2d8a3923d8d"; 
const CONTRACT_ABI = [ /* PASTE ABI JSON DARI REMIX DISINI */ ];

export default function App() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [tvlData, setTvlData] = useState([]);

  // 1. Baca Saldo Dompet (Wallet)
  const { data: userBalance } = useBalance({ address });

  // 2. Baca Saldo yang sudah di-Staking di Vault
  const { data: vaultBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf', 
    args: [address],
  });

  const { data: hash, writeContract, isPending } = useWriteContract();

  // 3. Monitor Status Transaksi di Blockchain
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isPending) toast.loading("Waiting for Wallet...", { id: "tx" });
    if (isConfirming) toast.loading("Confirming on Base...", { id: "tx" });
    if (isConfirmed) {
      toast.success("Transaction Success! 🎉", { id: "tx", duration: 5000 });
      setAmount(""); 
    }
  }, [isPending, isConfirming, isConfirmed]);

  // FUNGSI AKSI
  const handleDeposit = () => {
    if (!amount || amount === "0") return toast.error("Enter amount!");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'deposit', 
      value: parseEther(amount),
    });
  };

  const handleWithdraw = () => {
    if (!amount || amount === "0") return toast.error("Enter amount!");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'withdraw',
      args: [parseEther(amount)],
    });
  };

  return (
    <div className="app-shell">
      <Toaster position="top-center" />
      
      <nav className="navbar">
        <div className="logo">BASEPARK<span>VAULT</span></div>
        <ConnectButton />
      </nav>

      <main className="container">
        <div className="hero">
          <NeonTitle />
          <p className="subtitle">High-Yield Autonomous Vault on Base Network</p>
        </div>

        <div className="dashboard-grid">
          {/* VAULT INTERACTION CARD */}
          <div className="glass-card vault-card">
            <div className="balance-info">
              <div className="balance-item">
                <span className="label">Wallet Balance</span>
                <span className="value">{userBalance ? Number(userBalance.formatted).toFixed(5) : "0"} ETH</span>
              </div>
              <div className="balance-item highlighted">
                <span className="label">Staked in Vault</span>
                <span className="value">{vaultBalance ? Number(formatEther(vaultBalance)).toFixed(5) : "0"} ETH</span>
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
                <button className="btn-withdraw" onClick={handleWithdraw} disabled={isPending || isConfirming}>
                  {isConfirming ? "Wait..." : "Withdraw"}
                </button>
                <button className="btn-deposit" onClick={handleDeposit} disabled={isPending || isConfirming}>
                  {isConfirming ? "Wait..." : "Deposit"}
                </button>
              </div>
            </div>
          </div>

          {/* PERFORMANCE CHART CARD */}
          <div className="glass-card chart-card">
            <h3 className="card-title">Vault TVL Growth</h3>
            <TVLChart />
            <p className="hint">Data updates every 5 seconds from Base blockchain</p>
          </div>
        </div>
      </main>
    </div>
  );
}
