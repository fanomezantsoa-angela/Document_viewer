"use client"
import { div } from "framer-motion/client"
import data from "../Mock_Data/Highlighting_data.json"
export default function HighlightFilter({
  entities,
  settingEnt
}: {
  entities: Entity[];
  settingEnt: (filtered: Entity[]) => void;
}) {
    

    
    function selectchangehandle(e: React.ChangeEvent<HTMLSelectElement>){
        
        const filter= e.target.value
      
         if (filter === "ALL") { 
            settingEnt(entities); 
            }
         const filtered = entities.filter(ent => ent.type === filter); 
         settingEnt(filtered);
        
        


    }
   
    return(
        <div>
            <select name="type" onChange={selectchangehandle}>
            <option value="All"> All</option>
            <option value="Person"> Person</option>
            <option value="Date">Date</option>
             <option value="Places">Places</option>
            <option value="Medical terms">Medical terms </option>
            <option value="financial amount">Financial Amount </option>
            </select>
        </div>



    )

}