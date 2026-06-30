import { UploadRecord } from "../types";
import { extractEntities } from "../utils/entityExtraction";
import { extractDocumentText } from "./documentTextExtractor";

type UploadStore = Map<string, UploadRecord>;

export async function processDocument(
  id: string,
  uploads: UploadStore
): Promise<void> {
  const record = uploads.get(id);
  if (!record) return;

  await sleep(400);
  record.status = "processing";
  record.progress = 10;

  for (let progress = 25; progress <= 90; progress += 20) {
    await sleep(700);
    record.progress = progress;
  }

  try {
    const text = await extractDocumentText(record);

    record.extractedText = text;
    record.entities = extractEntities(text);
    record.confidenceScore = calculateConfidenceScore(text);
    record.status = "completed";
    record.progress = 100;
  } catch (error) {
    record.status = "failed";
    record.progress = 100;
    record.error = error instanceof Error ? error.message : "Document processing failed";
  }
}

function calculateConfidenceScore(text: string): number {
  if (!text.trim()) return 0;
  return parseFloat((0.85 + Math.random() * 0.13).toFixed(4));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
