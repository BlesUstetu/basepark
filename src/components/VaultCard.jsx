import { useState,useEffect } from "react"
import { ethers } from "ethers"

const CONTRACT="0x2Cf04195c4725C7C2dD617ef373B8b17a4de6519"

export default function VaultCard(){

const [amount,setAmount]=useState("")
const [tvl,setTvl]=useState(0)

async function loadTVL(){

const provider=new ethers.BrowserProvider(window.ethereum)

const balance=await provider.getBalance(CONTRACT)

setTvl(ethers.formatEther(balance))

}

useEffect(()=>{

loadTVL()

setInterval(loadTVL,10000)

},[])

async function deposit(){

const provider=new ethers.BrowserProvider(window.ethereum)

const signer=await provider.getSigner()

const contract=new ethers.Contract(

CONTRACT,
["function deposit() payable"],
signer

)

const tx=await contract.deposit({

value:ethers.parseEther(amount)

})

await tx.wait()

loadTVL()

}

async function withdraw(){

const provider=new ethers.BrowserProvider(window.ethereum)

const signer=await provider.getSigner()

const contract=new ethers.Contract(

CONTRACT,
["function withdraw(uint amount)"],
signer

)

const tx=await contract.withdraw(

ethers.parseEther(amount)

)

await tx.wait()

loadTVL()

}

return(

<div className="neon-card">

<h2>Antarmuka Brankas</h2>

<div className="stat">

TVL

<span>{tvl} ETH</span>

</div>

<div className="stat">

APY

<span>12.4%</span>

</div>

<input

type="number"

placeholder="0.0"

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
