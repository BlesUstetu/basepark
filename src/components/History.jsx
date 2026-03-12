import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { CONTRACTS } from "../config/contracts"

export default function History(){

const [history,setHistory] = useState([])
const [lastHash,setLastHash] = useState(null)

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

const deposits = await Promise.all(
depositEvents.map(async tx => ({

type:"Deposit",
amount:ethers.formatEther(tx.args.amount),
hash:tx.transactionHash,
blockNumber:tx.blockNumber,
time:await getTimestamp(provider,tx.blockNumber)

}))
)

const withdraws = await Promise.all(
withdrawEvents.map(async tx => ({

type:"Withdraw",
amount:ethers.formatEther(tx.args.amount),
hash:tx.transactionHash,
blockNumber:tx.blockNumber,
time:await getTimestamp(provider,tx.blockNumber)

}))
)

const emergencies = await Promise.all(
emergencyEvents.map(async tx => ({

type:"Emergency",
amount:ethers.formatEther(tx.args.amount),
hash:tx.transactionHash,
blockNumber:tx.blockNumber,
time:await getTimestamp(provider,tx.blockNumber)

}))
)

/* gabungkan */

const allTx = [...deposits,...withdraws,...emergencies]

/* transaksi terbaru di atas */

allTx.sort((a,b)=> b.blockNumber - a.blockNumber)

const newest = allTx[0]?.hash

if(newest && newest !== lastHash){

setLastHash(newest)

}

setHistory(allTx)

}catch(err){

console.log("History error:",err)

}

}

useEffect(()=>{

loadHistory()

/* auto refresh */

const interval = setInterval(()=>{

loadHistory()

},15000)

return ()=> clearInterval(interval)

},[])

return(

<div className="neon-card history">

<h2>Riwayat Transaksi</h2>

{history.length===0 && (

<p>Belum ada transaksi.</p>
)}

{history.map((tx,i)=>(

<div
className={`tx ${tx.hash === lastHash ? "new-tx" : ""}`}
key={i}
>

<div>

<span>

{tx.type === "Deposit" && "⬇ Deposit"}
{tx.type === "Withdraw" && "⬆ Withdraw"}
{tx.type === "Emergency" && "⚠ Emergency"}

</span>

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
