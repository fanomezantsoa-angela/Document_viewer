"use client"
import Tesseract from "tesseract.js";
import { useEffect, useState, useRef } from "react";
import DocumentViewHeader from "./ViewerHeader/DocumentViewHeader";
 import Tooltip from '@mui/material/Tooltip';
import { UseViewMode } from "./Privacy_Control/ViewModehook";
import { changingMode } from "./Privacy_Control/Viewchange";
import PrivacyControl from "./Privacy_Control/PrivacyControl";
import { HighlightedSegments } from "../Higlighting/highlighting";
import HighlightFilter from "../Higlighting/HighlightFIlter";
interface Entity { 
  text: string; 
  type: string; 
  start: number; 
  end: number; 
  confidence: number; 
  context: string; 
}
export default function ImageViewer({ file }: { file: File }) {
     const {viewMode, setViewMode} = UseViewMode();
    const [imageText, setImageText] = useState<(string[])>([])
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [zoom, setZoom] = useState(1);
      const [entities, setEntities]=useState<(Entity[])>([])
    function entityDetection(text: string): Entity[] {
  const entities: Entity[] = [];
 
  const dateRegex = /^(0?[1-9]|1[0-2])\/\d{1,2}\/(19|20)\d\d$/g;
  let match;
  while ((match = dateRegex.exec(text)) !== null) {
    entities.push({
      text: match[0],
      type: 'DATE',
      start: match.index,
      end: match.index + match[0].length,
      confidence: 0.95,
      context: "Date of Birth"
    
    });
  }
  
  const amountRegex = /\b(?:\$|€|£)?\s?\d{1,3}(?:,\d{3})*(?:\.\d+)?\b/g;
  while ((match = amountRegex.exec(text)) !== null) {
    entities.push({
      text: match[0],
      type: 'AMOUNT',
      start: match.index,
      end: match.index + match[0].length,
      confidence: 0.92,
      context: "Medical Bills"
    });
  }
 
  
 
  const nameRegex = /\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)+\b/g;
  while ((match = nameRegex.exec(text)) !== null) {
    entities.push({
      text: match[0],
      type: 'PERSON',
      start: match.index,
      end: match.index + match[0].length,
      confidence: 0.85,
      context: "Patient"

    });

  }
    const medicaltermsRegex =  /\b[a-zA-Z]+(itis|osis|emia|pathy|algia|ectomy|ology|phobia|plasia|genic|gies|gie)\b/g;
  while ((match = medicaltermsRegex.exec(text)) !== null) {
    entities.push({
      text: match[0],
      type: 'Medical terms',
      start: match.index,
      end: match.index + match[0].length,
      confidence: 0.85,
      context: "general check-up"

    });
  
  
  }
  return entities;
}

    async function textExtraction(image: File, limitline = 60) {
        const fullImageText: string[] = []
        const { data } = await Tesseract.recognize(image, "eng");
        const numberligne = data.text.split('\n')
        for (let i = 0; i < numberligne.length; i += limitline) {
            fullImageText.push(numberligne.slice(i, i + limitline).join("\n"))
        }
        setImageText(fullImageText)
        setPageNumber(fullImageText.length)
    }
    const scrollRef = useRef<HTMLDivElement>(null); 
    useEffect(() => { 
        if (scrollRef.current) { scrollRef.current.scrollTop = 0; } 
    }, [currentPage]);
    useEffect(() => {
        textExtraction(file)

    }, [file]);


      useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") setCurrentPage(p => Math.min(p + 1, imageText.length));
    if (e.key === "ArrowLeft") setCurrentPage(p => Math.max(p - 1, 1));
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, [imageText]);
 useEffect(()=>{
    entityDetection(imageText[currentPage-1])


  }, [imageText[currentPage-1]])
 
    const controledText = changingMode(imageText[currentPage-1], entities, viewMode)

  
  const currentPageText= imageText[currentPage-1] || ''
    return (
         <div>
             <div>
               <PrivacyControl />
               <HighlightFilter entities={entities} settingEnt={setEntities}/>
               
               {pageNumber !== null && (
                 <DocumentViewHeader 
                   setCurrentPage={setCurrentPage} 
                   currentPage={currentPage} 
                   pageNumber={pageNumber} 
                   zoom={zoom}  
                   ZoomIn={() => setZoom((z) => Math.min(z + 0.1, 3))}
                   ZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.5))} 
                 />
               )}
             </div>
             
            <div className="flex justify-center">
               <div 
                 className="w-full max-w-3xl bg-white shadow-md rounded-xl p-8"
                 style={{
                   transform: `scale(${zoom})`,
                   transformOrigin: "top center",
                 }}
               >
                 {viewMode === 'full' ? (
                  
                   <pre className="whitespace-pre-wrap font-sans text-base">
                     {HighlightedSegments(currentPageText, entities).map((segment, idx) => {
                       if (!segment.entity) {
                         return <span key={idx}>{segment.text}</span>;
                       }
                       
                       const entity = segment.entity;
                       const colorMap : Record<string, string> =  {
                         'DATE': 'bg-green-200 border-b-2 border-green-600',
                         'PERSON': 'bg-blue-200 border-b-2 border-blue-600',
                         'AMOUNT': 'bg-orange-200 border-b-2 border-orange-600',
                         'MEDICAL_TERM': 'bg-purple-200 border-b-2 border-purple-600',
                       };
                       
                       return (
                         <Tooltip
                           key={idx}
                           title={`${entity.type} - ${(entity.confidence * 100).toFixed(0)}%`}
                         >
                           <span className={`${colorMap[entity.type]} px-1 rounded cursor-pointer`}>
                             {segment.text}
                           </span>
                         </Tooltip>
                       );
                     })}
                   </pre>
                 ) : (
                  
                   <pre className="whitespace-pre-wrap font-sans text-base">
                     {controledText}
                   </pre>
                 )}
               </div>
             </div>
           </div>


    )



}