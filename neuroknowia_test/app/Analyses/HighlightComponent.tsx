"use client"
import data from "../Mock_Data/Highlighting_data.json"
 import Tooltip from '@mui/material/Tooltip';
export default function HighlightComponent({entities}: {entities: Entity[] }){
       
  
   

    function highlighting_data(text: string){
       
             const regex = { 
                date: /^(0?[1-9]|1[0-2])\/\d{1,2}\/(19|20)\d\d$/g,
                name: /\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)+\b/g, 
                place: /\b(?:City|Town|Village|County|Province|State|Region|District|Republic|Kingdom)\s+[A-Z][a-z]+\b|\b[A-Z][a-z]+(?:,\s[A-Z][a-z]+)?\b/g, 
                medical: /\b[a-zA-Z]+(itis|osis|emia|pathy|algia|ectomy|ology|phobia|plasia|genic|gies|gie)\b/g, 
                money: /\b(?:\$|€|£)?\s?\d{1,3}(?:,\d{3})*(?:\.\d+)?\b/g 
            }; 
        if(text.match(regex.date)){
            return "text-green-900 font-bold"

        }
        else if(text.match(regex.medical)){
            return "text-purple-900 font-bold"

        }
        else if(text.match(regex.name) || text.match(regex.place)){
            return "text-blue-900 font-bold"

        }
        else if(text.match(regex.money)){
            return "text-orange-900 font-bold"

        }
            
         
      
      
    }
    
   function Tooltip_title_content(entity: Entity){
    return `type: ${entity.type}\nconfidence: ${entity.confidence}\n`
   }

    

    return(

        <div className="flex flex-row justify-items-center">
            {entities.map((entity)=>(
           <div className="text-lg m-2 p-2 flex flex-row justify-items-center"    >

        <Tooltip title={Tooltip_title_content(entity)} arrow>
            <span className={highlighting_data(entity.text)}>{entity.text}</span>
        </Tooltip>

           </div>
           ))}
        </div>
    )
}