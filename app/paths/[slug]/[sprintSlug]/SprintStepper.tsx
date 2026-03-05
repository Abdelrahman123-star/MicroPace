"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

export interface IQuestion {
    type: "mcq" | "fill_in_blanks" | "ordering"
    question: string
    options?: string[]
    correctAnswerIndex?: number
    blanks?: string[]
    draggables?: string[]
    itemsToOrder?: string[]
}

interface SprintStepperProps {
    sprintId: string
    pathId: string
    pathSlug: string
    xpReward: number
    lessonContent: string
    codeSnippet?: string
    codeLanguage?: string
    questions: IQuestion[]
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

function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function SprintStepper({
    lessonContent,
    codeSnippet,
    codeLanguage,
    questions,
    sprintId,
    pathId,
    pathSlug,
    xpReward,
    nextSprintSlug,
    nextSprintTitle,
}: SprintStepperProps) {
    const router = useRouter()

    const [activeStep, setActiveStep] = useState(0)
    const [animating, setAnimating] = useState(false)
    const [earnedXP, setEarnedXP] = useState(0)
    const [currentStreak, setCurrentStreak] = useState<number | null>(null)
    const [oldStreak, setOldStreak] = useState<number | null>(null)
    const [isStreakNew, setIsStreakNew] = useState(false)
    const [elapsedMs, setElapsedMs] = useState(0)
    const [showConfetti, setShowConfetti] = useState(false)
    const [xpCount, setXpCount] = useState(0)
    const [reviewMode, setReviewMode] = useState(false)

    // Questions State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)

    // MCQ State
    const [mcqSelection, setMcqSelection] = useState<number | null>(null)

    // Fill in Blanks State
    const [fibAnswers, setFibAnswers] = useState<string[]>([])

    // Ordering State
    const [orderingState, setOrderingState] = useState<string[]>([])

    // Timer: starts when component mounts
    const startTimeRef = useRef<number>(Date.now())

    const currentQ = questions?.[currentQuestionIndex]

    // Initialize Question State
    useEffect(() => {
        if (!currentQ) return;
        setSubmitted(false);
        setIsCorrect(false);
        if (currentQ.type === "mcq") {
            setMcqSelection(null);
        } else if (currentQ.type === "fill_in_blanks") {
            setFibAnswers(new Array(currentQ.blanks?.length || 0).fill(""));
        } else if (currentQ.type === "ordering") {
            setOrderingState(shuffleArray(currentQ.itemsToOrder || []));
        }
    }, [currentQuestionIndex, currentQ]);


    // Count-up animation for XP on reward screen
    useEffect(() => {
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

    const handleNextStep = () => {
        if (activeStep < STEPS.length - 1) goToStep(activeStep + 1)
    }

    const checkAnswer = () => {
        if (!currentQ) return false;
        if (currentQ.type === "mcq") {
            return mcqSelection === currentQ.correctAnswerIndex;
        } else if (currentQ.type === "fill_in_blanks") {
            return JSON.stringify(fibAnswers) === JSON.stringify(currentQ.blanks);
        } else if (currentQ.type === "ordering") {
            return JSON.stringify(orderingState) === JSON.stringify(currentQ.itemsToOrder);
        }
        return false;
    }

    const handleSubmit = async () => {
        const correct = checkAnswer()
        setIsCorrect(correct)
        setSubmitted(true)

        if (correct && currentQuestionIndex === questions.length - 1) {
            // Finished all questions!
            const elapsed = Date.now() - startTimeRef.current
            setElapsedMs(elapsed)
            setEarnedXP(xpReward)

            try {
                const res = await fetch("/api/sprint/progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sprintId, pathId, xpEarned: xpReward }),
                })
                const data = await res.json()
                if (data.currentStreak !== undefined) {
                    if (currentStreak !== null && data.currentStreak > currentStreak) {
                        setOldStreak(currentStreak)
                        setIsStreakNew(true)
                    }
                    setCurrentStreak(data.currentStreak)
                }
            } catch (e) {
                console.error("Failed to update progress", e);
            }
            // Trigger confetti after moving to reward step
            setTimeout(() => setShowConfetti(true), 400)
            setTimeout(() => setShowConfetti(false), 3500)
        } else if (!correct) {
            // failed, don't update XP yet
        }
    }

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleNextStep();
        }
    }

