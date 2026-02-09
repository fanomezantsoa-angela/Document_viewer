
import { create } from "zustand";

interface DocumentState {
  file: File | null;          
  filePath: string | null;    
  setFile: (file: File) => void;
  setFilePath: (path: string) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  file: null,
  filePath: null,
  setFile: (file) => set({ file, filePath: null }),       
  setFilePath: (path) => set({ filePath: path, file: null }) 
}));