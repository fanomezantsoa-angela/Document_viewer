"use client";
import { div, li, line } from "framer-motion/client"
import DocumentViewHeader from "./ViewerHeader/DocumentViewHeader";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

export default function MarkdownViewer({text}: {text: string}){
     const [plainText, setPlainText]= useState<(string[])>([])
        const [pageNumber, setPageNumber]=useState<number>(1)
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
                <div className="flex flex-col">
                                
                                {pageNumber!== null && <DocumentViewHeader  pageNumber={pageNumber}  page={currentPage}  setNumberPage={setCurrentPage} />}
                
                            </div>
                <div className=" prose prose-sm max-w-none w-1/2 bg-gray-50 ">
               <Markdown>{plainText[currentPage-1]}</Markdown>

            </div>
    
    
            </div>
            
        )


    
}