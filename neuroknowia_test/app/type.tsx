interface Entity { text: string; type: string; start: number; end: number; confidence: number; context: string; }
interface DocumentViewHeaderProps {

  pageNumber: number ;

   zoom: number;
  ZoomIn: () => void;
  ZoomOut: () => void;

 
}
interface Loading{
  loading: boolean
}
