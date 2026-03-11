"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, HelpCircle, Eye, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

interface ITestCase {
    name: string;
    code: string;
}

interface CodeChallengeEditorProps {
    instructions?: string;
    initialHtml?: string;
    initialCss?: string;
    initialJs?: string;
    solutionHtml?: string;
    solutionCss?: string;
    solutionJs?: string;
    replicaHtml?: string;
    replicaCss?: string;
    replicaJs?: string;
    hint?: string;
    onComplete: () => void;
    notify: (message: string, type?: "success" | "error" | "info") => void;
    setShowConfirm: (val: { message: string, onConfirm: () => void } | null) => void;
}

export default function CodeChallengeEditor({
    instructions = "",
    initialHtml = "",
    initialCss = "",
    initialJs = "",
    solutionHtml = "",
    solutionCss = "",
    solutionJs = "",
    replicaHtml = "",
    replicaCss = "",
    replicaJs = "",
    hint = "",
    onComplete,
    notify,
    setShowConfirm
}: CodeChallengeEditorProps) {
    const [html, setHtml] = useState(initialHtml);
    const [css, setCss] = useState(initialCss);
    const [js, setJs] = useState(initialJs);
    const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [replicaUrl, setReplicaUrl] = useState<string>("");
    const [showHint, setShowHint] = useState(false);
    const [showSolutionCode, setShowSolutionCode] = useState(false);
    const [solutionTab, setSolutionTab] = useState<"html" | "css" | "js">("html");

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Live Preview Logic
    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            updatePreview();
        }, 500);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [html, css, js]);

    // Replica Preview Logic
    useEffect(() => {
        if (!replicaHtml && !replicaCss && !replicaJs) return;

        const combinedCode = `
            <!DOCTYPE html>
            <html>
                <head><style>${replicaCss || ""}</style></head>
                <body>
                    ${replicaHtml || ""}
                    <script>${replicaJs || ""}<\/script>
                </body>
            </html>
        `;
        const blob = new Blob([combinedCode], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        setReplicaUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [replicaHtml, replicaCss, replicaJs]);

    const updatePreview = () => {
        const combinedCode = `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                    <script>
                        try {
                            ${js}
                        } catch (err) {
                            console.error(err);
                        }
                    </script>
                </body>
            </html>
        `;

        const blob = new Blob([combinedCode], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
    };

    const handlePreviewInNewTab = () => {
        const combinedCode = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Sprint Preview</title>
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                    <script>${js}</script>
                </body>
            </html>
        `;
        const blob = new Blob([combinedCode], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
    };

    const handleShowAnswer = () => {
        if (replicaHtml || replicaCss || solutionHtml || solutionCss || solutionJs) {
            setShowSolutionCode(!showSolutionCode);
        } else {
            setShowConfirm({
                message: "Are you sure? This will replace your code with the solution.",
                onConfirm: () => {
                    setHtml(solutionHtml || initialHtml);
                    setCss(solutionCss || initialCss);
                    setJs(solutionJs || initialJs);
                    notify("Solution applied!", "info");
                }
            });
        }
    };

    const handleReset = () => {
        setShowConfirm({
            message: "Reset to initial code?",
            onConfirm: () => {
                setHtml(initialHtml);
                setCss(initialCss);
                setJs(initialJs);
                notify("Code reset!", "info");
            }
        });
    };

    return (
        <div className="flex flex-col gap-0 w-full mx-auto px-0">
            {instructions && (
                <div className="bg-[#1e293b] border-b border-white/10 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-[hsl(217,91%,60%)]/20 p-2 rounded-lg text-[hsl(217,91%,60%)]">
                            <HelpCircle size={18} />
                        </div>
                        <h3 className="font-bold text-lg text-white">Instructions</h3>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed max-w-4xl whitespace-pre-wrap">{instructions}</p>
                </div>
            )}
            <div className="flex flex-col lg:flex-row gap-0 h-[85vh] border-y border-white/10">
                {/* Editor Section */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e] border-r border-white/10 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5">
                        <div className="flex gap-2 text-xs font-bold uppercase tracking-wider">
                            <button
                                onClick={() => setActiveTab("html")}
                                className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === "html" ? "bg-[#1e1e1e] text-orange-400" : "text-white/40 hover:text-white/60"}`}
                            >
                                HTML
                            </button>
                            <button
                                onClick={() => setActiveTab("css")}
                                className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === "css" ? "bg-[#1e1e1e] text-blue-400" : "text-white/40 hover:text-white/60"}`}
                            >
                                CSS
                            </button>
                            <button
                                onClick={() => setActiveTab("js")}
                                className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === "js" ? "bg-[#1e1e1e] text-yellow-400" : "text-white/40 hover:text-white/60"}`}
                            >
                                JS
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleReset} title="Reset" className="p-1.5 text-white/40 hover:text-white/80 transition-colors">
                                <RotateCcw size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        {activeTab === "html" && (
                            <textarea
                                value={html}
                                onChange={(e) => setHtml(e.target.value)}
                                className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-6 font-mono text-sm focus:outline-none resize-none"
                                spellCheck={false}
                            />
                        )}
                        {activeTab === "css" && (
                            <textarea
                                value={css}
                                onChange={(e) => setCss(e.target.value)}
                                className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-6 font-mono text-sm focus:outline-none resize-none"
                                spellCheck={false}
                            />
                        )}
                        {activeTab === "js" && (
                            <textarea
                                value={js}
                                onChange={(e) => setJs(e.target.value)}
                                className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-6 font-mono text-sm focus:outline-none resize-none"
                                spellCheck={false}
                            />
                        )}
                    </div>

                    <div className="p-4 bg-[#252526] border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors"
                            >
                                <HelpCircle size={16} className="text-amber-400" /> Hint
                            </button>
                            <button
                                onClick={handleShowAnswer}
                                className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors"
                            >
                                <Eye size={16} className="text-blue-400" /> Show Answer
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePreviewInNewTab}
                                className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
                            >
                                <Eye size={16} className="text-emerald-400" /> Preview in New Tab
                            </button>
                            <button
                                onClick={onComplete}
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-xl transition-all active:scale-95"
                            >
                                <CheckCircle2 size={16} /> I'm Done
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Section(s) */}
                <div className={`flex-1 flex ${replicaUrl ? "flex-col" : ""} bg-white overflow-hidden`}>
                    {/* Replica Target (Only if in replica mode) */}
                    {replicaUrl && (
                        <div className="flex-1 flex flex-col border-b border-slate-200">
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-100/80 border-b border-slate-200">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Eye size={12} className="text-blue-500" /> Target Layout (Recreate This)
                                </span>
                            </div>
                            <iframe
                                src={replicaUrl}
                                className="w-full flex-1 bg-white"
                                title="replica"
                            />
                        </div>
                    )}

                    {/* Live User Preview */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between px-4 py-2 bg-emerald-50 border-b border-emerald-100">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                <Play size={12} /> Your Live Result
                            </span>
                        </div>
                        <iframe
                            ref={iframeRef}
                            src={previewUrl || undefined}
                            className="w-full flex-1 bg-white"
                            title="preview"
                        />
                    </div>
                </div>
            </div>

            {showHint && hint && (
                <div className="bg-amber-400/10 border border-amber-400/20 p-4 rounded-xl flex gap-3 animate-in fade-in slide-in-from-bottom-2 mx-4 my-2">
                    <HelpCircle size={20} className="text-amber-400 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Hint</p>
                        <p className="text-sm text-amber-100/90 leading-relaxed font-medium">{hint}</p>
                    </div>
                </div>
            )}

            {showSolutionCode && (replicaHtml || replicaCss || solutionHtml || solutionCss || solutionJs) && (
                <div className="bg-blue-400/10 border border-blue-400/20 p-4 rounded-xl flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 mx-4 my-2">
                    <div className="flex items-center justify-between border-b border-blue-400/20 pb-2">
                        <div className="flex items-center gap-2">
                            <Eye size={18} className="text-blue-400" />
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Solution / Reference Code</p>
                        </div>
                        <div className="flex gap-2">
                            {(replicaHtml || solutionHtml) && (
                                <button
                                    onClick={() => setSolutionTab("html")}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${solutionTab === "html" ? "bg-blue-500 text-white" : "bg-white/5 text-blue-400 hover:bg-white/10"}`}
                                >
                                    HTML
                                </button>
                            )}
                            {(replicaCss || solutionCss) && (
                                <button
                                    onClick={() => setSolutionTab("css")}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${solutionTab === "css" ? "bg-blue-500 text-white" : "bg-white/5 text-blue-400 hover:bg-white/10"}`}
                                >
                                    CSS
                                </button>
                            )}
                            {(replicaJs || solutionJs) && (
                                <button
                                    onClick={() => setSolutionTab("js")}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${solutionTab === "js" ? "bg-blue-500 text-white" : "bg-white/5 text-blue-400 hover:bg-white/10"}`}
                                >
                                    JS
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {solutionTab === "html" && (replicaHtml || solutionHtml) && (
                            <div className="space-y-1">
                                <pre className="bg-[#1e1e1e] p-3 rounded-lg text-xs font-mono text-blue-100 overflow-x-auto border border-blue-400/10 whitespace-pre-wrap max-h-[200px] overflow-y-auto custom-scrollbar">
                                    {replicaHtml || solutionHtml}
                                </pre>
                            </div>
                        )}
                        {solutionTab === "css" && (replicaCss || solutionCss) && (
                            <div className="space-y-1">
                                <pre className="bg-[#1e1e1e] p-3 rounded-lg text-xs font-mono text-blue-100 overflow-x-auto border border-blue-400/10 whitespace-pre-wrap max-h-[200px] overflow-y-auto custom-scrollbar">
                                    {replicaCss || solutionCss}
                                </pre>
                            </div>
                        )}
                        {solutionTab === "js" && (replicaJs || solutionJs) && (
                            <div className="space-y-1">
                                <pre className="bg-[#1e1e1e] p-3 rounded-lg text-xs font-mono text-blue-100 overflow-x-auto border border-blue-400/10 whitespace-pre-wrap max-h-[200px] overflow-y-auto custom-scrollbar">
                                    {replicaJs || solutionJs}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
