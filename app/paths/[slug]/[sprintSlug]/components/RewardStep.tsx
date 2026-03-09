import React from "react"
import { useRouter } from "next/navigation"

interface RewardStepProps {
    completionStory?: string
    earnedXP: number
    xpCount: number
    currentStreak: number | null
    elapsedMs: number
    formatElapsed: (ms: number) => string
    isStreakNew?: boolean
    oldStreak?: number
    nextSprintSlug?: string
    nextSprintTitle?: string
    pathSlug: string
    handleNext2: () => void
}

export default function RewardStep({
    completionStory,
    earnedXP,
    xpCount,
    currentStreak,
    elapsedMs,
    formatElapsed,
    isStreakNew,
    oldStreak,
    nextSprintSlug,
    nextSprintTitle,
    pathSlug,
    handleNext2
}: RewardStepProps) {
    const router = useRouter()

    return (
        <div style={{ padding: "48px 36px 60px", textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 28 }}>
                <div style={{
                    width: 110, height: 110, borderRadius: "50%",
                    background: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 52, boxShadow: "0 0 60px rgba(251,191,36,0.6)",
                    margin: "0 auto", animation: "trophy-pop 0.5s cubic-bezier(.36,.07,.19,.97) both"
                }}>🏆</div>
            </div>

            <h1 style={{ fontSize: 34, fontWeight: 800, margin: "0 0 12px 0", background: "linear-gradient(135deg, #fbbf24, #f59e0b, #fef3c7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "fade-up 0.4s ease 0.1s both" }}>
                Sprint Complete!
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", margin: "0 0 28px 0", lineHeight: 1.6, animation: "fade-up 0.4s ease 0.2s both" }}>
                You crushed it! All questions answered perfectly.<br />XP has been added to your streak.
            </p>

            {completionStory && completionStory.trim() && (
                <div style={{
                    maxWidth: 520, margin: "0 auto 32px",
                    background: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(5,150,105,0.06))",
                    border: "1px solid rgba(34,197,94,0.35)",
                    borderRadius: 16,
                    padding: "20px 24px",
                    textAlign: "left",
                    animation: "fade-up 0.5s ease 0.25s both",
                }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#34d399", marginBottom: 8 }}>✨ Story</p>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.9)", fontSize: 15, lineHeight: 1.65, fontStyle: "italic" }}>{completionStory}</p>
                </div>
            )}

            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px", borderRadius: 99, background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.1))", border: "2px solid rgba(251,191,36,0.4)", marginBottom: 36, animation: "xp-pulse 0.6s ease 0.3s both", boxShadow: "0 8px 32px rgba(251,191,36,0.2)" }}>
                <span style={{ fontSize: 24, animation: "xp-glow 1.5s ease-in-out infinite" }}>⚡</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#fbbf24" }}>+{earnedXP > 0 ? xpCount : 0} XP</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>earned</span>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 44, flexWrap: "wrap" }}>
                {[
                    { emoji: "🔥", label: "Streak", value: currentStreak !== null ? `Day ${currentStreak}` : "Day —" },
                    { emoji: "⏱️", label: "Speed", value: elapsedMs > 0 ? formatElapsed(elapsedMs) : "—" },
                ].map((stat) => (
                    <div key={stat.label} style={{ padding: "16px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, minWidth: 110, animation: "fade-up 0.4s ease 0.35s both", overflow: "hidden" }}>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.emoji}</div>
                        <div style={{ position: "relative", height: 24, marginBottom: 2 }}>
                            {stat.label === "Streak" && isStreakNew ? (
                                <>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.4)", position: "absolute", width: "100%", animation: "streak-exit 0.6s cubic-bezier(.4,0,.2,1) forwards" }}>Day {oldStreak}</div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", position: "absolute", width: "100%", animation: "streak-enter 0.6s cubic-bezier(.4,0,.2,1) 0.1s both" }}>Day {currentStreak}</div>
                                </>
                            ) : (
                                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{stat.value}</div>
                            )}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {nextSprintSlug && nextSprintTitle && (
                <div style={{
                    background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(99,102,241,0.06))",
                    border: "1px solid rgba(167,139,250,0.3)",
                    borderRadius: 16,
                    padding: "20px 24px",
                    marginBottom: 32,
                    maxWidth: 400,
                    margin: "0 auto",
                    textAlign: "left",
                    animation: "fade-up 0.4s ease 0.4s both",
                }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a78bfa", marginBottom: 6 }}>Next Episode</p>
                    <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff" }}>{nextSprintTitle}</p>
                    <p style={{ margin: "8px 0 0", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Continue your journey →</p>
                </div>
            )}

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animation: "fade-up 0.4s ease 0.45s both" }}>
                <button onClick={() => router.push(`/paths/${pathSlug}`)} style={{ padding: "14px 28px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                    🎓 Return to Path
                </button>
                <button onClick={handleNext2} style={{ padding: "14px 28px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a1200", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 24px rgba(251,191,36,0.45)", maxWidth: 260, display: "flex", alignItems: "center", gap: 8 }}>
                    {nextSprintSlug ? (<><span>Next:</span><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nextSprintTitle}</span><span>→</span></>) : (<>🎓 Back to Path</>)}
                </button>
            </div>
        </div>
    )
}
