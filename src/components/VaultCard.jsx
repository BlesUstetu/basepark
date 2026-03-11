import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { CONTRACTS } from "../config/contracts"

export default function VaultCard(){

const [amount,setAmount] = useState("")
const [tvl,setTvl] = useState("0")
const [userBalance,setUserBalance] = useState("0")
const [wallet,setWallet] = useState(null)
const [loading,setLoading] = useState(false)
const [error,setError] = useState("")

const CONTRACT_ADDRESS = CONTRACTS.BaseParkVault.address
const CONTRACT_ABI = CONTRACTS.BaseParkVault.abi

const FEE_BPS = 200


/* ---------------- CONNECT WALLET ---------------- */

async function detectWallet(){

if(!window.ethereum) return

const provider = new ethers.BrowserProvider(window.ethereum)

const accounts = await provider.send("eth_accounts",[])

if(accounts.length>0){

setWallet(accounts[0])

}

}


/* ---------------- LOAD DATA ---------------- */

async function loadData(retry=0){

try{

if(!window.ethereum) return

const provider = new ethers.BrowserProvider(window.ethereum)

const contract = new ethers.Contract(
CONTRACT_ADDRESS,
CONTRACT_ABI,
provider
)

const vaultBalance = await provider.getBalance(CONTRACT_ADDRESS)

setTvl(ethers.formatEther(vaultBalance))

if(wallet){

const userBal = await contract.balances(wallet)

setUserBalance(ethers.formatEther(userBal))

}

}catch(err){

console.log("RPC error",err)

if(retry<3){

setTimeout(()=>loadData(retry+1),2000)

}

}

}


/* ---------------- INIT ---------------- */

useEffect(()=>{

detectWallet()

},[])

useEffect(()=>{

loadData()

const interval=setInterval(loadData,15000)

if(window.ethereum){

window.ethereum.on("accountsChanged",(acc)=>{

setWallet(acc[0]||null)

})

window.ethereum.on("chainChanged",loadData)

}

return ()=>clearInterval(interval)

},[wallet])


/* ---------------- PREVIEW ---------------- */

const feePreview = amount
? (Number(amount)*FEE_BPS)/10000
:0

const netDeposit = amount
? Number(amount)-feePreview
:0


/* ---------------- DEPOSIT ---------------- */

async function deposit(){

setError("")

if(!wallet){

setError("Connect wallet first")

return

}

if(!amount){

setError("Enter deposit amount")

return

}

try{

setLoading(true)

const provider = new ethers.BrowserProvider(window.ethereum)

const signer = await provider.getSigner()

const contract = new ethers.Contract(
CONTRACT_ADDRESS,
CONTRACT_ABI,
signer
)

const tx = await contract.deposit({
value: ethers.parseEther(amount)
})

await tx.wait()

setAmount("")

loadData()

}catch(err){

setError(err.reason || err.shortMessage || "Deposit failed")

}

setLoading(false)

}


/* ---------------- WITHDRAW ---------------- */

async function withdraw(){

setError("")

if(!wallet){

setError("Connect wallet first")

return

}

if(!amount){

setError("Enter withdraw amount")

return

}

if(Number(amount)>Number(userBalance)){

setError("Withdraw exceeds vault balance")

return

}

try{

setLoading(true)

const provider = new ethers.BrowserProvider(window.ethereum)

const signer = await provider.getSigner()

const contract = new ethers.Contract(
CONTRACT_ADDRESS,
CONTRACT_ABI,
signer
)

const tx = await contract.withdraw(
ethers.parseEther(amount)
)

await tx.wait()

setAmount("")

loadData()

}catch(err){

setError(err.reason || err.shortMessage || "Withdraw failed")

}

setLoading(false)

}


/* ---------------- MAX BUTTON ---------------- */

function setMax(){

setAmount(userBalance)

}


/* ---------------- UI ---------------- */

return(

<div className="neon-card">

<h2>Antarmuka Brankas</h2>

<div className="stat">
<span>Total Nilai Terkunci</span>
<strong>{Number(tvl).toFixed(6)} ETH</strong>
</div>

<div className="stat">
<span>Saldo Brankas Anda</span>
<strong>{Number(userBalance).toFixed(6)} ETH</strong>
</div>

<input
type="number"
placeholder="0.0 ETH"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>

<button className="max-btn" onClick={setMax}>
MAKS
</button>

{amount && (

<div className="preview">

<p>Biaya (2%): {feePreview.toFixed(6)} ETH</p>

<p>Setoran Bersih: {netDeposit.toFixed(6)} ETH</p>

</div>

)}

<div className="buttons">

<button onClick={deposit} disabled={loading}>
{loading ? "Memproses..." : "Setoran"}
</button>

<button onClick={withdraw} disabled={loading}>
{loading ? "Memproses..." : "Penarikan"}
</button>

</div>

{error && (

<p className="error">
{error}
</p>

)}

</div>

)

}
