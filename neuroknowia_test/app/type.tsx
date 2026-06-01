interface Entity { 
  text: string; 
  type: string; 
  start: number; 
  end: number; 
  confidence: number; 
  context: string; 
}
interface DocumentViewHeaderProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageNumber: number ;
  currentPage: number;
   zoom: number;
  ZoomIn: () => void;
  ZoomOut: () => void;

 
}
interface Loading{
  loading: boolean
}
const highlightColor: Record<string, string> = {
  PERSON: "bg-blue-300",
  ORGANISATION:"bg-blue-300",
  DATE: "bg-green-300",
  AMOUNT: "bg-orange-300",
  MEDICAL: "bg-purple-300",
  LEGAL: "bg-purple-300",
};
   interface EntitySidebarProps { 
        open: boolean; 
        onClose: () => void; 
        entity: Entity | null; 
        entities: Entity[]; 
    }
   type ViewMode = "full" | "redacted" | "summary";
   export type ProcessingStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "completed"
  | "failed";

   export type Stage = "upload" | "processing" | "results"; 

   export type Sector = "Healthcare" | "Legal" | "Finance";

   export interface ProcessedDocument { 
    uploadId: string; 
    documentId: string; 
    file: File; 
    sector: Sector; 
    status: ProcessingStatus; 
    progress: number; 
  
    confidenceScore?: number; 
    extractedText?: string; 
    error?: string;
   }

