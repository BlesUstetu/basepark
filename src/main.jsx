import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

import "@rainbow-me/rainbowkit/styles.css"

import {
getDefaultConfig,
RainbowKitProvider
} from "@rainbow-me/rainbowkit"

import { WagmiProvider } from "wagmi"
import { base } from "wagmi/chains"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const config = getDefaultConfig({
appName:"BaseParkVault",
projectId:"baseparkvault",
chains:[base],
ssr:false
})

const queryClient=new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(

<WagmiProvider config={config}>

<QueryClientProvider client={queryClient}>

<RainbowKitProvider>

<App/>

</RainbowKitProvider>

</QueryClientProvider>

</WagmiProvider>

)
