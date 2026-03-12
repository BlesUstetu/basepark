import { useEffect, useState } from "react"
import { ethers } from "ethers"

import {
AreaChart,
Area,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts"

import { CONTRACTS } from "../config/contracts"

export default function TVLChart(){

const [data,setData] = useState([])
const [tvl,setTvl] = useState(0)

const CONTRACT_ADDRESS = CONTRACTS.BaseParkVault.address
const CONTRACT_ABI = CONTRACTS.BaseParkVault.abi

async function loadTVL(provider){

try{

const contract = new ethers.Contract(
CONTRACT_ADDRESS,
CONTRACT_ABI,
provider
)

const assets = await contract.totalAssets()

const tvlValue = Number(ethers.formatEther(assets))

const time = new Date().toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
})

setTvl(tvlValue)

setData(prev=>{

const updated=[...prev,{time,tvl:tvlValue}]

if(updated.length>30){
updated.shift()
}

return updated

})

}catch(err){

console.log("TVL error:",err)

}

}

useEffect(()=>{

if(!window.ethereum) return

const provider = new ethers.BrowserProvider(window.ethereum)

const contract = new ethers.Contract(
CONTRACT_ADDRESS,
CONTRACT_ABI,
provider
)

/* load pertama */

loadTVL(provider)

/* realtime update */

contract.on("Deposit",()=>loadTVL(provider))
contract.on("Withdraw",()=>loadTVL(provider))
contract.on("EmergencyWithdraw",()=>loadTVL(provider))

return ()=>{

contract.removeAllListeners()

}

},[])

return(

<div className="neon-card chart-container">

<h2>Total Value Locked</h2>

<div className="tvl-value">

{tvl.toFixed(6)} ETH

</div>

<ResponsiveContainer width="100%" height={260}>

<AreaChart data={data}>

<CartesianGrid stroke="#1c1c35" strokeDasharray="3 3"/>

<XAxis dataKey="time" stroke="#8a8aa3"/>

<YAxis stroke="#8a8aa3"/>

<Tooltip
contentStyle={{
background:"#0b0b18",
border:"1px solid #1c1c35",
borderRadius:"8px",
color:"#fff"
}}
/>

<Area
type="monotone"
dataKey="tvl"
stroke="#00ffd5"
strokeWidth={3}
fillOpacity={0.3}
fill="#00ffd5"
dot={false}
/>

</AreaChart>

</ResponsiveContainer>

</div>

)

}
