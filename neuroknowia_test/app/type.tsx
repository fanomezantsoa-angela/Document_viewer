interface Entity { text: string; type: string; start: number; end: number; confidence: number; context: string; }
interface DocumentViewHeaderProps {
  page: number | null;
  setNumberPage: (page: number) => void;
}
