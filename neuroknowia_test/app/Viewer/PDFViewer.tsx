"use client";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import type { PDFDocumentProxy, TextItem } from "pdfjs-dist/types/src/display/api";
import { useState, useEffect } from "react";
import DocumentViewHeader from "../Viewer/ViewerHeader/DocumentViewHeader"
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";;
export default function PdfViewer({ file }: { file: File }) {

    const [numberPages, setNumberPages] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [zoom, setZoom] = useState(1);
    const [Pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
    const [pageTexts, setPageTexts] = useState<(String[])>([]);
    async function getPdf(file: File) {
        console.log("extracting")
        const TextBuffer = await file.arrayBuffer()
        const loadingPdf = getDocument({ data: TextBuffer });
        console.log("extracting")
        const pdf: PDFDocumentProxy = await loadingPdf.promise
        console.log("PDF numPages:", pdf.numPages);
        setPdf(pdf)
        setNumberPages(pdf.numPages);
        
       
        const fullText: String[] = [];
       
        for (let i = 1; i <= pdf.numPages; i++) {
            console.log(".....")
            const page = await pdf.getPage(i);
            const pagecontent = await page.getTextContent();
            const items = (pagecontent as any).items || [];
            const text = items.map((item: any) => item.str || "").join(" ");
            fullText.push(text)
            

        }
        setPageTexts(fullText)
        

    }
    useEffect(() => {
        getPdf(file)

    }, [file]);
    
  
     
  



    return (
        <div >
            <div>

                {numberPages !== null && <DocumentViewHeader pageNumber={numberPages} zoom={zoom}  ZoomIn={() => setZoom((z) => Math.min(z + 0.1, 3))}
    ZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.5))} />}

            </div>


            <div className=" overflow-y-auto w-full max-w-3xl bg-white shadow-md rounded-xl p-8 space-y-10 " style={{transform: `scale(${zoom})`,transformOrigin: "top center",}}>

            {pageTexts.map((text, index) => (
                <div key={index} className=" whitespace-pre-wrap leading-relaxed text-gray-800">{ text || "Extracting PDF text..."}</div>
             ))}
            </div>
        </div >






    )
}