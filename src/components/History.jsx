import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { CONTRACTS } from "../config/contracts"

export default function History(){

const [history,setHistory] = useState([])

const CONTRACT_ADDRESS = CONTRACTS.BaseParkVault.address
const CONTRACT_ABI = CONTRACTS.BaseParkVault.abi


async function loadHistory(){

if(!window.ethereum) return

try{

const provider = new ethers.BrowserProvider(window.ethereum)

const contract = new ethers.Contract(
CONTRACT_ADDRESS,
CONTRACT_ABI,
provider
)

/* ambil event */

const depositEvents = await contract.queryFilter(
contract.filters.Deposit(),
0,
"latest"
)

const withdrawEvents = await contract.queryFilter(
contract.filters.Withdraw(),
0,
"latest"
)

const emergencyEvents = await contract.queryFilter(
contract.filters.EmergencyWithdraw(),
0,
"latest"
)

/* format data */

const deposits = depositEvents.map(tx=>({
type:"Deposit",
amount:ethers.formatEther(tx.args.amount),
hash:tx.transactionHash
}))

const withdraws = withdrawEvents.map(tx=>({
type:"Withdraw",
amount:ethers.formatEther(tx.args.amount),
hash:tx.transactionHash
}))

const emergencies = emergencyEvents.map(tx=>({
type:"Emergency",
amount:ethers.formatEther(tx.args.amount),
hash:tx.transactionHash
}))

setHistory([...deposits,...withdraws,...emergencies])

}catch(err){

console.log("History error",err)

}

}


useEffect(()=>{

loadHistory()

},[])


return(

<div className="neon-card">

<h2>Riwayat Transaksi</h2>

{history.length===0 && (

<p>Belum ada transaksi.</p>

)}

{history.map((tx,i)=>(

<div className="tx" key={i}>

<span>{tx.type}</span>

<span>{Number(tx.amount).toFixed(6)} ETH</span>

</div>

))}

</div>

)

}
