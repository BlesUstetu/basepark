import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract, useWriteContract, useAccount, useBalance, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import toast, { Toaster } from "react-hot-toast"; // <-- Import Notifikasi

import NeonTitle from "./components/NeonTitle";
import TVLChart from "./components/TVLChart";

const CONTRACT_ADDRESS = "0xd2f9411079a3362d3e20cef1719cf2d8a3923d8d"; 
const CONTRACT_ABI = [ /* ABI DARI REMIX */ ];

export default function App() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const { data: userBalance } = useBalance({ address });
  const { data: vaultBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf',
    args: [address],
  });

  const { data: hash, writeContract, isPending } = useWriteContract();

  // Logika Menunggu Transaksi Selesai di Blockchain
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Efek ketika status transaksi berubah
  useEffect(() => {
    if (isPending) toast.loading("Waiting for wallet confirmation...", { id: "tx" });
    if (isConfirming) toast.loading("Processing on Base Network...", { id: "tx" });
    if (isConfirmed) {
      toast.success("Transaction Confirmed! 🎉", { id: "tx", duration: 5000 });
      setAmount(""); // Reset input setelah sukses
    }
  }, [isPending, isConfirming, isConfirmed]);

  const handleDeposit = () => {
    if (!amount) return toast.error("Please enter an amount!");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'deposit', 
      value: parseEther(amount),
    });
  };

  const handleWithdraw = () => {
    if (!amount) return toast.error("Please enter an amount!");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'withdraw',
      args: [parseEther(amount)],
    });
  };

  return (
    <div className="app-shell">
      {/* Komponen Notifikasi (Wajib Ada) */}
      <Toaster position="top-center" reverseOrder={false} />
      
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
          <div className="glass-card vault-card">
            <div className="balance-info">
              <div className="balance-item">
                <span>Wallet: {userBalance ? Number(userBalance.formatted).toFixed(4) : "0"} ETH</span>
              </div>
              <div className="balance-item highlighted">
                <span>In Vault: {vaultBalance ? Number(formatEther(vaultBalance)).toFixed(4) : "0"} ETH</span>
              </div>
            </div>
            
            <div className="deposit-box">
              <input 
                type="number" placeholder="0.00" className="vault-input"
                value={amount} onChange={(e) => setAmount(e.target.value)}
              />
              <div className="button-group">
                <button className="btn-withdraw" onClick={handleWithdraw} disabled={isPending || isConfirming}>
                  {isConfirming ? "Processing..." : "Withdraw"}
                </button>
                <button className="btn-deposit" onClick={handleDeposit} disabled={isPending || isConfirming}>
                  {isConfirming ? "Confirming..." : "Deposit"}
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card chart-card">
            <h3 className="card-title">Live Protocol TVL</h3>
            <TVLChart />
          </div>
        </div>
      </main>
    </div>
  );
}
