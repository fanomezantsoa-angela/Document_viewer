"use client";

interface DocumentViewHeaderProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageNumber: number;
  currentPage: number;
  zoom: number;
  ZoomIn: () => void;
  ZoomOut: () => void;
}

export default function DocumentViewHeader({
  setCurrentPage,
  currentPage,
  pageNumber,
  zoom,
  ZoomIn,
  ZoomOut,
}: DocumentViewHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Page navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setCurrentPage((p: number) => Math.max(p - 1, 1))}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
          aria-label="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        <span className="text-sm text-slate-600 min-w-[80px] text-center">
          {currentPage} / {pageNumber}
        </span>

        <button
          onClick={() => setCurrentPage((p: number) => Math.min(p + 1, pageNumber))}
          disabled={currentPage >= pageNumber}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
          aria-label="Next page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-1">
        <button
          onClick={ZoomOut}
          disabled={zoom <= 0.5}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
          aria-label="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>

        <span className="text-sm text-slate-600 w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={ZoomIn}
          disabled={zoom >= 3}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
          aria-label="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
