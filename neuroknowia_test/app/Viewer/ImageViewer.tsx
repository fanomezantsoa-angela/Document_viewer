"use client"
import Tesseract from "tesseract.js";
import { useEffect, useState } from "react";
import DocumentViewHeader from "./ViewerHeader/DocumentViewHeader";
export default function ImageViewer({ file }: { file: File }) {
    const [imageText, setImageText] = useState<(string[])>([])
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [currentPage, setCurrentPage] = useState<number>(1);
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
    useEffect(() => {
        textExtraction(file)

    }, [file]);
    return (
        <div>
            <div className="flex flex-col">

                {pageNumber !== null && <DocumentViewHeader pageNumber={pageNumber} />}

            </div>
            <div className="overflow-y-auto h-[80vh] space-y-4"  >
                {imageText.map((text, index) => (
                    <div key={index} className="text-center">{text || "Extracting PDF text..."}</div>
                ))}
            </div>
        </div>


    )



}