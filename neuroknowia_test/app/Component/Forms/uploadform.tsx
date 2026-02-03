"use client";
import Form from 'next/form'
import React, { useState } from "react"
import {  Button } from '@mui/material'
import { Files } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { useDocumentStore } from '@/app/stores/documentStore';
export default function UploadForm(){
const setFile = useDocumentStore(state => state.setFile)
const [document, setDocument] = useState<File| null>();
 const router = useRouter()
 function handleFile( e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) { 
    const files = (e.target as HTMLInputElement).files; 
    if (!files || files.length === 0) {
         setDocument(null); return;
         }
          setDocument(files[0]); 
     }
  function DocViewer(e: React.SubmitEvent){
  e.preventDefault();

  if (!document) {
    console.log("No file selected");
    return;
  }

  console.log(document);
  setFile(document);
  router.push("/Viewer");
}



    return(
        <div >
    <form onSubmit={DocViewer}>
      
      <input
          onChange={handleFile}
          type="file"
         
          accept="image/*,application/pdf, /\.md/"
        />

        <button className='text-violet-600 border-2 p-2 rounded m-2' type='submit'>Submit</button>
    </form>
    </div>


    )
}