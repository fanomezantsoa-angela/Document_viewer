"use client";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState } from "react";

const API_BASE = "http://localhost:4000/api";

// ─── Upload ────────────────────────────────────────────────────────────────

export async function Uploadhandler(
  files: File[],
  sector: string = "Healthcare"
): Promise<{ uploadId: string; status: "uploading" }> {
  try {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    form.append("sector", sector);

    const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: form });
    if (!res.ok) throw new Error(`Server error ${res.status}`);

    const data = await res.json();
    return { uploadId: data.uploads[0].uploadId, status: "uploading" };
  } catch (err) {
    // Backend not running — fall back to mock so the UI stays usable
    console.warn("Backend unavailable, using mock upload:", err);
    await sleep(800 + Math.random() * 600);
    if (Math.random() < 0.05) throw new Error("Network timeout during upload");
    return { uploadId: crypto.randomUUID(), status: "uploading" };
  }
}

// ─── Status polling ─────────────────────────────────────────────────────────

export async function StatusApi(uploadId: string): Promise<{
  status: "processing" | "failed" | "completed";
  progress: number;
  entities_found: number;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/status/${uploadId}`);
    if (!res.ok) throw new Error(`Status error ${res.status}`);
    return await res.json();
  } catch {
    // Mock fallback — simulate incremental progress
    await sleep(700);
    const progress = Math.min(100, Math.floor(Math.random() * 100));
    const isCompleted = progress >= 95;
    return {
      status: isCompleted ? "completed" : "processing",
      progress,
      entities_found: 0,
    };
  }
}

// ─── Results ────────────────────────────────────────────────────────────────

export async function Results(uploadId: string): Promise<{
  document_id: string;
  confidence_score: number;
  extracted_text: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/results/${uploadId}`);
    if (!res.ok) throw new Error(`Results error ${res.status}`);
    return await res.json();
  } catch {
    // Mock fallback
    await sleep(600);
    return {
      document_id: crypto.randomUUID(),
      confidence_score: parseFloat((0.85 + Math.random() * 0.13).toFixed(4)),
      extracted_text: `Extracted text for upload ${uploadId}\n\nSample content.`,
    };
  }
}

// ─── Toast notifications ────────────────────────────────────────────────────

export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; severity: "success" | "error" | "info" }>
  >([]);

  const add = (message: string, severity: "success" | "error" | "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, severity }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          style={{ top: 80 + index * 70 }}
        >
          <Alert
            severity={toast.severity}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );

  return {
    success: (msg: string) => add(msg, "success"),
    error: (msg: string) => add(msg, "error"),
    info: (msg: string) => add(msg, "info"),
    ToastContainer,
  };
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
