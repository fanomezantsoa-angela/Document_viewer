type PdfParseResult = {
  text?: string;
};

type PdfParse = (buffer: Buffer) => Promise<PdfParseResult>;

const PDF_PARSE_PACKAGE = "pdf-parse";

export async function extractPdfText(buffer: Buffer, filename: string): Promise<string> {
  const pdfParse = await loadPdfParse();
  const result = await pdfParse(buffer);
  const text = result.text?.trim();

  if (!text) {
    return `[PDF] "${filename}" did not contain selectable text. Use OCR for scanned PDFs.`;
  }

  return text;
}

async function loadPdfParse(): Promise<PdfParse> {
  try {
    const pdfParseModule = await import(PDF_PARSE_PACKAGE);
    const pdfParse = pdfParseModule.default ?? pdfParseModule;

    if (typeof pdfParse !== "function") {
      throw new Error("pdf-parse did not export a parser function");
    }

    return pdfParse as PdfParse;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    throw new Error(
      `PDF text extraction requires ${PDF_PARSE_PACKAGE}. Install it in backend with "npm install pdf-parse". Original error: ${message}`
    );
  }
}
