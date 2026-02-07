"use client"
import Tesseract from "tesseract.js";
import { useEffect, useState, useRef } from "react";
import DocumentViewHeader from "./ViewerHeader/DocumentViewHeader";
import HighlightComponent from "../Higlighting/HighlightComponent";
import { UseViewMode } from "./Privacy_Control/ViewModehook";
import { changingMode } from "./Privacy_Control/Viewchange";
import PrivacyControl from "./Privacy_Control/PrivacyControl";
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
  const processedText = changingMode(imageText[currentPage - 1] || "", entities, viewMode );
    return (
        <div>
             <div className="">
                <PrivacyControl />


                {pageNumber !== null && <DocumentViewHeader setCurrentPage={setCurrentPage} currentPage={currentPage} pageNumber={pageNumber} zoom={zoom}  ZoomIn={() => setZoom((z) => Math.min(z + 0.1, 3))}
    ZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.5))}/>}

            </div>
          
        <div>
              <div>
                <HighlightComponent entities={entities} setEntities={setEntities}/>

            </div>
           
            <div className="*overflow-y-auto w-full max-w-3xl bg-white shadow-md rounded-xl p-8 space-y-10 "  style={{transform: `scale(${zoom})`,
transformOrigin: "top center",}}>
               
                    <div  className="overflow-y-auto whitespace-pre-wrap leading-relaxed text-gray-800">{processedText || "Extracting PDF text..."}</div>
               
            </div>
        </div>
        </div>


    )



}