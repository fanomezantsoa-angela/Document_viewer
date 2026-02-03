"use client"
import { div } from "framer-motion/client";
import PdfViewer from "./Pdfviewer";
import { useDocumentStore } from "../stores/documentStore";
export default function Viewer(){
 const file= useDocumentStore(state => state.file)
  return(
    <div>
        {file 
            ?
        <div>
         <PdfViewer pdfView={file}/>
        </div>
         :
         (<div>No file loaded</div>)
    
        }
    </div>
    )

}