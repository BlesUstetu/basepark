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
  projectId: "0xd2f9411079a3362d3e20cef1719cf2d8a3923d8d",
  chains: [base],
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider chains={[base]}>
          <App />
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
