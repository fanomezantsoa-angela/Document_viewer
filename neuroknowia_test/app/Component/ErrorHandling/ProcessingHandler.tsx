"use client";
import { useEffect, useState, useRef } from "react";
import type { ProcessedDocument, Sector, Stage } from "@/app/type";
import { Uploadhandler, StatusApi, Results, useToast } from "./UploadHandling";
import ProcessionDoc from "./ProcessingDoc";
import UploadForm from "../Forms/uploadform";
import ResultContent from "./ResultContent";
import { useDocumentStore } from "@/app/stores/documentStore";
export default function ProcessingHandler() {
  const [stage, setStage] = useState<Stage>("upload");
  const [docs, setDocs] = useState<ProcessedDocument[]>([]);
  const [docSector, setDocSector] = useState<Sector>("Healthcare");
  const processingRef = useRef(false); // ← Prevent double processing
   const setFile= useDocumentStore((state) => state.setFile);
  const toast = useToast();

  const reset = () => {
    setDocs([]);
    setStage("upload");
    processingRef.current = false;
  };

  const handleUpload = (files: File[], selectedSector: Sector) => {
    const validated: ProcessedDocument[] = [];
    const errors: string[] = [];

    files.forEach(file => {
    
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: file too large (>10MB)`);
        return;
      }

    
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png",
        "text/markdown",
      ];

      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: unsupported file type`);
        return;
      }

      validated.push({
        uploadId: "",
        documentId: "",
        file,
        sector: selectedSector,
        status: "idle",
        progress: 0,
      
      });
    });

  
    errors.forEach(e => toast.error(e));

    if (!validated.length) return;

    setDocSector(selectedSector);
    setDocs(validated);
    setStage("processing");
  };


  useEffect(() => {
    if (stage !== "processing" || docs.length === 0 || processingRef.current) {
      return;
    }

    processingRef.current = true;
    let cancelled = false;

    async function processAllDocuments() {
      for (const doc of docs) {
        if (cancelled) break;

       
        let uploadId = "";
        let attempts = 0;
        const MAX_RETRIES = 3;

        while (attempts < MAX_RETRIES && !uploadId && !cancelled) {
          attempts++;
          try {
            const res = await Uploadhandler([doc.file]);
            uploadId = res.uploadId;
            
        
            setDocs(prev => prev.map(d => 
              d.file.name === doc.file.name 
                ? { ...d, uploadId, status: "uploading" as const }
                : d
            ));
            
          } catch (err: any) {
            console.error(`Upload attempt ${attempts} failed:`, err);
            
            if (attempts >= MAX_RETRIES) {
              toast.error(`${doc.file.name}: upload failed after ${MAX_RETRIES} attempts`);
              
              setDocs(prev => prev.map(d =>
                d.file.name === doc.file.name
                  ? { ...d, status: "failed" as const, error: err.message }
                  : d
              ));
              break;
            }
         
            await new Promise(r => setTimeout(r, 1000));
          }
        }

        if (!uploadId || cancelled) continue;

     
        let status: "processing" | "completed" | "failed" = "processing";
        let progress = 0;

        while (!cancelled && status === "processing") {
          try {
            const statusRes = await StatusApi(uploadId);
            status = statusRes.status;
            progress = statusRes.progress;

            setDocs(prev => prev.map(d =>
              d.file.name === doc.file.name
                ? { ...d, status, progress }
                : d
            ));

            if (status === "processing") {
              await new Promise(r => setTimeout(r, 1000)); 
            }
          } catch (err: any) {
            console.error("Status check failed:", err);
            status = "failed";
            break;
          }
        }

        if (cancelled) break;

     
        if (status === "failed") {
          toast.error(`${doc.file.name}: processing failed`);
          setDocs(prev => prev.map(d =>
            d.file.name === doc.file.name
              ? { ...d, status: "failed", error: "Processing failed" }
              : d
          ));
          continue;
        }

      
        try {
          const results = await Results(uploadId);
          
          const completed: ProcessedDocument = {
            ...doc,
            uploadId,
            documentId: results.document_id,
            status: "completed",
            progress: 100,
        
            confidenceScore: results.confidence_score,
            extractedText: results.extracted_text,
          };

          setDocs(prev => prev.map(d =>
            d.file.name === doc.file.name ? completed : d,
            setFile(doc.file)
             
          ));

          toast.success(`${doc.file.name}: processed successfully`);
          
        } catch (err: any) {
          console.error("Failed to fetch results:", err);
          toast.error(`${doc.file.name}: failed to fetch results`);
          
          setDocs(prev => prev.map(d =>
            d.file.name === doc.file.name
              ? { ...d, status: "failed", error: err.message }
              : d
          ));
        }
      }

      if (!cancelled) {
        setStage("results");
      }
    }

    processAllDocuments();

    return () => {
      cancelled = true;
    };
  }, [stage]);


  if (stage === "upload") {
    return (
      <>
        <UploadForm onStart={handleUpload} />
        <toast.ToastContainer />
      </>
    );
  }

  if (stage === "processing") {
    return (
      <>
        <ProcessionDoc documents={docs} onCancel={reset} />
        <toast.ToastContainer />
      </>
    );
  }

  return (
    <>
      <ResultContent 
        documents={docs} 
        sector={docSector} 
        onProcessAnother={reset} 
      />
      <toast.ToastContainer />
    </>
  );
}