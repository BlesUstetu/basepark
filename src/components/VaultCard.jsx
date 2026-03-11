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

const feePreview = amount ? (Number(amount) * FEE_BPS) / 10000 : 0
const netDeposit = amount ? Number(amount) - feePreview : 0


async function loadData(){

try{

const provider = new ethers.BrowserProvider(window.ethereum)

const signer = await provider.getSigner()

const user = await signer.getAddress()

const contract = new ethers.Contract(
CONTRACT_ADDRESS,
CONTRACT_ABI,
provider
)

const balance = await provider.getBalance(CONTRACT_ADDRESS)

const userBal = await contract.balances(user)

setTvl(ethers.formatEther(balance))

setUserBalance(ethers.formatEther(userBal))

}catch(err){

console.log(err)

}

}


useEffect(()=>{

loadData()

const interval = setInterval(loadData,10000)

return ()=>clearInterval(interval)

},[])



async function deposit(){

setError("")

if(!amount){

setError("Enter deposit amount")

return

}

if(typeof window !== "undefined"){
 if(!window.confirm(`Withdraw ${amount} ETH?`)){
  return
 }
}

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

if(!confirm(`Withdraw ${amount} ETH from vault?`)){

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



function setMaxWithdraw(){

setAmount(userBalance)

}



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
