import React from 'react';
import { useEffect, useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

// --- TAMBAHKAN INI (ID DARI REMIX) ---
const CONTRACT_ADDRESS = "0xd2f9411079a3362d3e20cef1719cf2d8a3923d8d"; 
const CONTRACT_ABI = [ 
  // Paste ABI (JSON) yang kamu copy dari Remix di sini
];
// -------------------------------------

import NeonTitle from "./components/NeonTitle"
import VaultCard from "./components/VaultCard"
import TVLChart from "./components/TVLChart"

// Import hook dari Wagmi untuk interaksi kontrak
import { useReadContract } from 'wagmi' 

export default function App(){
  const [tvlData, setTvlData] = useState([])

  // Contoh mengambil data saldo dari Smart Contract (ID Remix)
  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'totalAssets', // Ganti dengan nama fungsi di contract kamu
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTvlData(data => [
        ...data,
        {
          time: new Date().toLocaleTimeString(),
          // Gunakan data asli dari contract jika ada, atau random untuk simulasi
          tvl: balance ? Number(balance) : Math.random() * 100 
        }
      ].slice(-10)) // Batasi agar grafik tidak terlalu penuh
    }, 5000)

    return () => clearInterval(interval)
  }, [balance])

  return (
    <div className="container">
      <NeonTitle/>
      
      <div className="wallet">
        <ConnectButton />
      </div>

      {/* Kamu bisa oper CONTRACT_ADDRESS ke VaultCard jika perlu */}
      <VaultCard contractAddress={CONTRACT_ADDRESS} abi={CONTRACT_ABI} />

      <TVLChart data={tvlData}/>
    </div>
  )
}
