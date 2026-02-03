import { create } from "zustand"

type PdfFile = string | File | Blob | Uint8Array | null; 
interface DocumentState { 
    file: PdfFile;
     setFile: (file: PdfFile) => void; 
    } 
export const useDocumentStore = 
create<DocumentState>((set) => ({ 
    file: null, 
    setFile: (file) => set({ file }), 
}));
