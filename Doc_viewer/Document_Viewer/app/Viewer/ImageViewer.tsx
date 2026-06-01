"use client";
import Tesseract from "tesseract.js";
import { useState, useEffect, useMemo, useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import DocumentViewHeader from "./ViewerHeader/DocumentViewHeader";
import PrivacyControl from "./Privacy_Control/PrivacyControl";
import { UseViewMode } from "./Privacy_Control/ViewModehook";
import { changingMode } from "./Privacy_Control/Viewchange";
import { HighlightedSegments } from "../Higlighting/highlighting";
import HighlightFilter from "../Higlighting/HighlightFIlter";
import { detectEntities, ENTITY_COLORS, type Entity } from "../utils/entityDetection";

const LINES_PER_PAGE = 60;

function paginateText(text: string): string[] {
  const lines = text.split("\n");
  const pages: string[] = [];
  for (let i = 0; i < lines.length; i += LINES_PER_PAGE) {
    pages.push(lines.slice(i, i + LINES_PER_PAGE).join("\n"));
  }
  return pages.length > 0 ? pages : [""];
}

export default function ImageViewer({ file }: { file: File }) {
  const { viewMode } = UseViewMode();

  const [pages, setPages] = useState<string[]>([""]);
  const [ocrLoading, setOcrLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [displayEntities, setDisplayEntities] = useState<Entity[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Run Tesseract OCR once when the image file changes
  useEffect(() => {
    let cancelled = false;
    setOcrLoading(true);

    Tesseract.recognize(file, "eng").then(({ data }) => {
      if (cancelled) return;
      setPages(paginateText(data.text));
      setCurrentPage(1);
      setOcrLoading(false);
    });

    return () => { cancelled = true; };
  }, [file]);

  // Scroll back to top on page change
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setCurrentPage((p) => Math.min(p + 1, pages.length));
      if (e.key === "ArrowLeft")  setCurrentPage((p) => Math.max(p - 1, 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pages.length]);

  const currentPageText = pages[currentPage - 1] ?? "";

  const allEntities = useMemo(() => detectEntities(currentPageText), [currentPageText]);
  useEffect(() => { setDisplayEntities(allEntities); }, [allEntities]);

  const processedText = useMemo(
    () => changingMode(currentPageText, displayEntities, viewMode),
    [currentPageText, displayEntities, viewMode]
  );

  const segments = useMemo(
    () => HighlightedSegments(currentPageText, displayEntities),
    [currentPageText, displayEntities]
  );

  if (ocrLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-500">
        <div className="w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-sm">Running OCR on image…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex flex-wrap items-center gap-4 shadow-sm">
        <PrivacyControl />
        <div className="w-px h-6 bg-slate-200" />
        <HighlightFilter allEntities={allEntities} onFilter={setDisplayEntities} />
        <div className="ml-auto">
          <DocumentViewHeader
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            pageNumber={pages.length}
            zoom={zoom}
            ZoomIn={() => setZoom((z) => Math.min(+(z + 0.1).toFixed(1), 3))}
            ZoomOut={() => setZoom((z) => Math.max(+(z - 0.1).toFixed(1), 0.5))}
          />
        </div>
      </div>

      <div className="flex justify-center" ref={scrollRef}>
        <div
          className="w-full max-w-3xl bg-white shadow-sm border border-slate-200 rounded-xl p-8"
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
