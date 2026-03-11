import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"

const data=[

{time:"10:40",tvl:120},
{time:"10:41",tvl:150},
{time:"10:42",tvl:130},
{time:"10:43",tvl:170},
{time:"10:44",tvl:160}

]

export default function TVLChart(){

return(

<div className="neon-card">

<h2>Total Value Locked</h2>

<ResponsiveContainer width="100%" height={260}>

<LineChart data={data}>

<XAxis dataKey="time"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="tvl"
stroke="#00ffd5"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

)

}
