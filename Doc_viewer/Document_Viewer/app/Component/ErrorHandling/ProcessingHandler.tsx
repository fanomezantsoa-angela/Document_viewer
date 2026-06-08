"use client";
import { useEffect, useState, useRef } from "react";
import type { ProcessedDocument, Sector, Stage } from "@/app/type";
import { Uploadhandler, StatusApi, Results, useToast } from "./UploadHandling";
import ProcessionDoc from "./ProcessingDoc";
import UploadForm from "../Forms/uploadform";
import ResultContent from "./ResultContent";
import { useDocumentStore } from "@/app/stores/documentStore";

export default function ProcessingHandler() {
  const [stage, setStage] = useState<Stage>("upload");
  const [docs, setDocs] = useState<ProcessedDocument[]>([]);
  const [docSector, setDocSector] = useState<Sector>("Healthcare");
  const processingRef = useRef(false);
  const setFile = useDocumentStore((state) => state.setFile);
  const toast = useToast();

  const reset = () => {
    setDocs([]);
    setStage("upload");
    processingRef.current = false;
  };

  const handleUpload = (files: File[], selectedSector: Sector) => {
    const validated: ProcessedDocument[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: file too large (> 10 MB)`);
        return;
      }

      const allowed = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png",
        "text/markdown",
      ];

      if (!allowed.includes(file.type)) {
        errors.push(`${file.name}: unsupported type`);
        return;
      }

      validated.push({
        uploadId: "",
        documentId: "",
        file,
        sector: selectedSector,
        status: "idle",
        progress: 0,
      });
    });

    errors.forEach((e) => toast.error(e));
    if (!validated.length) return;

    setDocSector(selectedSector);
    setDocs(validated);
    setStage("processing");
  };

  useEffect(() => {
    if (stage !== "processing" || docs.length === 0 || processingRef.current) return;

    processingRef.current = true;
    let cancelled = false;

    async function processAll() {
      for (const doc of docs) {
        if (cancelled) break;

        // ── Upload with up to 3 retries ────────────────────────────────────
        let uploadId = "";
        for (let attempt = 1; attempt <= 3 && !uploadId && !cancelled; attempt++) {
          try {
            const res = await Uploadhandler([doc.file], doc.sector);
            uploadId = res.uploadId;
            setDocs((prev) =>
              prev.map((d) =>
                d.file.name === doc.file.name
                  ? { ...d, uploadId, status: "uploading" as const }
                  : d
              )
            );
          } catch (err: any) {
            if (attempt >= 3) {
              toast.error(`${doc.file.name}: upload failed`);
              setDocs((prev) =>
                prev.map((d) =>
                  d.file.name === doc.file.name
                    ? { ...d, status: "failed" as const, error: err.message }
                    : d
                )
              );
            } else {
              await new Promise((r) => setTimeout(r, 1000));
            }
          }
        }

        if (!uploadId || cancelled) continue;

        // ── Poll status until done ─────────────────────────────────────────
        let status: "processing" | "completed" | "failed" = "processing";
        while (!cancelled && status === "processing") {
          try {
            const s = await StatusApi(uploadId);
            status = s.status;
            setDocs((prev) =>
              prev.map((d) =>
                d.file.name === doc.file.name
                  ? { ...d, status, progress: s.progress }
                  : d
              )
            );
            if (status === "processing") await new Promise((r) => setTimeout(r, 1000));
          } catch {
            status = "failed";
          }
        }

        if (cancelled) break;

        if (status === "failed") {
          toast.error(`${doc.file.name}: processing failed`);
          setDocs((prev) =>
            prev.map((d) =>
              d.file.name === doc.file.name
                ? { ...d, status: "failed", error: "Processing failed" }
                : d
            )
          );
          continue;
        }

        // ── Fetch results ──────────────────────────────────────────────────
        try {
          const results = await Results(uploadId);

          // Store the file in Zustand so the viewer can access it
          setFile(doc.file);

          setDocs((prev) =>
            prev.map((d) =>
              d.file.name === doc.file.name
                ? {
                    ...d,
                    uploadId,
                    documentId: results.document_id,
                    status: "completed",
                    progress: 100,
                    confidenceScore: results.confidence_score,
                    extractedText: results.extracted_text,
                  }
                : d
            )
          );

          toast.success(`${doc.file.name}: processed successfully`);
        } catch (err: any) {
          toast.error(`${doc.file.name}: failed to fetch results`);
          setDocs((prev) =>
            prev.map((d) =>
              d.file.name === doc.file.name
                ? { ...d, status: "failed", error: err.message }
                : d
            )
          );
        }
      }

      if (!cancelled) setStage("results");
    }

    processAll();
    return () => { cancelled = true; };
  }, [stage]);

  if (stage === "upload") {
    return (
      <>
        <UploadForm onStart={handleUpload} />
        <toast.ToastContainer />
      </>
    );
  }

  if (stage === "processing") {
    return (
      <>
        <ProcessionDoc documents={docs} onCancel={reset} />
        <toast.ToastContainer />
      </>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <ResultContent documents={docs} sector={docSector} onProcessAnother={reset} />
      <toast.ToastContainer />
    </div>
  );
}
