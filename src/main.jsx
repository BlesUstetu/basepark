
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"

import "@rainbow-me/rainbowkit/styles.css"

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { base } from "wagmi/chains"

const config = getDefaultConfig({
  appName: "BaseParkVault",
  projectId: "0xd2f9411079a3362d3e20cef1719cf2d8a3923d8d",
  chains: [base]
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <App/>
      </RainbowKitProvider>
    </WagmiProvider>
  </React.StrictMode>
)
