export interface Entity {
  text: string;
  type: string;
  start: number;
  end: number;
  confidence: number;
  context: string;
}

// Tailwind classes used to colour each entity type in the viewer
export const ENTITY_COLORS: Record<string, string> = {
  DATE: "bg-green-100 border-b-2 border-green-500",
  PERSON: "bg-blue-100 border-b-2 border-blue-500",
  AMOUNT: "bg-orange-100 border-b-2 border-orange-500",
  MEDICAL_TERM: "bg-purple-100 border-b-2 border-purple-500",
};

export function detectEntities(text: string): Entity[] {
  if (!text) return [];

  const entities: Entity[] = [];
  const occupied = new Set<number>(); // prevent overlapping ranges

  const add = (
    match: RegExpExecArray,
    type: string,
    confidence: number,
    context: string
  ) => {
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

  // DATE — MM/DD/YYYY (no ^ or $ anchors so it works inside a sentence)
  const dateRe = /(0?[1-9]|1[0-2])\/\d{1,2}\/(19|20)\d\d/g;
  let m: RegExpExecArray | null;
  while ((m = dateRe.exec(text)) !== null) add(m, "DATE", 0.95, "Date reference");

  // AMOUNT — currency symbol + number
  const amountRe = /(?:\$|€|£)\s?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?/g;
  while ((m = amountRe.exec(text)) !== null) add(m, "AMOUNT", 0.92, "Financial amount");

  // PERSON — two or more consecutive title-case words
  const personRe = /\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)+\b/g;
  while ((m = personRe.exec(text)) !== null) add(m, "PERSON", 0.85, "Person name");

  // MEDICAL_TERM — words ending in common medical suffixes
  const medRe = /\b[a-zA-Z]+(itis|osis|emia|pathy|algia|ectomy|ology|phobia|plasia|genic)\b/g;
  while ((m = medRe.exec(text)) !== null) add(m, "MEDICAL_TERM", 0.85, "Medical term");

  return entities.sort((a, b) => a.start - b.start);
}
