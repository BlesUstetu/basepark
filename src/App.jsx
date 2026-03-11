import Header from "./components/Header"
import VaultCard from "./components/VaultCard"
import TVLChart from "./components/TVLChart"
import History from "./components/History"

export default function App(){

return(

<div className="app">

<Header/>

<div className="container">

<p className="subtitle">
Brankas Aman dengan Hasil Tinggi di Jaringan Base
</p>

<div className="dashboard">

<VaultCard/>

<TVLChart/>

</div>

<History/>

</div>

</div>

)

}