    const handleRetry = () => {
        setSubmitted(false)
        setIsCorrect(false)
        if (currentQ?.type === "mcq") setMcqSelection(null);
        if (currentQ?.type === "fill_in_blanks") setFibAnswers(new Array(currentQ.blanks?.length || 0).fill(""));
        if (currentQ?.type === "ordering") setOrderingState(shuffleArray(currentQ.itemsToOrder || []));
    }

    const handleReviewLesson = () => {
        setReviewMode(true)
        setShowConfetti(false)
        goToStep(0)
    }

    const handleNext2 = () => {
        if (nextSprintSlug) {
            router.push(`/paths/${pathSlug}/${nextSprintSlug}`)
        } else {
            router.push(`/paths/${pathSlug}`)
        }
    }

    // --- Fill in Blanks Drag & Drop Helpers ---
    const handleFibDrop = (index: number, word: string) => {
        if (submitted) return;
        const newAnswers = [...fibAnswers];
        // If word is already in another blank, remove it from there (so it "moves")
        const existingIndex = newAnswers.indexOf(word);
        if (existingIndex !== -1) {
            newAnswers[existingIndex] = "";
        }
        newAnswers[index] = word;
        setFibAnswers(newAnswers);
    }
    const removeFibAnswer = (index: number) => {
        if (submitted) return;
        const newAnswers = [...fibAnswers];
        newAnswers[index] = "";
        setFibAnswers(newAnswers);
    }

