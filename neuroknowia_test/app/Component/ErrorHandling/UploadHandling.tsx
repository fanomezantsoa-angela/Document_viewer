"use client";
import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useState } from 'react';

interface Entity { 
  text: string; 
  type: string; 
  start: number; 
  end: number; 
  confidence: number; 
  context: string; 
}


const randomFail = (rate: number) => Math.random() < rate;

export async function Uploadhandler(
  files: File[]
): Promise<{ uploadId: string; status: "uploading" }> {
  console.log("Uploading...");
  

  await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
  
 
  if (randomFail(0.05)) {
    throw new Error("Network timeout during upload");
  }

  const uploadId = crypto.randomUUID();
  console.log(" Upload successful:", uploadId);
  
  return {
    uploadId,
    status: "uploading"
  };
}

export async function StatusApi(
  uploadId: string
): Promise<{
  status: "processing" | "failed" | "completed";
  progress: number;
  entities_found: number;
}> {
  console.log(" Checking status...");
  
 
  await new Promise(r => setTimeout(r, 800));
  

  if (randomFail(0.02)) {
    console.log(" Processing failed");
    return {
      status: "failed",
      progress: 100,
      entities_found: 0
    };
  }


  const progress = Math.min(100, Math.floor(Math.random() * 100));
  const isCompleted = progress >= 95;
  
  console.log(`Progress: ${progress}%`);

  return {
    status: isCompleted ? "completed" : "processing",
    progress,
    entities_found: isCompleted ? Math.floor(Math.random() * 20) + 3 : 0
  };
}

export async function Results(
  uploadId: string
): Promise<{
  document_id: string;
  confidence_score: number;
  extracted_text: string;
}> {
  console.log(" Fetching results...");
  
  await new Promise(r => setTimeout(r, 800));
  

  if (randomFail(0.02)) {
    throw new Error("Backend processing error");
  }


  console.log("Results fetched");

  return {
    document_id: crypto.randomUUID(),
    confidence_score: 0.85 + Math.random() * 0.13,
    extracted_text: `Extracted text for upload ${uploadId}\n\nSample medical report content...`,
   
  };
}
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>>([]);

  const addToast = (message: string, severity: 'success' | 'error' | 'info') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, severity }]);
    
  
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          style={{ top: 80 + index * 70 }}
        >
          <Alert 
            severity={toast.severity}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );

  return {
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
    ToastContainer
  };
}