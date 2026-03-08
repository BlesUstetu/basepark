
import { LineChart,Line,XAxis,YAxis,Tooltip } from "recharts"

export default function TVLChart({data}){

return(

<div className="neon-card">

<h2>TVL Chart</h2>

<LineChart width={500} height={250} data={data}>
<XAxis dataKey="time"/>
<YAxis/>
<Tooltip/>
<Line type="monotone" dataKey="tvl"/>
</LineChart>

</div>

)

}
