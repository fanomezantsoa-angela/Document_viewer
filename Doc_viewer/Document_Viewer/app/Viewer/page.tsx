"use client";
import { useState, useEffect } from "react";
import DocumentViewer from "./DocumentViewer";
import { useDocumentStore } from "../stores/documentStore";
import { ViewModeProvider } from "./Privacy_Control/ViewModehook";

// Fetches a file from the Next.js /public folder and wraps it in a File object
function FilePathViewer({ path }: { path: string }) {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const name = path.split("/").pop() || "file";
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    const typeMap: Record<string, string> = {
      txt: "text/plain",
      md: "text/markdown",
      pdf: "application/pdf",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
    };

    fetch(path)
      .then((r) => r.blob())
      .then((blob) => {
        const type = typeMap[ext] ?? blob.type ?? "application/octet-stream";
        setFile(new File([blob], name, { type }));
      });
  }, [path]);

  if (!file)
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        Loading document…
      </div>
    );

  return <DocumentViewer file={file} />;
}

export default function ViewerPage() {
  const file = useDocumentStore((state) => state.file);
  const filePath = useDocumentStore((state) => state.filePath);

  return (
    <ViewModeProvider>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {file ? (
          <DocumentViewer file={file} />
        ) : filePath ? (
          <FilePathViewer path={filePath} />
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400">
            No document loaded.{" "}
            <a href="/" className="ml-1 text-indigo-600 underline">
              Go back
            </a>
          </div>
        )}
      </div>
    </ViewModeProvider>
  );
}
