import { UploadRecord } from "../types";
import { extractPdfText } from "./pdfTextExtractor";

export async function extractDocumentText(record: UploadRecord): Promise<string> {
  const { mimetype, filename, buffer } = record;

  if (isTextDocument(mimetype)) {
    return buffer.toString("utf-8");
  }

  if (mimetype === "application/pdf") {
    return extractPdfText(buffer, filename);
  }

  if (mimetype.startsWith("image/")) {
    return `[IMAGE] OCR is not implemented yet for "${filename}". Add an OCR extractor service here.`;
  }

  return `[Document] Text extraction is not implemented yet for "${filename}" (${mimetype}).`;
}

function isTextDocument(mimetype: string): boolean {
  return mimetype === "text/plain" || mimetype === "text/markdown";
}
