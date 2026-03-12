import { useEffect, useState } from "react"
import { ethers } from "ethers"
import {
AreaChart,
Area,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
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

console.log("TVL error:",err)

}

}

useEffect(()=>{

loadTVL()

const interval=setInterval(loadTVL,5000)

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

<XAxis dataKey="time"/>

<YAxis/>

<Tooltip/>

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
