export interface Entity {
  text: string;
  type: string;
  start: number;
  end: number;
  confidence: number;
  context: string;
}

export type ProcessingStatus = "uploading" | "processing" | "completed" | "failed";

export interface UploadRecord {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  sector: string;
  status: ProcessingStatus;
  progress: number;
  entities?: Entity[];
  extractedText?: string;
  confidenceScore?: number;
  createdAt: Date;
}
