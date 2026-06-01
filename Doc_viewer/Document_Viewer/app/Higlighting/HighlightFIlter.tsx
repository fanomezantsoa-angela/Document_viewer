"use client";
import { type Entity } from "../utils/entityDetection";

const FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: "All entities", value: "ALL" },
  { label: "Person", value: "PERSON" },
  { label: "Date", value: "DATE" },
  { label: "Amount", value: "AMOUNT" },
  { label: "Medical term", value: "MEDICAL_TERM" },
];

interface Props {
  allEntities: Entity[];
  onFilter: (filtered: Entity[]) => void;
}

export default function HighlightFilter({ allEntities, onFilter }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    onFilter(value === "ALL" ? allEntities : allEntities.filter((ent) => ent.type === value));
  }

  return (
    <select
      onChange={handleChange}
      className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      {FILTER_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
