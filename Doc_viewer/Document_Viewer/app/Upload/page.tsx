"use client";
import React from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Modal, Box } from "@mui/material";
import ProcessingHandler from "../Component/ErrorHandling/ProcessingHandler";

export default function Upload() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Upload documents</h1>
        <p className="text-slate-500">PDF, Word, text, markdown or images — up to 5 files, 10 MB each.</p>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center gap-4 w-72 py-12 rounded-2xl border-2 border-dashed border-indigo-300 bg-white hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
      >
        <CloudUploadIcon
          className="text-indigo-400 group-hover:text-indigo-600 transition-colors"
          sx={{ fontSize: 48 }}
        />
        <span className="text-sm font-semibold text-indigo-600">Click to open uploader</span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl bg-white rounded-2xl shadow-xl outline-none">
          <ProcessingHandler />
        </Box>
      </Modal>
    </div>
  );
}
