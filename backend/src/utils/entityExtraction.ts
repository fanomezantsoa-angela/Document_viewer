import { Entity } from "../types";

export function extractEntities(text: string): Entity[] {
  if (!text) return [];

  const entities: Entity[] = [];
  // Track positions already claimed so ranges don't overlap
  const occupied = new Set<number>();

  const addEntity = (
    match: RegExpExecArray,
    type: string,
    confidence: number,
    context: string
  ) => {
    // Skip if this start position is already used by another entity
    if (occupied.has(match.index)) return;
    occupied.add(match.index);

    entities.push({
      text: match[0],
      type,
      start: match.index,
      end: match.index + match[0].length,
      confidence,
      context,
    });
  };

  // DATE — MM/DD/YYYY, no anchors so it matches inside a sentence
  const dateRegex = /(0?[1-9]|1[0-2])\/\d{1,2}\/(19|20)\d\d/g;
  let m: RegExpExecArray | null;
  while ((m = dateRegex.exec(text)) !== null) addEntity(m, "DATE", 0.95, "Date reference");

  // AMOUNT — currency symbols followed by a number, or large comma-separated numbers
  const amountRegex = /(?:\$|€|£)\s?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?/g;
  while ((m = amountRegex.exec(text)) !== null) addEntity(m, "AMOUNT", 0.92, "Financial amount");

  // PERSON — two or more consecutive capitalised words (e.g. "John Smith")
  const personRegex = /\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)+\b/g;
  while ((m = personRegex.exec(text)) !== null) addEntity(m, "PERSON", 0.85, "Person name");

  // MEDICAL_TERM — words ending in common medical suffixes
  const medRegex = /\b[a-zA-Z]+(itis|osis|emia|pathy|algia|ectomy|ology|phobia|plasia|genic)\b/g;
  while ((m = medRegex.exec(text)) !== null) addEntity(m, "MEDICAL_TERM", 0.85, "Medical term");

  return entities.sort((a, b) => a.start - b.start);
}
