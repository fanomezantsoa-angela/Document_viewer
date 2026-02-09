 import type { ProcessedDocument } from "@/app/type";
 interface ProcessingScreenProps { 
        documents: ProcessedDocument[]; 
        onCancel: () => void; 
 }
export default function ProcessionDoc({ documents, onCancel }: ProcessingScreenProps) {
   
    
    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">Processing Documents</h2>
            <p className="text-sm text-gray-600"> Uploading your documents. You can cancel, but processing may still complete on the server. </p>
            <div className="space-y-4"> {documents.map(doc => (
                <div key={doc.file.name} className="border rounded p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>{doc.file.name}</span>
                        <span>{doc.status.toUpperCase()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                        <div className="bg-blue-500 h-2 transition-all" style={{ width: `${doc.progress || 10}%` }} />
                    </div>
                    <div className="text-xs text-gray-500"> Estimated time remaining: ~ {Math.max(1, Math.floor((100 - (doc.progress || 10)) / 20))}s
                    </div> 
                     <div className="mt-2 space-y-1">
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                </div>))}
            </div>
            <button
                onClick={onCancel} className="px-4 py-2 bg-red-600 text-white rounded" > Cancel
            </button>
        </div>


    )
}