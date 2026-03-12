import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { CONTRACTS } from "../config/contracts"

export default function History(){

const [history,setHistory] = useState([])

const CONTRACT_ADDRESS = CONTRACTS.BaseParkVault.address
const CONTRACT_ABI = CONTRACTS.BaseParkVault.abi

async function getTimestamp(provider, blockNumber){

const block = await provider.getBlock(blockNumber)

return new Date(block.timestamp * 1000).toLocaleString()

}

async function loadHistory(){

if(!window.ethereum) return

try{

const provider = new ethers.BrowserProvider(window.ethereum)

const contract = new ethers.Contract(
CONTRACT_ADDRESS,
CONTRACT_ABI,
provider
)

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

const deposits = await Promise.all(
depositEvents.map(async tx => ({

type:"Deposit",
amount:ethers.formatEther(tx.args.amount),
hash:tx.transactionHash,
time:await getTimestamp(provider,tx.blockNumber)

}))
)

const withdraws = await Promise.all(
withdrawEvents.map(async tx => ({

type:"Withdraw",
amount:ethers.formatEther(tx.args.amount),
hash:tx.transactionHash,
time:await getTimestamp(provider,tx.blockNumber)

}))
)

const emergencies = await Promise.all(
emergencyEvents.map(async tx => ({

type:"Emergency",
amount:ethers.formatEther(tx.args.amount),
hash:tx.transactionHash,
time:await getTimestamp(provider,tx.blockNumber)

}))
)

const allTx = [...deposits,...withdraws,...emergencies]

allTx.sort((a,b)=> new Date(b.time) - new Date(a.time))

setHistory(allTx)

}catch(err){

console.log("History load error:",err)

}

}

useEffect(()=>{

loadHistory()

/* auto refresh setiap 15 detik */

const interval = setInterval(()=>{

loadHistory()

},15000)

return ()=> clearInterval(interval)

},[])

return(

<div className="neon-card">

<h2>Riwayat Transaksi</h2>

{history.length===0 && (
<p>Belum ada transaksi.</p>
)}

{history.map((tx,i)=>(

<div className="tx new-tx" key={i}>

<div>

<span>{tx.type}</span>

<br/>

<small>{tx.time}</small>

<br/>

<a
href={`https://basescan.org/tx/${tx.hash}`}
target="_blank"
rel="noreferrer"
>

Lihat Tx

</a>

</div>

<span>

{Number(tx.amount).toFixed(6)} ETH

</span>

</div>

))}

</div>

)

}
