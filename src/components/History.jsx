import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { CONTRACTS } from "../config/contracts"

export default function History(){

const [history,setHistory] = useState([])

const CONTRACT_ADDRESS = CONTRACTS.BaseParkVault.address
const CONTRACT_ABI = CONTRACTS.BaseParkVault.abi


useEffect(()=>{

async function loadHistory(){

if(typeof window === "undefined") return

try{

const provider = new ethers.BrowserProvider(window.ethereum)

const contract = new ethers.Contract(
CONTRACT_ADDRESS,
CONTRACT_ABI,
provider
)

const logs = await contract.queryFilter("Deposit")

const txs = logs.map((log)=>({

user: log.args.user,
amount: ethers.formatEther(log.args.amount)

}))

setHistory(txs.reverse())

}catch(err){

console.log(err)

}

}

loadHistory()

},[])



return(

<div className="history">

<h2>Deposit History</h2>

{history.length === 0 && (
<p>No deposits yet</p>
)}

{history.map((tx,i)=>(
<div key={i} className="tx">

<span>
{tx.user.slice(0,6)}...{tx.user.slice(-4)}
</span>

<span>
{Number(tx.amount).toFixed(6)} ETH
</span>

</div>
))}

</div>

)

}
