"use client"
import ReactMarkdown from "react-markdown";
import PdfViewer from "./PDFViewer";
import { useState } from "react";
import PlainTextViewer from "./PlainTextViewer";
import MarkdownViewer from "./MarkdownViewer";
import ImageViewer from "./ImageViewer";
export default function DocumentViewer({ file }: { file: File }) {

  const type = file.type;

  if (type === "application/pdf") {
     return <PdfViewer file={file}/>
  }

  if (type.startsWith("image/")) {
    <ImageViewer file={file}/>
   
  }

  if (type === "text/plain") {
    const [text, setText] = useState("");
    file.text().then(setText);
    console.log(text)
    return  <PlainTextViewer text={text}/>;
  }

  if (file.name.endsWith(".md")) {
    const [md, setMd] = useState("");
    file.text().then(setMd);
    return  <MarkdownViewer text={md}/>;
  }


  return (
    <div>
      Loading..
    </div>


  );
}
