"use client"
import { div } from "framer-motion/client";
import DocumentViewer from "./DocumentViewer";
import { useDocumentStore } from "../stores/documentStore";
export default function Viewer(){
    
 const file= useDocumentStore(state => state.file)
  return(
    <div>
        <div>

        </div>
        {file 
            ?
        <div className="">
         <DocumentViewer file={file}/>
        </div>
         :
         (<div>File not loaded</div>)
    
        }
    </div>
    )

}