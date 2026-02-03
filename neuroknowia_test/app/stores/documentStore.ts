import { create } from "zustand"

interface DocumentStore {
  file: File | null
  setFile: (file: File) => void
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  file: null,
  setFile: (file) => set({ file }),
}))
