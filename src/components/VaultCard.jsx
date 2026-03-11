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
setError("Enter amount")
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

setError(err.reason || err.shortMessage || "Transaction failed")

}

setLoading(false)

}



async function withdraw(){

setError("")

if(!amount){
setError("Enter amount")
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



function setMax(){

setAmount(userBalance)

}



return(

<div className="neon-card">

<h2>Vault Interface</h2>


<div className="stat">

<span>Total Value Locked</span>

<strong>{Number(tvl).toFixed(4)} ETH</strong>

</div>


<div className="stat">

<span>Your Vault Balance</span>

<strong>{Number(userBalance).toFixed(4)} ETH</strong>

</div>


<input

type="number"

placeholder="0.0 ETH"

value={amount}

onChange={(e)=>setAmount(e.target.value)}

/>


<button className="max-btn" onClick={setMax}>
MAX
</button>


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
