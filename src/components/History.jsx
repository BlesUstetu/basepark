import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { CONTRACTS } from "../config/contracts"

export default function VaultCard(){

const [amount,setAmount] = useState("")
const [tvl,setTvl] = useState("0")
const [userBalance,setUserBalance] = useState("0")
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)

const CONTRACT_ADDRESS = CONTRACTS.BaseParkVault.address
const CONTRACT_ABI = CONTRACTS.BaseParkVault.abi

const FEE_BPS = 200


/* ----------------------------- DATA LOAD ----------------------------- */

async function loadData(retry=0){

try{

if(typeof window === "undefined") return

if(!window.ethereum) return

const provider = new ethers.BrowserProvider(window.ethereum)

const accounts = await provider.send("eth_accounts",[])

if(accounts.length === 0) return

const user = accounts[0]

const contract = new ethers.Contract(
CONTRACT_ADDRESS,
CONTRACT_ABI,
provider
)

const vaultBalance = await provider.getBalance(CONTRACT_ADDRESS)

const userBal = await contract.balances(user)

setTvl(ethers.formatEther(vaultBalance))

setUserBalance(ethers.formatEther(userBal))

}catch(err){

console.log("load error",err)

if(retry < 3){

setTimeout(()=>loadData(retry+1),2000)

}

}

}



/* ----------------------------- INIT ----------------------------- */

useEffect(()=>{

loadData()

const interval = setInterval(loadData,15000)

if(window.ethereum){

window.ethereum.on("accountsChanged",loadData)

window.ethereum.on("chainChanged",loadData)

}

return ()=>clearInterval(interval)

},[])



/* ----------------------------- PREVIEW ----------------------------- */

const feePreview = amount
 ? (Number(amount) * FEE_BPS) / 10000
 : 0

const netDeposit = amount
 ? Number(amount) - feePreview
 : 0



/* ----------------------------- DEPOSIT ----------------------------- */

async function deposit(){

setError("")

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



/* ----------------------------- WITHDRAW ----------------------------- */

async function withdraw(){

setError("")

if(!amount){

setError("Enter withdraw amount")

return

}

if(Number(amount) > Number(userBalance)){

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



/* ----------------------------- MAX BUTTON ----------------------------- */

function setMaxWithdraw(){

setAmount(userBalance)

}



/* ----------------------------- UI ----------------------------- */

return(

<div className="neon-card">

<h2>Vault Interface</h2>


<div className="stat">
<span>Total Value Locked</span>
<strong>{Number(tvl).toFixed(6)} ETH</strong>
</div>


<div className="stat">
<span>Your Vault Balance</span>
<strong>{Number(userBalance).toFixed(6)} ETH</strong>
</div>


<input
type="number"
placeholder="0.0 ETH"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>


<button className="max-btn" onClick={setMaxWithdraw}>
MAX
</button>


{amount && (

<div className="preview">

<p>Deposit Fee (2%): {feePreview.toFixed(6)} ETH</p>

<p>Net Deposit: {netDeposit.toFixed(6)} ETH</p>

</div>

)}


<div className="buttons">

<button onClick={deposit} disabled={loading}>
{loading ? "Processing..." : "Deposit"}
</button>

<button onClick={withdraw} disabled={loading}>
{loading ? "Processing..." : "Withdraw"}
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
