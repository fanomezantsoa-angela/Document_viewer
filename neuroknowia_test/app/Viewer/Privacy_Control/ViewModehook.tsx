"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type ViewMode = "full" | "redacted" | "summary";

type ViewModeContextType = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
};

const ViewModeContext = createContext<ViewModeContextType | null>(null);

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
  const ctx = useContext(ViewModeContext);
  if (!ctx) throw new Error("UseViewMode must be used inside ViewModeProvider");
  return ctx;
}
