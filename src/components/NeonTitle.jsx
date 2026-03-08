
const text="BaseParkVault".split("")

export default function NeonTitle(){

return(

<h1 className="title">

{text.map((letter,i)=>(

<span
key={i}
className="neon-letter"
style={{animationDelay:`${i*0.15}s`}}
>

{letter}

</span>

))}

</h1>

)

}
