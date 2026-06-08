import { useState } from 'react'
import ProcessingChart from './Components/ProcessingChart'
import './App.css'
import Performence from './Components/Performence'
import SideBar from './Components/SideBar'
import Activity from './Components/Activity'

function App() {
  const [currentSelectedTab, setCurrentSelectedTab]=useState("Process Stats")

  return (
    <>
    <div>

      <SideBar currentTab={currentSelectedTab} setCurrentTab={setCurrentSelectedTab}/>
    </div>
    <div className='w-lvh'>
      {currentSelectedTab === "Process Stats" && <ProcessingChart />}
      {currentSelectedTab === "Model Performance" && <Performence />}
      {currentSelectedTab === "Activity Tracking" && <Activity />}

    </div>
    </>

  
  )
}

export default App
