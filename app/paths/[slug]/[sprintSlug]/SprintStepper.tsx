"use client"

import React from "react"
import { useRouter } from "next/navigation"

interface SprintStepperProps {
    sprintId: string
    pathId: string
    pathSlug: string
    xpReward: number
    lessonContent: string
    mcqQuestion: string
    mcqOptions: string[]
    correctAnswerIndex: number
    nextSprintSlug?: string
    nextSprintTitle?: string
}

const STEPS = [
    { id: 0, label: "Learn", icon: "📖" },
    { id: 1, label: "Challenge", icon: "🎯" },
    { id: 2, label: "Reward", icon: "🏆" },
]

function formatElapsed(ms: number): string {
    const secs = Math.floor(ms / 1000)
    if (secs < 60) return `${secs}s`
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins}m ${rem}s`
}

export default function SprintStepper({
    lessonContent,
    mcqQuestion,
    mcqOptions,
    correctAnswerIndex,
    sprintId,
    pathId,
    pathSlug,
    xpReward,
    nextSprintSlug,
    nextSprintTitle,
}: SprintStepperProps) {
    const router = useRouter()

    const [activeStep, setActiveStep] = React.useState(0)
    const [selectedOption, setSelectedOption] = React.useState<number | null>(null)
    const [submitted, setSubmitted] = React.useState(false)
    const [animating, setAnimating] = React.useState(false)
    const [earnedXP, setEarnedXP] = React.useState(0)
    const [currentStreak, setCurrentStreak] = React.useState<number | null>(null)
    const [elapsedMs, setElapsedMs] = React.useState(0)
    const [showConfetti, setShowConfetti] = React.useState(false)
    const [xpCount, setXpCount] = React.useState(0)
    const [reviewMode, setReviewMode] = React.useState(false)

    // Timer: starts when component mounts
    const startTimeRef = React.useRef<number>(Date.now())

    const isCorrect = submitted && selectedOption === correctAnswerIndex

    // Count-up animation for XP on reward screen
    React.useEffect(() => {
        if (activeStep === 2 && earnedXP > 0) {
            setXpCount(0)
            const step = Math.ceil(earnedXP / 30)
            let count = 0
            const interval = setInterval(() => {
                count = Math.min(count + step, earnedXP)
                setXpCount(count)
                if (count >= earnedXP) clearInterval(interval)
            }, 30)
            return () => clearInterval(interval)
        }
    }, [activeStep, earnedXP])

    const goToStep = (index: number) => {
        if (animating) return
        setAnimating(true)
        setTimeout(() => {
            setActiveStep(index)
            setAnimating(false)
        }, 280)
    }

    const handleNext = () => {
        if (activeStep === 1 && selectedOption === null) return
        if (activeStep < STEPS.length - 1) goToStep(activeStep + 1)
    }

    const handleStepClick = (index: number) => {
        if (index <= activeStep) goToStep(index)
    }

    const handleSubmit = async () => {
        if (selectedOption === null) return

        const correct = selectedOption === correctAnswerIndex
        const elapsed = Date.now() - startTimeRef.current
        setElapsedMs(elapsed)

        if (correct) {
            setEarnedXP(xpReward)
            const res = await fetch("/api/sprint/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sprintId, pathId, xpEarned: xpReward }),
            })
            const data = await res.json()
            if (data.currentStreak !== undefined) setCurrentStreak(data.currentStreak)
            // Trigger confetti after moving to reward step
            setTimeout(() => setShowConfetti(true), 400)
            setTimeout(() => setShowConfetti(false), 3500)
        } else {
            setEarnedXP(0)
        }

        setSubmitted(true)
    }

    const handleRetry = () => {
        setSelectedOption(null)
        setSubmitted(false)
    }

    // Review Lesson: enters read-only review mode — keeps answer state intact
    const handleReviewLesson = () => {
        setReviewMode(true)
        setShowConfetti(false)
        goToStep(0)
    }

    // Next Sprint or Back to Path
    const handleNext2 = () => {
        if (nextSprintSlug) {
            router.push(`/paths/${pathSlug}/${nextSprintSlug}`)
        } else {
            router.push(`/paths/${pathSlug}`)
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 16px",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            position: "relative",
            overflow: "hidden",
        }}>

            {/* ── Confetti ── */}
            {showConfetti && (
                <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999 }}>
                    {Array.from({ length: 48 }).map((_, i) => (
                        <span key={i} style={{
                            position: "absolute",
                            left: `${Math.random() * 100}%`,
                            top: "-10px",
                            fontSize: `${10 + Math.random() * 14}px`,
                            animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-in forwards`,
                            animationDelay: `${Math.random() * 0.8}s`,
                            opacity: 0.9,
                        }}>
                            {["🎊", "⭐", "✨", "🎉", "💫", "🌟"][Math.floor(Math.random() * 6)]}
                        </span>
                    ))}
                </div>
            )}

            {/* ── Stepper Header ── */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                marginBottom: 48,
                width: "100%",
                maxWidth: 560,
            }}>
                {STEPS.map((step, idx) => (
                    <React.Fragment key={step.id}>
                        <div
                            onClick={() => handleStepClick(idx)}
                            title={step.label}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 8,
                                cursor: idx <= activeStep ? "pointer" : "default",
                                zIndex: 1,
                                minWidth: 72,
                            }}
                        >
                            <div style={{
                                width: 52,
                                height: 52,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: idx < activeStep ? 20 : 22,
                                fontWeight: 700,
                                transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
                                boxShadow: activeStep === idx
                                    ? "0 0 0 4px rgba(167,139,250,0.35), 0 8px 24px rgba(139,92,246,0.45)"
                                    : "none",
                                background: activeStep === idx
                                    ? "linear-gradient(135deg, #a78bfa, #7c3aed)"
                                    : idx < activeStep
                                        ? "linear-gradient(135deg, #34d399, #059669)"
                                        : "rgba(255,255,255,0.07)",
                                border: activeStep === idx
                                    ? "2px solid rgba(167,139,250,0.6)"
                                    : idx < activeStep
                                        ? "2px solid rgba(52,211,153,0.4)"
                                        : "2px solid rgba(255,255,255,0.12)",
                                color: "#fff",
                                transform: activeStep === idx ? "scale(1.12)" : "scale(1)",
                            }}>
                                {idx < activeStep ? "✓" : step.icon}
                            </div>
                            <span style={{
                                fontSize: 11,
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: activeStep === idx
                                    ? "#a78bfa"
                                    : idx < activeStep
                                        ? "#34d399"
                                        : "rgba(255,255,255,0.35)",
                                transition: "color 0.3s",
                            }}>
                                {step.label}
                            </span>
                        </div>

                        {idx < STEPS.length - 1 && (
                            <div style={{
                                flex: 1,
                                height: 3,
                                marginBottom: 24,
                                borderRadius: 99,
                                background: idx < activeStep
                                    ? "linear-gradient(90deg, #34d399, #059669)"
                                    : "rgba(255,255,255,0.1)",
                                transition: "background 0.5s ease",
                                position: "relative",
                                overflow: "hidden",
                            }}>
                                {idx < activeStep && (
                                    <div style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                                        animation: "shimmer 2s infinite",
                                    }} />
                                )}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* ── Card ── */}
            <div style={{
                width: "100%",
                maxWidth: 720,
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 24,
                boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
                overflow: "hidden",
                opacity: animating ? 0 : 1,
                transform: animating ? "translateY(12px) scale(0.98)" : "translateY(0) scale(1)",
                transition: "opacity 0.28s ease, transform 0.28s ease",
            }}>

                {/* ─── STEP 0 — Learn ─── */}
                {activeStep === 0 && (
                    <div>
                        <div style={{
                            background: "linear-gradient(135deg, rgba(124,58,237,0.45), rgba(99,102,241,0.25))",
                            borderBottom: "1px solid rgba(255,255,255,0.07)",
                            padding: "28px 36px 24px",
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                        }}>
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
                                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" }}>Learning Content</h2>
                            </div>
                        </div>

                        <div style={{ padding: "32px 36px" }}>
                            <div style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: 14,
                                padding: "24px 28px",
                                color: "rgba(255,255,255,0.82)",
                                fontSize: 15.5,
                                lineHeight: 1.8,
                                whiteSpace: "pre-line",
                                minHeight: 180,
                            }}>
                                {lessonContent}
                            </div>

                            <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
                                <button
                                    onClick={handleNext}
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
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"
                                            ; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 32px rgba(124,58,237,0.6)"
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"
                                            ; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(124,58,237,0.45)"
                                    }}
                                >
                                    {reviewMode ? (
                                        <>View My Answer <span style={{ fontSize: 18 }}>👀</span></>
                                    ) : (
                                        <>Take the Challenge <span style={{ fontSize: 18 }}>🎯</span></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── STEP 1 — MCQ ─── */}
                {activeStep === 1 && (
                    <div>
                        <div style={{
                            background: "linear-gradient(135deg, rgba(251,146,60,0.3), rgba(239,68,68,0.15))",
                            borderBottom: "1px solid rgba(255,255,255,0.07)",
                            padding: "28px 36px 24px",
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                        }}>
                            <div style={{
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                background: "rgba(251,146,60,0.2)",
                                border: "1px solid rgba(251,146,60,0.35)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 22,
                            }}>🎯</div>
                            <div>
                                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fb923c" }}>Knowledge Check</p>
                                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" }}>Quick Challenge</h2>
                            </div>
                        </div>

                        <div style={{ padding: "32px 36px" }}>
                            <div style={{
                                background: "rgba(251,146,60,0.07)",
                                border: "1px solid rgba(251,146,60,0.2)",
                                borderRadius: 14,
                                padding: "20px 24px",
                                marginBottom: 28,
                            }}>
                                <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#fff", lineHeight: 1.55 }}>
                                    {mcqQuestion}
                                </p>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {mcqOptions.map((option, idx) => {
                                    const isSelected = selectedOption === idx
                                    const isRight = submitted && idx === correctAnswerIndex
                                    const isWrong = submitted && isSelected && idx !== correctAnswerIndex

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => !submitted && setSelectedOption(idx)}
                                            style={{
                                                width: "100%",
                                                textAlign: "left",
                                                padding: "16px 20px",
                                                borderRadius: 12,
                                                border: isRight
                                                    ? "1.5px solid #34d399"
                                                    : isWrong
                                                        ? "1.5px solid #f87171"
                                                        : isSelected
                                                            ? "1.5px solid #fb923c"
                                                            : "1.5px solid rgba(255,255,255,0.1)",
                                                background: isRight
                                                    ? "rgba(52,211,153,0.12)"
                                                    : isWrong
                                                        ? "rgba(248,113,113,0.12)"
                                                        : isSelected
                                                            ? "rgba(251,146,60,0.12)"
                                                            : "rgba(255,255,255,0.03)",
                                                color: isRight ? "#34d399" : isWrong ? "#f87171" : isSelected ? "#fb923c" : "rgba(255,255,255,0.75)",
                                                fontSize: 15,
                                                fontWeight: isSelected ? 600 : 400,
                                                cursor: submitted ? "default" : "pointer",
                                                transition: "all 0.2s ease",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                                transform: isSelected && !submitted ? "scale(1.01)" : "scale(1)",
                                            }}
                                        >
                                            <span style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 12,
                                                fontWeight: 700,
                                                flexShrink: 0,
                                                background: isRight ? "rgba(52,211,153,0.25)" : isWrong ? "rgba(248,113,113,0.25)" : isSelected ? "rgba(251,146,60,0.25)" : "rgba(255,255,255,0.08)",
                                                border: isRight ? "1px solid #34d399" : isWrong ? "1px solid #f87171" : isSelected ? "1px solid #fb923c" : "1px solid rgba(255,255,255,0.15)",
                                                color: "inherit",
                                                transition: "all 0.2s",
                                            }}>
                                                {isRight ? "✓" : isWrong ? "✕" : String.fromCharCode(65 + idx)}
                                            </span>
                                            {option}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Result message */}
                            {submitted && (
                                <div style={{
                                    marginTop: 24,
                                    padding: "16px 20px",
                                    borderRadius: 12,
                                    background: isCorrect ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
                                    border: `1px solid ${isCorrect ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
                                    color: isCorrect ? "#34d399" : "#f87171",
                                    fontWeight: 600,
                                    fontSize: 15,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    animation: "slide-in 0.3s ease",
                                }}>
                                    <span style={{ fontSize: 20 }}>{isCorrect ? "🎉" : "💡"}</span>
                                    {isCorrect ? "Brilliant! That's absolutely correct." : "Not quite — review the lesson and try again!"}
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
                                {/* In review mode: only show the Next Sprint / Back to Path button */}
                                {reviewMode ? null : submitted && !isCorrect && (
                                    <button
                                        onClick={handleRetry}
                                        style={{
                                            padding: "13px 26px",
                                            background: "rgba(248,113,113,0.15)",
                                            color: "#f87171",
                                            border: "1.5px solid rgba(248,113,113,0.35)",
                                            borderRadius: 12,
                                            fontSize: 14,
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            letterSpacing: "0.02em",
                                            transition: "transform 0.15s",
                                        }}
                                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"}
                                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"}
                                    >
                                        Try Again
                                    </button>
                                )}
                                {reviewMode ? (
                                    /* Review mode: go straight to next sprint / back to path */
                                    <button
                                        onClick={handleNext2}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            padding: "13px 28px",
                                            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                                            color: "#1a1200",
                                            border: "none",
                                            borderRadius: 12,
                                            fontSize: 15,
                                            fontWeight: 800,
                                            cursor: "pointer",
                                            boxShadow: "0 8px 20px rgba(251,191,36,0.4)",
                                            letterSpacing: "0.03em",
                                            transition: "transform 0.15s, box-shadow 0.15s",
                                        }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"
                                                ; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 28px rgba(251,191,36,0.6)"
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"
                                                ; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 20px rgba(251,191,36,0.4)"
                                        }}
                                    >
                                        {nextSprintSlug ? (
                                            <>Next: {nextSprintTitle} →</>
                                        ) : (
                                            <>🎓 Back to Path</>
                                        )}
                                    </button>
                                ) : !submitted ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={selectedOption === null}
                                        style={{
                                            padding: "13px 28px",
                                            background: selectedOption !== null
                                                ? "linear-gradient(135deg, #f97316, #ef4444)"
                                                : "rgba(255,255,255,0.06)",
                                            color: selectedOption !== null ? "#fff" : "rgba(255,255,255,0.3)",
                                            border: "none",
                                            borderRadius: 12,
                                            fontSize: 15,
                                            fontWeight: 700,
                                            cursor: selectedOption !== null ? "pointer" : "not-allowed",
                                            boxShadow: selectedOption !== null ? "0 8px 20px rgba(239,68,68,0.35)" : "none",
                                            transition: "all 0.2s",
                                            letterSpacing: "0.03em",
                                        }}
                                    >
                                        Submit Answer
                                    </button>
                                ) : isCorrect ? (
                                    <button
                                        onClick={handleNext}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            padding: "13px 28px",
                                            background: "linear-gradient(135deg, #34d399, #059669)",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 12,
                                            fontSize: 15,
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            boxShadow: "0 8px 20px rgba(52,211,153,0.4)",
                                            letterSpacing: "0.03em",
                                            animation: "bounce-in 0.4s cubic-bezier(.36,.07,.19,.97)",
                                        }}
                                    >
                                        Claim Reward
                                        <span style={{ fontSize: 18 }}>🏆</span>
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── STEP 2 — Reward ─── */}
                {activeStep === 2 && (
                    <div style={{ padding: "60px 36px", textAlign: "center" }}>
                        {/* Trophy */}
                        <div style={{ position: "relative", display: "inline-block", marginBottom: 32 }}>
                            <div style={{
                                width: 110,
                                height: 110,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 52,
                                boxShadow: "0 0 60px rgba(251,191,36,0.6), 0 0 120px rgba(251,191,36,0.25)",
                                margin: "0 auto",
                                animation: "trophy-pop 0.5s cubic-bezier(.36,.07,.19,.97) both",
                            }}>
                                🏆
                            </div>
                            {["✦", "✦", "✦"].map((s, i) => (
                                <span key={i} style={{
                                    position: "absolute",
                                    fontSize: 14,
                                    color: "#fbbf24",
                                    top: `${20 + i * 28}%`,
                                    left: i % 2 === 0 ? "-24px" : "auto",
                                    right: i % 2 !== 0 ? "-24px" : "auto",
                                    opacity: 0.7,
                                    animation: `pulse-star 1.${i + 2}s ease-in-out infinite alternate`,
                                }}>{s}</span>
                            ))}
                        </div>

                        <h1 style={{
                            fontSize: 34,
                            fontWeight: 800,
                            margin: "0 0 12px 0",
                            background: "linear-gradient(135deg, #fbbf24, #f59e0b, #fef3c7)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            letterSpacing: "-0.02em",
                            animation: "fade-up 0.4s ease 0.1s both",
                        }}>
                            Sprint Complete!
                        </h1>
                        <p style={{
                            fontSize: 16,
                            color: "rgba(255,255,255,0.55)",
                            margin: "0 0 40px 0",
                            lineHeight: 1.6,
                            animation: "fade-up 0.4s ease 0.2s both",
                        }}>
                            You crushed it! XP has been added to your streak. <br />
                            Keep the momentum going.
                        </p>

                        {/* XP badge — count-up animation */}
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "14px 32px",
                            borderRadius: 99,
                            background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))",
                            border: "1.5px solid rgba(251,191,36,0.3)",
                            marginBottom: 40,
                            animation: "xp-pulse 0.6s ease 0.3s both",
                        }}>
                            <span style={{ fontSize: 22 }}>⚡</span>
                            <span style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24", letterSpacing: "-0.01em" }}>
                                +{earnedXP > 0 ? xpCount : 0} XP
                            </span>
                            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>earned</span>
                        </div>

                        {/* Stats row — Streak and Speed only */}
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 16,
                            marginBottom: 44,
                            flexWrap: "wrap",
                        }}>
                            {[
                                {
                                    emoji: "🔥",
                                    label: "Streak",
                                    value: currentStreak !== null ? `Day ${currentStreak}` : "Day —",
                                },
                                {
                                    emoji: "⏱️",
                                    label: "Speed",
                                    value: elapsedMs > 0 ? formatElapsed(elapsedMs) : "—",
                                },
                            ].map((stat) => (
                                <div key={stat.label} style={{
                                    padding: "16px 24px",
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: 14,
                                    minWidth: 110,
                                    animation: "fade-up 0.4s ease 0.35s both",
                                }}>
                                    <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.emoji}</div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{stat.value}</div>
                                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animation: "fade-up 0.4s ease 0.45s both" }}>
                            {/* Review Lesson — fully resets to step 0 */}
                            <button
                                onClick={handleReviewLesson}
                                style={{
                                    padding: "14px 28px",
                                    background: "rgba(255,255,255,0.06)",
                                    color: "rgba(255,255,255,0.65)",
                                    border: "1.5px solid rgba(255,255,255,0.12)",
                                    borderRadius: 12,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    letterSpacing: "0.02em",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"
                                        ; (e.currentTarget as HTMLButtonElement).style.color = "#fff"
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"
                                        ; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)"
                                }}
                            >
                                📖 Review Lesson
                            </button>

                            {/* Next Sprint with real title, or Back to Path */}
                            <button
                                onClick={handleNext2}
                                style={{
                                    padding: "14px 28px",
                                    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                                    color: "#1a1200",
                                    border: "none",
                                    borderRadius: 12,
                                    fontSize: 15,
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    boxShadow: "0 8px 24px rgba(251,191,36,0.45)",
                                    letterSpacing: "0.02em",
                                    transition: "transform 0.15s, box-shadow 0.15s",
                                    maxWidth: 260,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"
                                        ; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 32px rgba(251,191,36,0.6)"
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"
                                        ; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(251,191,36,0.45)"
                                }}
                            >
                                {nextSprintSlug ? (
                                    <>
                                        <span>Next:</span>
                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {nextSprintTitle}
                                        </span>
                                        <span>→</span>
                                    </>
                                ) : (
                                    <>🎓 Back to Path</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Animations */}
            <style>{`
                @keyframes shimmer {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                @keyframes pulse-star {
                    from { opacity: 0.3; transform: scale(0.8); }
                    to   { opacity: 1;   transform: scale(1.2); }
                }
                @keyframes confetti-fall {
                    0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                @keyframes trophy-pop {
                    0%   { transform: scale(0.4) rotate(-10deg); opacity: 0; }
                    70%  { transform: scale(1.15) rotate(3deg); }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                @keyframes xp-pulse {
                    0%   { transform: scale(0.85); opacity: 0; }
                    60%  { transform: scale(1.06); }
                    100% { transform: scale(1);    opacity: 1; }
                }
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes bounce-in {
                    0%   { transform: scale(0.8); opacity: 0; }
                    60%  { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes slide-in {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}