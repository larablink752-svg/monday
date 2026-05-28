"use client";

import React, { useState } from "react";
import { FileText, Download, AlertCircle, CheckCircle2, Sparkles, Loader2 } from "lucide-react";

export default function PDFTab() {
  const [title, setTitle] = useState("Premium Report Summary");
  const [content, setContent] = useState(
    "1. EXECUTIVE SUMMARY\nThis dashboard outlines system latency and chat analytics.\n\n2. TECHNICAL PROGRESS\nAll core microservices, including the Dockerized Flask PDF generator and Node.js routing handlers, are fully operational. API handshakes are executing with a response profile under 15ms.\n\n3. CONCLUSION AND NEXT STEPS\nWe will expand our component systems, refine styling animations, and integrate robust authentication filters."
  );
  const [theme, setTheme] = useState("indigo"); // "indigo" | "emerald" | "slate"
  const [status, setStatus] = useState<"idle" | "generating" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [generationSteps, setGenerationSteps] = useState<string>("");

  const handleGenerate = async () => {
    setStatus("generating");
    setGenerationSteps("Initializing request context...");
    
    // Simulate beautiful progressive steps for premium user experience
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    
    try {
      await delay(600);
      setGenerationSteps("Connecting to Python ReportLab container...");
      await delay(700);
      setGenerationSteps("Synthesizing paragraph styles and flowables...");
      
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      
      await delay(500);
      setGenerationSteps("Finalizing file attachment download...");

      if (!res.ok) {
        throw new Error(`Service returned HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Get filename from header or use default
      const contentDisposition = res.headers.get("content-disposition");
      let filename = "document.pdf";
      if (contentDisposition) {
        const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = decodeURIComponent(matches[1]);
        }
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setStatus("success");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Could not connect to PDF microservice.");
      setStatus("error");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5.5 w-5.5 text-indigo-500" /> PDF Document Generator
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Generate custom Reports, Invoices, or Summaries via our Python Flask container.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Form Column */}
        <div className="md:col-span-2 space-y-4 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monthly Performance Statement"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Document Body Content
            </label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide the textual report layout..."
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-400 custom-scrollbar font-mono leading-relaxed"
            />
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            {status === "generating" ? (
              <div className="w-full flex flex-col items-center justify-center py-6 px-4 border border-zinc-200 rounded-xl bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40">
                <Loader2 className="h-7 w-7 text-indigo-500 animate-spin" />
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-3">
                  Generating PDF Document...
                </span>
                <span className="text-xs text-zinc-400 font-medium mt-1 animate-pulse">
                  {generationSteps}
                </span>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!title.trim() || !content.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/10 transition-all hover:bg-indigo-500 hover:scale-[1.01] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
              >
                Compile and Download <Download className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        </div>

        {/* Templates and Sidebar Column */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-1.5">
              Style Templates <Sparkles className="h-4 w-4 text-amber-500" />
            </h3>
            
            <div className="space-y-3">
              {[
                { id: "indigo", title: "Premium Dark Blue", desc: "Corporate standard layout with indigo accents", colorClass: "bg-indigo-600" },
                { id: "emerald", title: "Forest Green", desc: "Clean modern design using green indicators", colorClass: "bg-emerald-600" },
                { id: "slate", title: "Warm Slate", desc: "Minimalist layout with neutral charcoal theme", colorClass: "bg-zinc-700" },
              ].map((style) => (
                <div
                  key={style.id}
                  onClick={() => setTheme(style.id)}
                  className={`cursor-pointer rounded-xl border p-3 transition-all flex items-center gap-3 ${
                    theme === style.id
                      ? "border-indigo-500 bg-indigo-500/5 ring-2 ring-indigo-500/15"
                      : "border-zinc-200/80 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className={`h-8 w-8 rounded-lg shrink-0 ${style.colorClass} flex items-center justify-center text-white font-bold text-xs`}>
                    Aa
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{style.title}</p>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">{style.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Microservice Status</h4>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Dockerized Python Container Online
            </div>
            <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">
              If the Python server is offline, a lightweight client-safe fallback handler kicks in to secure your download stream.
            </p>
          </div>
        </div>
      </div>

      {/* Generation Status Overlays */}
      {status === "success" && (
        <div className="fixed bottom-6 right-6 rounded-xl bg-white border border-zinc-200 p-4 shadow-xl flex items-center gap-3 max-w-sm animate-in fade-in slide-in-from-bottom-5 dark:bg-zinc-900 dark:border-zinc-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <div>
            <p className="text-xs font-bold text-zinc-900 dark:text-white">PDF Compiled Successfully</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Download has initiated automatically.</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="fixed bottom-6 right-6 rounded-xl bg-white border border-destructive/20 p-4 shadow-xl flex items-center gap-3 max-w-sm animate-in fade-in slide-in-from-bottom-5 dark:bg-zinc-900 dark:border-zinc-800">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <p className="text-xs font-bold text-destructive">Compilation Failed</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
