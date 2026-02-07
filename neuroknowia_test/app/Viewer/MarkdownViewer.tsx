"use client";
import { div, li, line } from "framer-motion/client"
import DocumentViewHeader from "./ViewerHeader/DocumentViewHeader";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

export default function MarkdownViewer({text}: {text: string}){
     const [plainText, setPlainText]= useState<(string[])>([])
        const [pageNumber, setPageNumber]=useState<number>(1)
        const [zoom, setZoom] = useState(1);
        const [currentPage, setCurrentPage] = useState<number>(1);
        
         useEffect(()=>{
             async function loadPlainText(plain:string, limitline=60){
                const fullText: string[] =[]
                const numberligne = plain.split('\n')
                for(let i=0; i<numberligne.length; i+=limitline){
                    fullText.push(numberligne.slice(i, i+limitline).join("\n"))
                }
                console.log("oooo",fullText.length)
                
                setPlainText(fullText);
                setPageNumber(fullText.length)   
         }
            loadPlainText(text)
         
    
    
         }, [text])
    
        return(
            <div>
                <div className="">
                                
                                {pageNumber!== null && <DocumentViewHeader  pageNumber={pageNumber} zoom={zoom}  ZoomIn={() => setZoom((z) => Math.min(z + 0.1, 3))}
    ZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.5))} />}
                
                            </div>
                <div className=" overflow-y-auto w-full max-w-3xl bg-white shadow-md rounded-xl p-8 space-y-10 " style={{transform: `scale(${zoom})`,
transformOrigin: "top center",}}>
                 {plainText.map((text, index) => (
                    <div key={index} className=" whitespace-pre-wrap leading-relaxed text-gray-800" >
               <Markdown>{text}</Markdown>
               </div>
))}
            </div>
    
    
            </div>
            
        )


    
}