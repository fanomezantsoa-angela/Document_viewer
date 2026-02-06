interface Entity { text: string; type: string; start: number; end: number; confidence: number; context: string; }
interface DocumentViewHeaderProps {
  page: number | null;
  pageNumber: number ;

  setNumberPage: (page: number) => void;
}
