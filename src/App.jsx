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

import NeonTitle from "./components/NeonTitle";
import TVLChart from "./components/TVLChart";

// GANTI DENGAN DATA DARI REMIX
const CONTRACT_ADDRESS = "0xd2f9411079a3362d3e20cef1719cf2d8a3923d8d"; 
const CONTRACT_ABI = [ /* PASTE ABI JSON DISINI */ ];

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
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isPending) toast.loading("Confirm in Wallet...", { id: "tx" });
    if (isConfirming) toast.loading("Verifying on Base...", { id: "tx" });
    if (isConfirmed) {
      toast.success("Transaction Confirmed! 🎉", { id: "tx", duration: 5000 });
      setAmount(""); 
    }
  }, [isPending, isConfirming, isConfirmed]);

  const handleAction = (type) => {
    if (!amount || amount === "0") return toast.error("Enter an amount!");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: type, 
      ...(type === 'deposit' ? { value: parseEther(amount) } : { args: [parseEther(amount)] }),
    });
  };

  return (
    <div className="app-shell">
      <Toaster position="top-center" />
      
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
          <div className="glass-card">
            <div className="balance-info">
              <div className="balance-item">
                <span>Wallet Balance</span>
                <span>{userBalance ? Number(userBalance.formatted).toFixed(5) : "0.000"} ETH</span>
              </div>
              <div className="balance-item highlighted">
                <span>Staked in Vault</span>
                <span>{vaultBalance ? Number(formatEther(vaultBalance)).toFixed(5) : "0.000"} ETH</span>
              </div>
            </div>
            
            <div className="vault-interface-container">
              {/* HEADER TIGA KOLOM: KIRI - TENGAH - KANAN */}
              <div className="input-header-fixed">
                <div className="header-col col-left">
                  <button 
                    className="btn-max-final with" 
                    onClick={() => setAmount(vaultBalance ? formatEther(vaultBalance) : "0")}
                  >
                    MAX WITH
                  </button>
                </div>

                <div className="header-col col-center">
                  <span className="label-center-text">AMOUNT TO PROCESS</span>
                </div>

                <div className="header-col col-right">
                  <button 
                    className="btn-max-final dep" 
                    onClick={() => setAmount(userBalance?.formatted || "0")}
                  >
                    MAX DEP
                  </button>
                </div>
              </div>

              <input 
                type="number" placeholder="0.00" className="vault-input-massive"
                value={amount} onChange={(e) => setAmount(e.target.value)}
              />
              
              <div className="action-buttons-massive">
                <button className="btn-withdraw-massive" onClick={() => handleAction('withdraw')} disabled={isPending || isConfirming}>
                  Withdraw
                </button>
                <button className="btn-deposit-massive" onClick={() => handleAction('deposit')} disabled={isPending || isConfirming}>
                  Deposit
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="card-title">Live TVL Growth</h3>
            <TVLChart />
          </div>
        </div>
      </main>
    </div>
  );
}
