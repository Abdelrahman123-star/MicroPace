import React, { useMemo } from "react"
import { useRouter } from "next/navigation"

interface LearnStepProps {
    sprintTitle?: string
    xpReward: number
    storyContext?: string
    characters?: string[]
    lessonContent: string
    codeSnippet?: string
    codeLanguage?: string
    reviewMode: boolean
    pathSlug: string
    onNextStep: () => void
    formatContent: (text: string) => React.ReactNode[] | string
    notify: (message: string, type?: "success" | "error" | "info") => void
    showCodePreview?: boolean
}

export default function LearnStep({
    sprintTitle,
    xpReward,
    storyContext,
    characters = [],
    lessonContent,
    codeSnippet,
    codeLanguage,
    reviewMode,
    pathSlug,
    onNextStep,
    formatContent,
    notify,
    showCodePreview = false
}: LearnStepProps) {
    const router = useRouter()

    const previewDoc = useMemo(() => {
        if (!codeSnippet) return "";
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        body { margin: 0; padding: 20px; background: white; color: black; font-family: sans-serif; }
                        * { box-sizing: border-box; }
                    </style>
                </head>
                <body>${codeSnippet}</body>
            </html>
        `;
    }, [codeSnippet]);

    return (
        <div>
            {/* Header ... */}
            <div style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.45), rgba(99,102,241,0.25))",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                padding: "24px 28px 28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                flexWrap: "wrap",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "rgba(167,139,250,0.2)",
                        border: "1px solid rgba(167,139,250,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                    }}>📖</div>
                    <div>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a78bfa" }}>Sprint Lesson</p>
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff" }}>{sprintTitle || "Learning Content"}</h2>
                    </div>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.35)" }}>
                    <span style={{ fontSize: 14 }}>⚡</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24" }}>+{xpReward} XP</span>
                </div>
            </div>

            <div style={{ padding: "32px 36px" }}>
                {/* Story Context */}
                {storyContext && storyContext.trim() && (
                    <div style={{
                        background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.08))",
                        border: "1px solid rgba(245,158,11,0.3)",
                        borderRadius: 16,
                        padding: "24px 28px",
                        marginBottom: 28,
                        position: "relative",
                        overflow: "hidden",
                    }}>
                        <div style={{ position: "absolute", top: 12, right: 16, fontSize: 20, opacity: 0.6 }}>📜</div>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fbbf24", marginBottom: 10 }}>Story</p>
                        <p style={{ margin: 0, color: "rgba(255,255,255,0.92)", fontSize: 16, lineHeight: 1.7, fontStyle: "italic" }}>
                            {storyContext}
                        </p>
                    </div>
                )}

                {/* Lesson Content */}
                <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 14,
                    padding: "24px 28px",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 15.5,
                    lineHeight: 1.8,
                    whiteSpace: "pre-line",
                    minHeight: 120,
                }}>
                    {formatContent(lessonContent)}
                </div>

                {codeSnippet && codeSnippet.trim() && (
                    <div style={{
                        marginTop: 28,
                        display: "flex",
                        flexDirection: showCodePreview ? "row" : "column",
                        gap: 24,
                        alignItems: "stretch"
                    }}>
                        {/* Editor Container */}
                        <div style={{
                            flex: 1,
                            background: "#1e1e1e",
                            borderRadius: 16,
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.1)",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                        }}>
                            <div style={{ background: "#2d2d2d", padding: "12px 20px", borderBottom: "1px solid #404040", display: "flex", alignItems: "center" }}>
                                <div style={{ display: "flex", gap: 6, marginRight: 20 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{codeLanguage || "code"}</span>
                            </div>
                            <div style={{ padding: 24, overflowX: "auto" }}>
                                <pre style={{ margin: 0, color: "#d4d4d4", fontFamily: "monospace", fontSize: 14, lineHeight: 1.6 }}>
                                    <code>{codeSnippet}</code>
                                </pre>
                            </div>
                        </div>

                        {/* Preview Container */}
                        {showCodePreview && (
                            <div style={{
                                flex: 1,
                                background: "#fff",
                                borderRadius: 16,
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.2)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                                display: "flex",
                                flexDirection: "column",
                                minWidth: 350
                            }}>
                                <div style={{ background: "#f8fafc", padding: "12px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", color: "#64748b", fontSize: 11, fontWeight: 800, textTransform: "uppercase" }}>
                                    <span style={{ marginRight: 8 }}>👀</span> Live Preview
                                </div>
                                <div style={{ flex: 1, position: "relative", minHeight: 300 }}>
                                    <iframe
                                        key={codeSnippet}
                                        srcDoc={previewDoc}
                                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                                        title="Live Code Preview"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
                    <button
                        onClick={onNextStep}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "14px 32px",
                            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 12,
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: "pointer",
                            letterSpacing: "0.03em",
                            boxShadow: "0 8px 24px rgba(124,58,237,0.45)",
                            transition: "transform 0.15s, box-shadow 0.15s",
                        }}
                    >
                        {reviewMode ? (
                            <>View Challenge <span style={{ fontSize: 18 }}>👀</span></>
                        ) : (
                            <>Take the Challenge <span style={{ fontSize: 18 }}>🎯</span></>
                        )}
                    </button>
                    {reviewMode && (
                        <button
                            onClick={() => router.push(`/paths/${pathSlug}`)}
                            style={{
                                padding: "14px 28px",
                                background: "rgba(255,255,255,0.06)",
                                color: "rgba(255,255,255,0.65)",
                                border: "1.5px solid rgba(255,255,255,0.12)",
                                borderRadius: 12,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                                marginLeft: 12,
                                transition: "all 0.2s",
                            }}
                        >
                            🎓 Exit to Path
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
