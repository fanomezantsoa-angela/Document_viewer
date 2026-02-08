import { useState } from 'react'
import ProcessingChart from './Components/ProcessingChart'
import './App.css'

import SideBar from './Components/SideBar'
function App() {
  

  return (
    <>
    <div>

      <SideBar/>
    </div>
    <div className='w-lvh'>
      <ProcessingChart/>
    </div>
    </>

  
  )
}

export default App
