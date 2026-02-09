
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
  setFile: (file: File) => set({ file, filePath: null }),        
  setFilePath: (path: string) => set({ filePath: path, file: null }), 
}));