    // --- Ordering Drag & Drop Helpers ---
    const handleOrderDrop = (toIndex: number, draggedItemIndexStr: string) => {
        if (submitted) return;
        const fromIndex = parseInt(draggedItemIndexStr, 10);
        if (isNaN(fromIndex) || fromIndex === toIndex) return;

        const newOrder = [...orderingState];
        const [movedItem] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, movedItem);
        setOrderingState(newOrder);
    }


    const renderFibSentence = () => {
        if (!currentQ || currentQ.type !== "fill_in_blanks") return null;
        const parts = currentQ.question.split("{{blank}}");

        return (
            <div style={{ lineHeight: 2.2, fontSize: 17, color: "#fff", fontWeight: 500 }}>
                {parts.map((part, i) => (
                    <React.Fragment key={i}>
                        <span>{part}</span>
                        {i < parts.length - 1 && (
                            <span
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const word = e.dataTransfer.getData("text/plain");
                                    if (word) handleFibDrop(i, word);
                                }}
                                onClick={() => removeFibAnswer(i)}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: 80,
                                    height: 32,
                                    margin: "0 6px",
                                    padding: "0 12px",
                                    background: fibAnswers[i] ? "linear-gradient(135deg, #a78bfa, #7c3aed)" : "rgba(255,255,255,0.08)",
                                    border: fibAnswers[i] ? "none" : "1.5px dashed rgba(255,255,255,0.3)",
                                    borderRadius: 6,
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: 15,
                                    verticalAlign: "middle",
                                    cursor: (fibAnswers[i] && !submitted) ? "pointer" : "default",
                                    transition: "all 0.2s"
                                }}
                            >
                                {fibAnswers[i] || ""}
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        )
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
                            onClick={() => { if (idx <= activeStep) goToStep(idx) }}
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

            <div style={{
                width: "100%",
                maxWidth: 760,
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

                {/* STEP 0 - Learn */}
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
                                color: "rgba(255,255,255,0.85)",
                                fontSize: 15.5,
                                lineHeight: 1.8,
                                whiteSpace: "pre-line",
                                minHeight: 180,
                            }}>
                                {lessonContent}
                            </div>

                            {codeSnippet && (
                                <div style={{
                                    marginTop: 24,
                                    background: "#1e1e1e",
                                    borderRadius: 12,
                                    overflow: "hidden",
                                    boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
                                    border: "1px solid rgba(255,255,255,0.1)"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "12px 16px",
                                        background: "#2d2d2d",
                                        borderBottom: "1px solid #404040"
                                    }}>
                                        <div style={{ display: "flex", gap: 6, width: 60 }}>
                                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }}></div>
                                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }}></div>
                                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }}></div>
                                        </div>
                                        <div style={{ flex: 1, textAlign: "center", color: "#999", fontSize: 12, fontFamily: "monospace", letterSpacing: "0.05em" }}>
                                            {codeLanguage || "terminal"}
                                        </div>
                                        <div style={{ width: 60 }}></div>
                                    </div>
                                    <div style={{ padding: 20, overflowX: "auto" }}>
                                        <pre style={{ margin: 0, color: "#d4d4d4", fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: 14, lineHeight: 1.6 }}><code>{codeSnippet}</code></pre>
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
                                <button
                                    onClick={handleNextStep}
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
                                        <>View My Answer <span style={{ fontSize: 18 }}>👀</span></>
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
                )}

                {/* STEP 1 - Challenge (Multiple questions supported) */}
                {activeStep === 1 && currentQ && (
                    <div>
                        <div style={{
                            background: "linear-gradient(135deg, rgba(251,146,60,0.3), rgba(239,68,68,0.15))",
                            borderBottom: "1px solid rgba(255,255,255,0.07)",
                            padding: "24px 36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 14,
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
                                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" }}>Challenge {currentQuestionIndex + 1} of {questions.length}</h2>
                                </div>
                            </div>

                            {/* Progress Dots */}
                            <div style={{ display: "flex", gap: 6 }}>
                                {questions.map((_, i) => (
                                    <div key={i} style={{
                                        width: 8, height: 8, borderRadius: "50%",
                                        background: i === currentQuestionIndex ? "#fb923c" : i < currentQuestionIndex ? "rgba(52,211,153,0.8)" : "rgba(255,255,255,0.1)"
                                    }}></div>
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: "32px 36px" }}>
                            {currentQ.type !== "fill_in_blanks" && (
                                <div style={{
                                    background: "rgba(251,146,60,0.07)",
                                    border: "1px solid rgba(251,146,60,0.2)",
                                    borderRadius: 14,
                                    padding: "20px 24px",
                                    marginBottom: 28,
                                }}>
                                    <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#fff", lineHeight: 1.55 }}>
                                        {currentQ.question}
                                    </p>
                                </div>
                            )}

                            {/* --- MCQ UI --- */}
                            {currentQ.type === "mcq" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    {currentQ.options?.map((option, idx) => {
                                        const isSelected = mcqSelection === idx
                                        const isRight = submitted && idx === currentQ.correctAnswerIndex
                                        const isWrong = submitted && isSelected && idx !== currentQ.correctAnswerIndex

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => !submitted && setMcqSelection(idx)}
                                                style={{
                                                    width: "100%",
                                                    textAlign: "left",
                                                    padding: "16px 20px",
                                                    borderRadius: 12,
                                                    border: isRight ? "1.5px solid #34d399" : isWrong ? "1.5px solid #f87171" : isSelected ? "1.5px solid #fb923c" : "1.5px solid rgba(255,255,255,0.1)",
                                                    background: isRight ? "rgba(52,211,153,0.12)" : isWrong ? "rgba(248,113,113,0.12)" : isSelected ? "rgba(251,146,60,0.12)" : "rgba(255,255,255,0.03)",
                                                    color: isRight ? "#34d399" : isWrong ? "#f87171" : isSelected ? "#fb923c" : "rgba(255,255,255,0.75)",
                                                    fontSize: 15,
                                                    fontWeight: isSelected ? 600 : 400,
                                                    cursor: submitted ? "default" : "pointer",
                                                    transition: "all 0.2s ease",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 12,
                                                }}
                                            >
                                                <span style={{
                                                    width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                                                    background: isRight ? "rgba(52,211,153,0.25)" : isWrong ? "rgba(248,113,113,0.25)" : isSelected ? "rgba(251,146,60,0.25)" : "rgba(255,255,255,0.08)",
                                                }}>
                                                    {isRight ? "✓" : isWrong ? "✕" : String.fromCharCode(65 + idx)}
                                                </span>
                                                {option}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}

                            {/* --- Fill in the Blanks UI --- */}
                            {currentQ.type === "fill_in_blanks" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                    <div style={{
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 14,
                                        padding: "24px",
                                    }}>
                                        {renderFibSentence()}
                                    </div>

                                    {!submitted && (
                                        <div>
                                            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 12 }}>Word Pool (Drag & Drop)</p>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                                {currentQ.draggables?.map((word, idx) => {
                                                    const isUsed = fibAnswers.includes(word);
                                                    if (isUsed) return null; // hide used words
                                                    return (
                                                        <div
                                                            key={idx}
                                                            draggable
                                                            onDragStart={(e) => {
                                                                e.dataTransfer.setData("text/plain", word);
                                                            }}
                                                            style={{
                                                                padding: "8px 16px",
                                                                background: "rgba(255,255,255,0.1)",
                                                                border: "1px solid rgba(255,255,255,0.2)",
                                                                borderRadius: 8,
                                                                color: "#fff",
                                                                fontWeight: 600,
                                                                cursor: "grab",
                                                                userSelect: "none"
                                                            }}
                                                        >
                                                            {word}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- Ordering UI --- */}
                            {currentQ.type === "ordering" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Drag and drop to rearrange into the correct order.</p>
                                    {orderingState.map((item, idx) => {
                                        return (
                                            <div
                                                key={item}
                                                draggable={!submitted}
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData("text/plain", idx.toString());
                                                }}
                                                onDragOver={(e) => { e.preventDefault() }}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    const draggedIdxStr = e.dataTransfer.getData("text/plain");
                                                    handleOrderDrop(idx, draggedIdxStr);
                                                }}
                                                style={{
                                                    padding: "16px",
                                                    background: "rgba(255,255,255,0.05)",
                                                    border: submitted ? (isCorrect ? "1px solid rgba(52,211,153,0.5)" : "1px solid rgba(248,113,113,0.5)") : "1px solid rgba(255,255,255,0.15)",
                                                    borderRadius: 12,
                                                    color: "#fff",
                                                    fontWeight: 600,
                                                    fontSize: 15,
                                                    fontFamily: "monospace",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 12,
                                                    cursor: submitted ? "default" : "grab",
                                                    transition: "transform 0.2s"
                                                }}
                                            >
                                                <div style={{ color: "rgba(255,255,255,0.3)" }}>⠿</div>
                                                {item}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

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
                                    {isCorrect ? "Correct answer!" : "Not quite — try again!"}
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
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
                                        }}
                                    >
                                        Try Again
                                    </button>
                                )}
                                {reviewMode ? (
                                    <div style={{ display: "flex", gap: 12 }}>
                                        <button onClick={() => router.push(`/paths/${pathSlug}`)} style={{ padding: "13px 26px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                                            🎓 Exit to Path
                                        </button>
                                        <button onClick={handleNext2} style={{ padding: "13px 28px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a1200", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
                                            {nextSprintSlug ? `Next: ${nextSprintTitle} →` : "🎓 Back to Path"}
                                        </button>
                                    </div>
                                ) : !submitted ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={
                                            (currentQ.type === "mcq" && mcqSelection === null) ||
                                            (currentQ.type === "fill_in_blanks" && fibAnswers.some(a => !a))
                                        }
                                        style={{
                                            padding: "13px 28px",
                                            background: ((currentQ.type === "mcq" && mcqSelection !== null) || (currentQ.type === "fill_in_blanks" && !fibAnswers.some(a => !a)) || currentQ.type === "ordering")
                                                ? "linear-gradient(135deg, #f97316, #ef4444)"
                                                : "rgba(255,255,255,0.06)",
                                            color: ((currentQ.type === "mcq" && mcqSelection !== null) || (currentQ.type === "fill_in_blanks" && !fibAnswers.some(a => !a)) || currentQ.type === "ordering") ? "#fff" : "rgba(255,255,255,0.3)",
                                            border: "none",
                                            borderRadius: 12,
                                            fontSize: 15,
                                            fontWeight: 700,
                                            cursor: ((currentQ.type === "mcq" && mcqSelection !== null) || (currentQ.type === "fill_in_blanks" && !fibAnswers.some(a => !a)) || currentQ.type === "ordering") ? "pointer" : "not-allowed",
                                        }}
                                    >
                                        Submit Answer
                                    </button>
                                ) : isCorrect ? (
                                    <button
                                        onClick={handleNextQuestion}
                                        style={{
                                            padding: "13px 28px",
                                            background: "linear-gradient(135deg, #34d399, #059669)",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 12,
                                            fontSize: 15,
                                            fontWeight: 700,
                                            cursor: "pointer",
                                        }}
                                    >
                                        {currentQuestionIndex < questions.length - 1 ? "Next Question →" : "Claim Reward 🏆"}
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2 - Reward */}
                {activeStep === 2 && (
                    <div style={{ padding: "60px 36px", textAlign: "center" }}>
                        <div style={{ position: "relative", display: "inline-block", marginBottom: 32 }}>
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
                        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", margin: "0 0 40px 0", lineHeight: 1.6, animation: "fade-up 0.4s ease 0.2s both" }}>
                            You crushed it! All questions answered perfectly.<br />XP has been added to your streak.
                        </p>

                        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px", borderRadius: 99, background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))", border: "1.5px solid rgba(251,191,36,0.3)", marginBottom: 40, animation: "xp-pulse 0.6s ease 0.3s both" }}>
                            <span style={{ fontSize: 22 }}>⚡</span>
                            <span style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24" }}>+{earnedXP > 0 ? xpCount : 0} XP</span>
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

                        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animation: "fade-up 0.4s ease 0.45s both" }}>
                            <button onClick={handleReviewLesson} style={{ padding: "14px 28px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                                📖 Review Lesson
                            </button>
                            <button onClick={() => router.push(`/paths/${pathSlug}`)} style={{ padding: "14px 28px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                                🎓 Return to Path
                            </button>
                            <button onClick={handleNext2} style={{ padding: "14px 28px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a1200", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 24px rgba(251,191,36,0.45)", maxWidth: 260, display: "flex", alignItems: "center", gap: 8 }}>
                                {nextSprintSlug ? (<><span>Next:</span><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nextSprintTitle}</span><span>→</span></>) : (<>🎓 Back to Path</>)}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
                @keyframes confetti-fall { 0% { transform: translateY(-10px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
                @keyframes trophy-pop { 0% { transform: scale(0.4) rotate(-10deg); opacity: 0; } 70% { transform: scale(1.15) rotate(3deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
                @keyframes xp-pulse { 0% { transform: scale(0.85); opacity: 0; } 60% { transform: scale(1.06); } 100% { transform: scale(1); opacity: 1; } }
                @keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slide-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes streak-exit { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-30px); opacity: 0; } }
                @keyframes streak-enter { 0% { transform: translateY(30px); opacity: 0; scale: 0.8; } 100% { transform: translateY(0); opacity: 1; scale: 1; } }
            `}</style>
        </div>
    )
}