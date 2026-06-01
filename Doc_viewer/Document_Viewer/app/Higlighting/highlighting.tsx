import { type Entity } from "../utils/entityDetection";

export function HighlightedSegments(text: string, entities: Entity[]) {
  if (!text) return [];

  const segments: Array<{ text: string; entity?: Entity }> = [];
  let lastIndex = 0;

  // Entities are already sorted by start position (detectEntities guarantees this)
  for (const entity of entities) {
    if (entity.start > lastIndex) {
      segments.push({ text: text.substring(lastIndex, entity.start) });
    }
    segments.push({ text: text.substring(entity.start, entity.end), entity });
    lastIndex = entity.end;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.substring(lastIndex) });
  }

  return segments;
}
