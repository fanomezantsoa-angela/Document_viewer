"use client"
import ReactMarkdown from "react-markdown";
import PdfViewer from "./PDFViewer";

import { useState } from "react";
export default function DocumentViewer({ file }: { file: File }) {

  const type = file.type;

  if (type === "application/pdf") {
     return <PdfViewer file={file}/>
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


  return (
    <div>
      Loading..
    </div>


  );
}
