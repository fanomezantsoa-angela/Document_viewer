"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type ViewMode = "full" | "redacted" | "summary";

type ViewModeContextType = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
};

// Provide sensible defaults so UseViewMode() works even outside a Provider
// (e.g. when DocumentViewer is embedded inside ResultContent without a wrapper)
const ViewModeContext = createContext<ViewModeContextType>({
  viewMode: "full",
  setViewMode: () => {},
});

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("full");

  useEffect(() => {
    const saved = localStorage.getItem("viewmode");
    if (saved === "full" || saved === "redacted" || saved === "summary") {
      setViewMode(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("viewmode", viewMode);
  }, [viewMode]);

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function UseViewMode() {
  return useContext(ViewModeContext);
}
