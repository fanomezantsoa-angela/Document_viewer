import { Router, Request, Response } from "express";
import { uploads } from "./upload";

const router = Router();

// GET /api/status/:id
// Returns the current processing status and progress for an upload
router.get("/:id", (req: Request, res: Response) => {
  const record = uploads.get(req.params.id as string);

  if (!record) {
    res.status(404).json({ error: "Upload not found" });
    return;
  }

  res.json({
    status: record.status,
    progress: record.progress,
    entities_found: record.entities?.length ?? 0,
    error: record.error,
  });
});

export default router;
