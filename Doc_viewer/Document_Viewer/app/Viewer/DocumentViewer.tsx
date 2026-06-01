"use client";
import { useState, useEffect } from "react";
import PdfViewer from "./PDFViewer";
import PlainTextViewer from "./PlainTextViewer";
import MarkdownViewer from "./MarkdownViewer";
import ImageViewer from "./ImageViewer";

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
