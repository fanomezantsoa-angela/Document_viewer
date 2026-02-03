"use client";
import Form from 'next/form'
import React, { useState } from "react"
import { Button } from '@mui/material'
import { Files } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { useDocumentStore } from '@/app/stores/documentStore';
export default function UploadForm() {
    const setFile = useDocumentStore(state => state.setFile)
    const [document, setDocument] = useState<File | null>(null);

    const router = useRouter()
    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const files = (e.target as HTMLInputElement).files;
        if (!files || files.length === 0) {
            setDocument(null); return;
        }
        setDocument(files[0]);
    }
    function DocViewer(e: React.SubmitEvent) {
        e.preventDefault();

        if (!document) {
            console.log("No file selected");
            return;
        }

        console.log(document);
        setFile(document);
        router.push("/Viewer");
    }



    return (
        <div >
            <form onSubmit={DocViewer}>

                <input
                    type="file"
                    onChange={handleFile}
                    accept="
    text/plain,
    application/pdf,
    application/vnd.openxmlformats-officedocument.wordprocessingml.document,
    image/png,
    image/jpeg,
    .txt,
    .md,
    .docx
  "
                />


                <button className='text-violet-600 border-2 p-2 rounded m-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700' type='submit'>Submit</button>
            </form>
        </div>


    )
}