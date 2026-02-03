"use client"
import ReactMarkdown from "react-markdown";
import mammoth from "mammoth";

import { useState } from "react";
export default function DocumentViewer({ file }: { file: File }) {
  const type = file.type;

  if (type === "application/pdf") {
    return <iframe src={URL.createObjectURL(file)} className="w-full h-screen" />;
  }

  if (type.startsWith("image/")) {
    return <img src={URL.createObjectURL(file)} />;
  }

  if (type === "text/plain") {
    const [text, setText] = useState("");
    file.text().then(setText);
    return <pre>{text}</pre>;
  }

  if (file.name.endsWith(".md")) {
    const [md, setMd] = useState("");
    file.text().then(setMd);
    return <ReactMarkdown>{md}</ReactMarkdown>;
  }

  if (file.name.endsWith(".docx")) {
    const [html, setHtml] = useState("");
    file.arrayBuffer().then(async (buf) => {
      const { value } = await mammoth.convertToHtml({ arrayBuffer: buf });
      setHtml(value);
    });
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return <div>Unsupported file type</div>;
}
