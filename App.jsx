
import { useEffect, useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

import NeonTitle from "./components/NeonTitle"
import VaultCard from "./components/VaultCard"
import TVLChart from "./components/TVLChart"

export default function App(){

const [tvlData,setTvlData]=useState([])

useEffect(()=>{

const interval=setInterval(()=>{

setTvlData(data=>[
...data,
{
time:new Date().toLocaleTimeString(),
tvl:Math.random()*100
}
])

},5000)

return ()=>clearInterval(interval)

},[])

return(

<div className="container">

<NeonTitle/>

<div className="wallet">
<ConnectButton/>
</div>

<VaultCard/>

<TVLChart data={tvlData}/>

</div>

)

}
