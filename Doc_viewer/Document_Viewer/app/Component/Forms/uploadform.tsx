"use client";
import React, { useState} from "react"
import { useRouter } from 'next/navigation'
import { PDFDocument } from 'pdf-lib'
import { useDocumentStore } from '@/app/stores/documentStore';
import type { Sector } from "@/app/type";
interface UploadScreenProps { onStart: (files: File[], sector: Sector) => void; }
export default function UploadForm({ onStart }: UploadScreenProps) {
    const allowed_type_file= "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown, image/jpeg,image/png"
  const Max_file_uploade = 5;
  const maxfile_size= 10 * 1024 * 1024;
    const setFile = useDocumentStore(state => state.setFile)
    const [documents, setDocuments] = useState<File[]>([]);
    const [docsector, setDocsector]=useState<Sector>("Healthcare")

    const router = useRouter()
    const handleFiles =(list: FileList | null) =>{
        
        if (!list) {
          return;
        }
        const arrayfile= Array.from(list).slice(0,5);
        setDocuments(arrayfile)
    }
   
   

    return (
       <div className="p-6 space-y-6"> 
       <h2 className="text-xl font-semibold">Upload Documents</h2>
        <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer" 
        onDragOver={e => e.preventDefault()} 
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }} 
        onClick={() => { 
        const input = document.createElement("input"); 
        input.type = "file"; input.multiple = true; 
        input.onchange = e => handleFiles((e.target as HTMLInputElement).files); 
        input.click(); }} >
        <p>Drag & drop up to 5 files, or click to select</p> 
        <p className="text-xs text-gray-500 mt-1"> Max 10MB each · PDF, DOCX, TXT, JPG, PNG, MD </p> 
        </div> 
        <div> <label className="block mb-1 font-medium">Sector</label> 
        <select value={docsector} onChange={e => setDocsector(e.target.value as Sector)} className="border rounded px-3 py-2" > 
            <option value="Healthcare">Healthcare</option> 
            <option value="Legal">Legal</option> 
            <option value="Finance">Finance</option> 
            </select> 
            </div> 
            {documents.length > 0 && ( 
                <div className="space-y-2"> 
                <h3 className="font-medium">Selected files</h3> 
                {documents.map(f => ( <div key={f.name} className="flex justify-between text-sm border rounded px-3 py-1"> 
                    <span>{f.name}</span> 
                    <span> {(f.size / 1024 / 1024).toFixed(2)} MB · {f.type || "unknown"} </span> 
                    </div> ))} 
                    </div> )} 
                    <button disabled={documents.length === 0} 
                    onClick={() => onStart(documents, docsector)} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50" > 
                    Start Processing </button> 
                    </div>


    )
}