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

// KONFIGURASI KONTRAK (PASTIKAN ALAMAT & ABI BENAR)
const CONTRACT_ADDRESS = "0xd2f9411079a3362d3e20cef1719cf2d8a3923d8d"; 
const CONTRACT_ABI = [ /* PASTE ABI JSON DARI REMIX DISINI */ ];

export default function App() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");

  // 1. Ambil Saldo Wallet (Ini yang memunculkan angka 0.0004 ETH di gambar kamu)
  const { data: userBalance } = useBalance({ address });

  // 2. Ambil Saldo yang sudah didepositkan ke Vault
  const { data: vaultBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf', 
    args: [address],
  });

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isPending) toast.loading("Waiting for Wallet...", { id: "tx" });
    if (isConfirming) toast.loading("Confirming on Base...", { id: "tx" });
    if (isConfirmed) {
      toast.success("Transaction Success! 🎉", { id: "tx", duration: 5000 });
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
        <ConnectButton />
      </nav>

      <main className="container">
        <div className="hero"><NeonTitle /></div>

        <div className="dashboard-grid">
          <div className="glass-card vault-card">
            <div className="card-header">
              <h3 className="card-title">Vault Interface</h3>
              <div className={`status-pill ${isConnected ? 'active' : ''}`}>
                {isConnected ? '● Connected' : '○ Disconnected'}
              </div>
            </div>

            <div className="balance-info">
              <div className="balance-item">
                <span>Wallet Balance</span>
                <span>{userBalance ? Number(userBalance.formatted).toFixed(6) : "0"} ETH</span>
              </div>
              <div className="balance-item highlighted">
                <span>Staked in Vault</span>
                <span>{vaultBalance ? Number(formatEther(vaultBalance)).toFixed(6) : "0"} ETH</span>
              </div>
            </div>
            
            <div className="deposit-box">
              <div className="input-header">
                <label>AMOUNT TO PROCESS</label>
                <div className="max-buttons-wrapper">
                  <button className="btn-max dep" onClick={() => setAmount(userBalance?.formatted || "0")}>MAX DEP</button>
                  <button className="btn-max with" onClick={() => setAmount(vaultBalance ? formatEther(vaultBalance) : "0")}>MAX WITH</button>
                </div>
              </div>

              <input 
                type="number" placeholder="0.00" className="vault-input"
                value={amount} onChange={(e) => setAmount(e.target.value)}
              />
              
              <div className="button-group">
                <button className="btn-withdraw" onClick={() => handleAction('withdraw')} disabled={isPending || isConfirming}>
                  Withdraw
                </button>
                <button className="btn-deposit" onClick={() => handleAction('deposit')} disabled={isPending || isConfirming}>
                  Deposit
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="card-title">Protocol Growth</h3>
            <TVLChart />
          </div>
        </div>
      </main>
    </div>
  );
}
