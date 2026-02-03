"use client"
import React, {useState, useRef} from 'react';
import ReactDOM from "react-dom";
import { usePdf } from '@mikecousins/react-pdf';
import { pdfjs } from "react-pdf";
export default function PdfViewer({pdfView}: {pdfView: File}){

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
  const [page, setPage] = useState(1);
 
  const canvasRef = useRef(null);
  const fileUrl= URL.createObjectURL(pdfView)
  const { pdfDocument, pdfPage } = usePdf({
    file: fileUrl,
    page,
    canvasRef,
  });

  return (
    <div>
      {!pdfDocument && <span>Loading...</span>}
      <canvas ref={canvasRef} />
      {Boolean(pdfDocument && pdfDocument.numPages) && (
        <nav>
          <ul className="pager">
            <li className="previous">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
            </li>
            <li className="next">
              <button
                disabled={page === pdfDocument?.numPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}