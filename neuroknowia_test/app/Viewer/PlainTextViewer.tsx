"use client";
import { div, li, line } from "framer-motion/client"
import DocumentViewHeader from "./ViewerHeader/DocumentViewHeader";
import { useEffect, useState } from "react";
export default function PlainTextViewer({text}: {text: String}){
    const [plainText, setPlainText]= useState<(String[])>([])
    const [pageNumber, setPageNumber]=useState<number>(1)
    const [currentPage, setCurrentPage] = useState<number>(1);
    
     useEffect(()=>{
         async function loadPlainText(plain:String, limitline=40){
            const fullText: String[] =[]
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
            <div className="flex flex-col">
                            <div>
                                {currentPage}/{pageNumber}
                            </div>
                            {pageNumber!== null && <DocumentViewHeader pageNumber={pageNumber} page={currentPage} setNumberPage={setCurrentPage} />}
            
                        </div>
            <div className="flex items-center justify-center justify-items-center w-1/2 bg-gray-50 ">
            <div>{plainText[0] || "loading... "}</div>

        </div>


        </div>
        
    )
}