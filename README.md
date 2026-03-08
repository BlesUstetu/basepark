# BaseParkVault Frontend

Neon-styled Web3 dashboard for interacting with the **BaseParkVault smart contract**.
This frontend allows users to connect multiple wallets, deposit assets into the vault, and visualize Total Value Locked (TVL) in real time.

Built for the **Base ecosystem**.

---

## ✨ Features

* 🔐 Multi-wallet connection
* 💳 Deposit ETH into the vault
* 📊 Real-time TVL chart
* 🌐 Compatible with Base network
* 🎨 Neon animated DeFi UI
* ⚡ Fast React + Vite architecture

---

## 🧰 Tech Stack

* React
* Vite
* Ethers.js
* Wagmi
* RainbowKit
* Recharts

---

## 🔌 Supported Wallets

The app supports multiple wallets through WalletConnect:

* MetaMask
* Coinbase Wallet
* Trust Wallet
* Rainbow Wallet
* WalletConnect-compatible wallets

---

## 📂 Project Structure

```
baseparkvault-frontend
│
├ index.html
├ package.json
│
└ src
   ├ main.jsx
   ├ App.jsx
   ├ index.css
   │
   └ components
        ├ NeonTitle.jsx
        ├ VaultCard.jsx
        └ TVLChart.jsx
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/baseparkvault-frontend.git
cd baseparkvault-frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

## 🔧 Configuration

### 1. Smart Contract Address

Edit:

```
src/components/VaultCard.jsx
```

Replace:

```
YOUR_CONTRACT_ADDRESS
```

with your deployed vault contract.

---

### 2. WalletConnect Project ID

Edit:

```
src/main.jsx
```

Replace:

```
YOUR_WALLETCONNECT_PROJECT_ID
```

Get a free ID from:

https://cloud.walletconnect.com

---

## 🚀 Deployment

This project can be deployed easily using:

* Vercel
* Netlify
* Cloudflare Pages

Example deployment using Vercel:

```
npm run build
```

Then connect the repository to Vercel.

---

## 🌐 Network

The application is configured for the **Base network**.

---

## 📜 License

MIT License

---

## 👨‍💻 Author

BaseParkVault Team

---

## ⚠️ Disclaimer

This project is provided for educational and experimental purposes.
Always audit smart contracts before using them in production.
