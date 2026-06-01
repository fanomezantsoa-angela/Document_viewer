"use client";
import { useState } from "react";
import data from "../Mock_Data/Highlighting_data.json";
import HighlightFilter from "./HighlightFIlter";
import { type Entity } from "../utils/entityDetection";

export default function Highlight() {
  const allEntities: Entity[] = data.entities as Entity[];
  const [displayed, setDisplayed] = useState<Entity[]>(allEntities);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Highlighting demo</h1>
      <HighlightFilter allEntities={allEntities} onFilter={setDisplayed} />
      <ul className="mt-4 space-y-2">
        {displayed.map((e, i) => (
          <li key={i} className="border border-slate-200 rounded-lg p-3 text-sm bg-white">
            <span className="font-medium text-slate-800">{e.text}</span>
            <span className="ml-2 text-slate-400">{e.type}</span>
            <span className="ml-2 text-slate-400">{(e.confidence * 100).toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
