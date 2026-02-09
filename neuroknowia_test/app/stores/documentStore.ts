import { create } from "zustand"; 
interface DocumentState { 
    file: File | null; 
    setFile: (file: File) => void; 
} 
export const useDocumentStore = create<DocumentState>((set) => ({
     file: null, setFile: (file) => set({ file }), 
    })); 