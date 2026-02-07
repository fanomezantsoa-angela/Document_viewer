"use client"
import { useEffect, useState } from "react";
 import Tooltip from '@mui/material/Tooltip';
 import HighlightFilter from "./HighlightFIlter";
import Sidebar from "./Sidebar";
export default function HighlightComponent({ entities, setEntities }: {
  entities: Entity[];
  setEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
}
){
    
    const [sidebarOpen, setSidebarOpen] = useState(false);
   function Tooltip_title_content(entity: Entity){
    return `type: ${entity.type}\nconfidence: ${entity.confidence}\n`
   }

return(
    <div>
        <div >
            <HighlightFilter entities={entities} settingEnt={setEntities}/>

        </div>
    <div className="flex flex-row justify-items-center">
            {entities.map((ent)=>(
           <div className="text-lg m-2 p-2 flex flex-row justify-items-center"    >
      <Sidebar 
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        entity={ent}
        entities={entities}
        />
        <Tooltip title={Tooltip_title_content(ent)} arrow>
            <span  className={`${highlightColor[ent.type] ?? "bg-white"} cursor-pointer px-1 rounded`} >{ent.text} </span>
           
         
        </Tooltip>

           </div>
        

           ))}
         
        </div>
       
    </div>

)
}
  

    

