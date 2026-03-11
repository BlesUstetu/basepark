import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { CONTRACTS } from "../config/contracts"

export default function VaultCard(){

const [amount,setAmount] = useState("")
const [tvl,setTvl] = useState("0")

const CONTRACT_ADDRESS = CONTRACTS.BaseParkVault.address
const CONTRACT_ABI = CONTRACTS.BaseParkVault.abi


async function loadTVL(){

try{

const provider = new ethers.BrowserProvider(window.ethereum)

const balance = await provider.getBalance(CONTRACT_ADDRESS)

setTvl(ethers.formatEther(balance))

}catch(err){

console.log("TVL error:",err)

}

}


useEffect(()=>{

loadTVL()

const interval = setInterval(loadTVL,10000)

return ()=>clearInterval(interval)

},[])



async function deposit(){

if(!amount) return

try{

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

loadTVL()

}catch(err){

console.log("Deposit error:",err)

}

}



async function withdraw(){

if(!amount) return

try{

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

loadTVL()

}catch(err){

console.log("Withdraw error:",err)

}

}



return(

<div className="neon-card">

<h2>Vault Interface</h2>

<div className="stat">

<span>Total Value Locked</span>

<strong>{tvl} ETH</strong>

</div>

<div className="stat">

<span>APY</span>

<strong>12.4%</strong>

</div>

<input

type="number"

placeholder="0.0 ETH"

value={amount}

onChange={(e)=>setAmount(e.target.value)}

/>

<div className="buttons">

<button onClick={deposit}>
Deposit
</button>

<button onClick={withdraw}>
Withdraw
</button>

</div>

</div>

)

}
