import { create } from "zustand"

type PdfFile =  File ; 
interface DocumentState { 
    file: PdfFile;
     setFile: (file: PdfFile) => void; 
    } 
export const useDocumentStore = 
create<DocumentState>((set) => ({ 
    file: null, 
    setFile: (file) => set({ file }), 
}));
