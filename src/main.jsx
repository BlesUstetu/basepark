import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"

import "@rainbow-me/rainbowkit/styles.css"

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { base } from "wagmi/chains"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

const config = getDefaultConfig({
  appName: "BaseParkVault",
  // CATATAN: Pastikan ini adalah Project ID dari WalletConnect Cloud (bukan address dompet)
  projectId: "0xd2f9411079a3362d3e20cef1719cf2d8a3923d8d", 
  chains: [base],
  ssr: true, // Tambahkan ini jika kamu berencana menggunakan Next.js nantinya
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider> 
          {/* Prop chains={[base]} di atas sudah dihapus karena sudah ada di config */}
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
