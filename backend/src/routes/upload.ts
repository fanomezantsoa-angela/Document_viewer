import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { uploadMiddleware } from "../middleware/upload";
import { UploadRecord } from "../types";
import { processDocument } from "../services/documentProcessor";

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
      processDocument(id, uploads); // fire-and-forget
      return { uploadId: id, filename: file.originalname };
    });

    res.status(201).json({ uploads: results });
  }
);

export default router;
