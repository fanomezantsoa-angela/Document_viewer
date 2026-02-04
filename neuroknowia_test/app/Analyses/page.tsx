"use client"
import HighlightComponent from "./HighlightComponent"
import data from "../Mock_Data/Highlighting_data.json"
import { useState, useEffect } from "react"
import HighlightFilter from "./HighlightFIlter"
export default function Highlight(){
    const [InitialEntities, setIntialEntities] = useState<Entity[]>(data.entities)


const [entities, setEntity] = useState<Entity[]>(data.entities);

      useEffect(() => 
        setEntity(data.entities)
       
    
  , [])

    return(

        <div>
            <HighlightFilter entities={InitialEntities} settingEnt={setEntity}/>

         <HighlightComponent entities={entities}/>
        </div>
    )
}