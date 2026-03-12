import { useEffect, useState } from "react"
import { ethers } from "ethers"
import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid,
Area,
AreaChart
} from "recharts"

import { CONTRACTS } from "../../config/contracts"

export default function TVLChart(){

const [data,setData] = useState([])
const [tvl,setTvl] = useState(0)

const CONTRACT_ADDRESS = CONTRACTS.BaseParkVault.address

async function loadTVL(){

if(!window.ethereum) return

try{

const provider = new ethers.BrowserProvider(window.ethereum)

const balance = await provider.getBalance(CONTRACT_ADDRESS)

const tvlValue = Number(ethers.formatEther(balance))

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

console.log("TVL error",err)

}

}

useEffect(()=>{

loadTVL()

const interval=setInterval(loadTVL,15000)

return()=>clearInterval(interval)

},[])

return(

<div className="neon-card chart-container">

<h2>Total Value Locked</h2>

<div className="tvl-value">

{tvl.toFixed(4)} ETH

</div>

<ResponsiveContainer width="100%" height={260}>

<AreaChart data={data}>

<defs>

<linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">

<stop offset="5%" stopColor="#00ffd5" stopOpacity={0.8}/>

<stop offset="95%" stopColor="#00ffd5" stopOpacity={0}/>

</linearGradient>

</defs>

<CartesianGrid stroke="#1c1c35" strokeDasharray="3 3"/>

<XAxis dataKey="time" stroke="#8a8aa3"/>

<YAxis stroke="#8a8aa3"/>

<Tooltip
contentStyle={{
background:"#0b0b18",
border:"1px solid #1c1c35",
borderRadius:"8px"
}}
/>

<Area
type="monotone"
dataKey="tvl"
stroke="#00ffd5"
strokeWidth={3}
fillOpacity={1}
fill="url(#tvlGradient)"
dot={false}
/>

</AreaChart>

</ResponsiveContainer>

</div>

)

}
