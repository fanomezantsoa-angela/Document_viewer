"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PlainTextViewer from "./PlainTextViewer";
import MarkdownViewer from "./MarkdownViewer";

// Load heavy viewers only when actually needed.
// pdfjs-dist is 37 MB and tesseract.js loads WebAssembly —
// dynamic imports keep them out of the initial bundle.
const PdfViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => <LoadingSpinner label="Loading PDF viewer…" />,
});

const ImageViewer = dynamic(() => import("./ImageViewer"), {
  ssr: false,
  loading: () => <LoadingSpinner label="Loading image viewer…" />,
});

function LoadingSpinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
      <div className="w-7 h-7 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

// These wrapper components exist because React's Rules of Hooks forbid calling
// useState/useEffect inside a conditional — each file type needs its own component.

function TextWrapper({ file }: { file: File }) {
  const [text, setText] = useState("");
  useEffect(() => { file.text().then(setText); }, [file]);
  return <PlainTextViewer text={text} />;
}

function MarkdownWrapper({ file }: { file: File }) {
  const [md, setMd] = useState("");
  useEffect(() => { file.text().then(setMd); }, [file]);
  return <MarkdownViewer text={md} />;
}

export default function DocumentViewer({ file }: { file: File }) {
  const { type, name } = file;

  if (type === "application/pdf") return <PdfViewer file={file} />;
  if (type.startsWith("image/"))  return <ImageViewer file={file} />;
  if (type === "text/plain")       return <TextWrapper file={file} />;
  if (name.endsWith(".md") || type === "text/markdown") return <MarkdownWrapper file={file} />;

  return (
    <div className="p-6 text-slate-500 text-sm">
      Unsupported file type: <code>{type || name}</code>
    </div>
  );
}
