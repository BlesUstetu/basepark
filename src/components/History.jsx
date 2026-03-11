import { useEffect,useState } from "react"
import { ethers } from "ethers"

const CONTRACT="0xd2f9411079a3362d3e20cef1719cf2d8a3923d8d"

export default function History(){

const [history,setHistory]=useState([])

useEffect(()=>{

async function load(){

const provider=new ethers.BrowserProvider(window.ethereum)

const contract=new ethers.Contract(

CONTRACT,
["event Deposit(address indexed user,uint amount)"],
provider

)

const logs=await contract.queryFilter("Deposit")

const txs=logs.map(tx=>({

user:tx.args.user,

amount:ethers.formatEther(tx.args.amount)

}))

setHistory(txs.reverse())

}

load()

},[])

return(

<div className="history">

<h2>Deposit History</h2>

{history.map((tx,i)=>(

<div key={i} className="tx">

{tx.user.slice(0,6)}...

{tx.user.slice(-4)}

<span>

{tx.amount} ETH

</span>

</div>

))}

</div>

)

}
