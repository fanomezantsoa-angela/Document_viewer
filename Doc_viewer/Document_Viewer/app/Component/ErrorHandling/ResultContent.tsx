import type { ProcessedDocument, Sector } from "@/app/type";
import DocumentViewer from "@/app/Viewer/DocumentViewer";
interface ResultsScreenProps {
    documents: ProcessedDocument[];
    sector: Sector;
    onProcessAnother: () => void;
}

export default function ResultContent({ documents, sector, onProcessAnother }: ResultsScreenProps) {

    const downloadJson = (doc: ProcessedDocument) => {
        const DocData = {
            document_id: doc.documentId,
            sector,
            
            confidence_score: doc.confidenceScore,
            extracted_text: doc.extractedText,
        };
        const blob = new Blob([JSON.stringify(DocData, null, 2)], { type: "application/json", });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${doc.file.name}.results.json`; a.click();
        URL.revokeObjectURL(url);
    };
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Results</h2>
                <button onClick={onProcessAnother} className="px-4 py-2 bg-gray-800 text-white rounded" >
                    Process Another </button>
            </div>
            {documents.map(doc => (
                <div key={doc.file.name} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="font-medium">
                                {doc.file.name}
                            </div>
                            <div className="text-xs text-gray-500">
                                Status: {doc.status.toUpperCase()} · Sector: {sector}
                            </div>
                        </div>
                        {doc.status === "completed" && (<button onClick={() => downloadJson(doc)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded" > Download JSON </button>)}
                    </div>
                     {doc.status === "failed" && (<div className="text-sm text-red-600"> Error: {doc.error || "Unknown error"} </div>)}
                    {doc.status === "completed" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border rounded p-3">
                                <h3 className="font-medium mb-2">Document View</h3>
                                <DocumentViewer file={doc.file} />
                            </div>
                            <div className="border rounded p-3 space-y-3"> <div>
                                <h3 className="font-medium mb-1">Extracted Text</h3>
                                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded max-h-64 overflow-auto"> {doc.extractedText} </pre>
                            </div>
                                <div> <h3 className="font-medium mb-1"> Confidence:{" "} {(doc.confidenceScore ?? 0).toFixed(2)} </h3>
                                 
                                </div>
                            </div> 
                            </div>)
                    }
                </div>
            ))}
        </div>);

}