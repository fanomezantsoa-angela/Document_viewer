"use client";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { useState, useEffect, useMemo } from "react";
import Tooltip from "@mui/material/Tooltip";
import DocumentViewHeader from "./ViewerHeader/DocumentViewHeader";
import PrivacyControl from "./Privacy_Control/PrivacyControl";
import { UseViewMode } from "./Privacy_Control/ViewModehook";
import { changingMode } from "./Privacy_Control/Viewchange";
import { HighlightedSegments } from "../Higlighting/highlighting";
import HighlightFilter from "../Higlighting/HighlightFIlter";
import { detectEntities, ENTITY_COLORS, type Entity } from "../utils/entityDetection";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function PdfViewer({ file }: { file: File }) {
  const { viewMode } = UseViewMode();

  const [pageTexts, setPageTexts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [displayEntities, setDisplayEntities] = useState<Entity[]>([]);

  // Load and extract all page texts once when the file changes
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const buffer = await file.arrayBuffer();
      const pdf: PDFDocumentProxy = await getDocument({ data: buffer }).promise;
      const texts: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = (content as any).items
          .map((item: any) => item.str ?? "")
          .join(" ");
        texts.push(text);
      }

      if (!cancelled) {
        setPageTexts(texts);
        setCurrentPage(1);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [file]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setCurrentPage((p) => Math.min(p + 1, pageTexts.length));
      if (e.key === "ArrowLeft")  setCurrentPage((p) => Math.max(p - 1, 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pageTexts.length]);

  const currentPageText = pageTexts[currentPage - 1] ?? "";

  // Recompute entities only when the page text changes — no extra re-renders
  const allEntities = useMemo(() => detectEntities(currentPageText), [currentPageText]);

  // Reset display entities to the full set whenever the page changes
  useEffect(() => { setDisplayEntities(allEntities); }, [allEntities]);

  const processedText = useMemo(
    () => changingMode(currentPageText, displayEntities, viewMode),
    [currentPageText, displayEntities, viewMode]
  );

  const segments = useMemo(
    () => HighlightedSegments(currentPageText, displayEntities),
    [currentPageText, displayEntities]
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex flex-wrap items-center gap-4 shadow-sm">
        <PrivacyControl />
        <div className="w-px h-6 bg-slate-200" />
        <HighlightFilter allEntities={allEntities} onFilter={setDisplayEntities} />
        <div className="ml-auto">
          <DocumentViewHeader
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            pageNumber={pageTexts.length || 1}
            zoom={zoom}
            ZoomIn={() => setZoom((z) => Math.min(+(z + 0.1).toFixed(1), 3))}
            ZoomOut={() => setZoom((z) => Math.max(+(z - 0.1).toFixed(1), 0.5))}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex justify-center">
        <div
          className="w-full max-w-3xl bg-white shadow-sm border border-slate-200 rounded-xl p-8 origin-top"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
        >
          {viewMode === "full" ? (
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-800 leading-relaxed">
              {segments.map((seg, idx) =>
                seg.entity ? (
                  <Tooltip
                    key={idx}
                    title={`${seg.entity.type} — ${(seg.entity.confidence * 100).toFixed(0)}% confidence`}
                  >
                    <span className={`${ENTITY_COLORS[seg.entity.type] ?? ""} px-0.5 rounded cursor-pointer`}>
                      {seg.text}
                    </span>
                  </Tooltip>
                ) : (
                  <span key={idx}>{seg.text}</span>
                )
              )}
            </pre>
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-800 leading-relaxed">
              {processedText}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
