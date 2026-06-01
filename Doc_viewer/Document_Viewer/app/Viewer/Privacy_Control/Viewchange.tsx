import { type Entity } from "@/app/utils/entityDetection";
import { type ViewMode } from "./ViewModehook";

export function changingMode(
  text: string,
  entities: Entity[],
  viewmode: ViewMode
): string {
  if (!text) return "";

  if (viewmode === "full") {
    return text;
  }

  if (viewmode === "redacted") {
    // Replace entities from back to front so character positions stay valid
    let result = text;
    const sorted = [...entities].sort((a, b) => b.start - a.start);
    for (const e of sorted) {
      result = result.substring(0, e.start) + "[REDACTED]" + result.substring(e.end);
    }
    return result;
  }

  // summary mode — group key entities by type
  const key = entities.filter((e) =>
    ["MEDICAL_TERM", "AMOUNT", "DATE"].includes(e.type)
  );

  if (key.length === 0) return "No key information found.";

  const grouped: Record<string, Entity[]> = {};
  for (const e of key) {
    (grouped[e.type] ??= []).push(e);
  }

  let summary = "DOCUMENT SUMMARY\n\n";
  for (const [type, list] of Object.entries(grouped)) {
    summary += `${type}:\n`;
    for (const e of list) summary += `  • ${e.text}\n`;
    summary += "\n";
  }
  return summary;
}
