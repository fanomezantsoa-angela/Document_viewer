import { useState } from 'react'
import ProcessingChart from './Components/ProcessingChart'
import './App.css'
import Performence from './Components/Performence'
import SideBar from './Components/SideBar'

function App() {
  const [currentSelectedTab, setCurrentSelectedTab]=useState("Process Stats")

  return (
    <>
    <div>

      <SideBar currentTab={currentSelectedTab} setCurrentTab={setCurrentSelectedTab}/>
    </div>
    <div className='w-lvh'>
      {currentSelectedTab === "Process Stats" && <ProcessingChart />}
      {currentSelectedTab === "Model Performence" && <Performence />}
    </div>
    </>

  
  )
}

export default App
