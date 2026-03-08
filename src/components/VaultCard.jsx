
import { useState } from "react"
import { ethers } from "ethers"

export default function VaultCard(){

const [amount,setAmount]=useState("")

async function deposit(){

if(!window.ethereum)return

const provider=new ethers.BrowserProvider(window.ethereum)
const signer=await provider.getSigner()

const contract=new ethers.Contract(
"YOUR_CONTRACT_ADDRESS",
["function deposit() payable"],
signer
)

const tx=await contract.deposit({
value:ethers.parseEther(amount)
})

await tx.wait()

}

return(

<div className="neon-card">

<h2>Vault Deposit</h2>

<input
placeholder="ETH amount"
onChange={(e)=>setAmount(e.target.value)}
/>

<button onClick={deposit}>Deposit</button>

</div>

)

}
