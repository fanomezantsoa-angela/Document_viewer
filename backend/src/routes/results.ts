import { Router, Request, Response } from "express";
import { uploads } from "./upload";

const router = Router();

// GET /api/results/:id
// Returns the full extraction results once processing is complete
router.get("/:id", (req: Request, res: Response) => {
  const record = uploads.get(req.params.id as string);

  if (!record) {
    res.status(404).json({ error: "Upload not found" });
    return;
  }

  if (record.status !== "completed") {
    res.status(400).json({ error: "Processing not complete", status: record.status });
    return;
  }

  res.json({
    document_id: record.id,
    filename: record.filename,
    sector: record.sector,
    confidence_score: record.confidenceScore,
    extracted_text: record.extractedText,
    entities: record.entities ?? [],
  });
});

export default router;
