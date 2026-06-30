"use client";

import { useEffect, useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import DocumentViewHeader from "./ViewerHeader/DocumentViewHeader";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type PdfLoadSuccess = {
  numPages: number;
};

export default function PdfViewer({ file }: { file: File }) {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const pdfSource = useMemo(() => (pdfBytes ? { data: pdfBytes } : null), [pdfBytes]);

  useEffect(() => {
    let cancelled = false;

    async function readFile() {
      try {
        const buffer = await file.arrayBuffer();

        if (!cancelled) {
          setPdfBytes(new Uint8Array(buffer));
        }
      } catch (readError) {
        if (!cancelled) {
          setError(readError instanceof Error ? readError.message : "Unable to read PDF file.");
        }
      }
    }

    setPdfBytes(null);
    setPageCount(0);
    setCurrentPage(1);
    setError(null);
    readFile();

    return () => {
      cancelled = true;
    };
  }, [file]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setCurrentPage((page) => Math.min(page + 1, pageCount || 1));
      }

      if (event.key === "ArrowLeft") {
        setCurrentPage((page) => Math.max(page - 1, 1));
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pageCount]);

  function handleLoadSuccess({ numPages }: PdfLoadSuccess) {
    setPageCount(numPages);
    setCurrentPage(1);
    setError(null);
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex justify-end shadow-sm">
        <DocumentViewHeader
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          pageNumber={pageCount || 1}
          zoom={zoom}
          ZoomIn={() => setZoom((value) => Math.min(+(value + 0.1).toFixed(1), 3))}
          ZoomOut={() => setZoom((value) => Math.max(+(value - 0.1).toFixed(1), 0.5))}
        />
      </div>

      <div className="flex justify-center overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-4">
        {pdfSource ? (
          <Document
            file={pdfSource}
            loading={<PdfStateMessage label="Loading PDF..." />}
            error={<PdfStateMessage label={error ?? "Unable to load PDF."} />}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={(loadError) => setError(loadError.message)}
          >
            <Page
              pageNumber={currentPage}
              scale={zoom}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              loading={<PdfStateMessage label="Loading page..." />}
            />
          </Document>
        ) : (
          <PdfStateMessage label={error ?? "Preparing PDF..."} />
        )}
      </div>
    </div>
  );
}

function PdfStateMessage({ label }: { label: string }) {
  return (
    <div className="flex h-64 min-w-64 items-center justify-center text-sm text-slate-500">
      {label}
    </div>
  );
}
