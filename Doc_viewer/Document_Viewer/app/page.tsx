"use client";
import { useRouter } from "next/navigation";
import { useDocumentStore } from "../app/stores/documentStore";

export default function Home() {
  const router = useRouter();
  const setFilePath = useDocumentStore((state) => state.setFilePath);

  const openDemo = (path: string) => {
    setFilePath(path);
    router.push("/viewer");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-semibold tracking-widest text-indigo-600 uppercase mb-4">
            Document Intelligence
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">
            View, extract and protect your documents — all in one place
          </h1>
          <p className="text-slate-500 text-lg mb-8">
            Upload PDF, Word, text or image files. DocViewer detects entities
            (names, dates, amounts, medical terms), lets you redact sensitive
            data, and exports results as structured JSON.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="/Upload"
              className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              Upload a document
            </a>

            {/* Demo links */}
            <button
              onClick={() => openDemo("/Demo.txt")}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              Text demo
            </button>
            <button
              onClick={() => openDemo("/demo_image.png")}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              Image demo
            </button>
            <button
              onClick={() => openDemo("/demo.md")}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              Markdown demo
            </button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: "🔍",
              title: "Entity detection",
              desc: "Automatically highlights names, dates, amounts and medical terms.",
            },
            {
              icon: "🔒",
              title: "Privacy modes",
              desc: "Switch between Full, Redacted and Summary views instantly.",
            },
            {
              icon: "📄",
              title: "Multi-format",
              desc: "PDF, DOCX, TXT, Markdown and images (OCR).",
            },
            {
              icon: "📊",
              title: "Analytics",
              desc: "Track processing metrics in the built-in dashboard.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-slate-800 mb-1">{f.title}</h3>
              <p className="text-slate-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
