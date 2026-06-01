import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { uploadMiddleware } from "../middleware/upload";
import { UploadRecord } from "../types";
import { extractEntities } from "../utils/entityExtraction";

const router = Router();

// In-memory store — maps uploadId → UploadRecord
// In a real app you would use a database (PostgreSQL, MongoDB, etc.)
export const uploads = new Map<string, UploadRecord>();

// POST /api/upload
// Accepts: multipart/form-data with fields:
//   files[]  — one or more document files
//   sector   — "Healthcare" | "Legal" | "Finance"
router.post(
  "/",
  uploadMiddleware.array("files", 5),
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const sector = (req.body.sector as string) || "Healthcare";

    if (!files || files.length === 0) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }

    // Create an upload record for every file and start processing in the background
    const results = files.map((file) => {
      const id = uuidv4();

      const record: UploadRecord = {
        id,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer,
        sector,
        status: "uploading",
        progress: 0,
        createdAt: new Date(),
      };

      uploads.set(id, record);
      processDocument(id); // fire-and-forget
      return { uploadId: id, filename: file.originalname };
    });

    res.status(201).json({ uploads: results });
  }
);

// Simulate async document processing with incremental progress updates
async function processDocument(id: string): Promise<void> {
  const record = uploads.get(id);
  if (!record) return;

  // Short delay before switching to "processing"
  await sleep(400);
  record.status = "processing";
  record.progress = 10;

  // Simulate work in ~5 increments
  for (let p = 25; p <= 90; p += 20) {
    await sleep(700);
    record.progress = p;
  }

  try {
    let text = extractText(record);
    record.entities = extractEntities(text);
    record.extractedText = text;
    record.confidenceScore = parseFloat((0.85 + Math.random() * 0.13).toFixed(4));
    record.status = "completed";
    record.progress = 100;
  } catch {
    record.status = "failed";
    record.progress = 100;
  }
}

function extractText(record: UploadRecord): string {
  const { mimetype, filename, buffer } = record;

  if (mimetype === "text/plain" || mimetype === "text/markdown") {
    // We actually have the content — decode and return it
    return buffer.toString("utf-8");
  }

  if (mimetype === "application/pdf") {
    // Production: use pdf-parse or pdfjs-dist server-side
    return `[PDF] Content extracted from "${filename}".\n\nIntegrate pdf-parse for real text extraction.`;
  }

  if (mimetype.startsWith("image/")) {
    // Production: use Tesseract.js (or a cloud OCR API)
    return `[IMAGE] OCR output from "${filename}".\n\nIntegrate Tesseract.js server-side for real OCR.`;
  }

  return `[Document] Content from "${filename}".`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export default router;
