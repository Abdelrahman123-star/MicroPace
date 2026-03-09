import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react"
import CodeChallengeEditor from "./CodeChallengeEditor"
import React, { useState, useEffect, useMemo } from "react";

export interface IQuestion {
    type: "mcq" | "fill_in_blanks" | "ordering" | "replica"
    question: string
    options?: string[]
    correctAnswerIndex?: number
    blanks?: string[]
    draggables?: string[]
    itemsToOrder?: string[]
    initialHtml?: string
    initialCss?: string
    initialJs?: string
    solutionHtml?: string
    solutionCss?: string
    solutionJs?: string
    replicaHtml?: string
    replicaCss?: string
    replicaJs?: string
    hint?: string
}

interface QuizStepProps {
    questions: IQuestion[]
    showKnowledgeCheckIntro: boolean
    setShowKnowledgeCheckIntro: (val: boolean) => void
    currentQuestionIndex: number
    setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
    onFinish: () => void
    onNextStep: () => void
    shuffleArray: <T>(array: T[]) => T[]
    notify: (message: string, type?: "success" | "error" | "info") => void
}

interface QuestionState {
    submitted: boolean;
    isCorrect: boolean;
    mcqSelection: number | null;
    fibAnswers: string[];
    orderingState: string[];
}

export default function QuizStep({
    questions,
    showKnowledgeCheckIntro,
    setShowKnowledgeCheckIntro,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    onFinish,
    onNextStep,
    shuffleArray,
    notify
}: QuizStepProps) {
    // Initialize state for each question
    const [quizStates, setQuizStates] = useState<QuestionState[]>(() =>
        questions.map(q => ({
            submitted: false,
            isCorrect: false,
            mcqSelection: null,
            fibAnswers: q.type === "fill_in_blanks" ? new Array(q.blanks?.length || 0).fill("") : [],
            orderingState: [], // Will shuffle in useEffect to avoid hydration error
        }))
    )

    useEffect(() => {
        setQuizStates(prev => prev.map((state, i) => {
            const q = questions[i];
            if (q.type === "ordering" && state.orderingState.length === 0) {
                return { ...state, orderingState: shuffleArray(q.itemsToOrder || []) };
            }
            return state;
        }));
    }, [questions, shuffleArray]);

    const currentState = quizStates[currentQuestionIndex]
    const currentQ = questions?.[currentQuestionIndex]

    // Update state for current question
    const updateCurrentState = (updates: Partial<QuestionState>) => {
        setQuizStates(prev => {
            const next = [...prev]
            next[currentQuestionIndex] = { ...next[currentQuestionIndex], ...updates }
            return next
        })
    }

    const checkAnswer = () => {
        if (!currentQ) return false
        if (currentQ.type === "mcq") {
            return currentState.mcqSelection === currentQ.correctAnswerIndex
        } else if (currentQ.type === "fill_in_blanks") {
            return JSON.stringify(currentState.fibAnswers) === JSON.stringify(currentQ.blanks)
        } else if (currentQ.type === "ordering") {
            return JSON.stringify(currentState.orderingState) === JSON.stringify(currentQ.itemsToOrder)
        }
        return false
    }

    const handleSubmit = () => {
        const correct = checkAnswer()
        const newStates = [...quizStates]
        newStates[currentQuestionIndex] = {
            ...newStates[currentQuestionIndex],
            isCorrect: correct,
            submitted: true
        }
        setQuizStates(newStates)

        if (correct) {
            const allCorrect = newStates.every((s, i) => questions[i].type === "replica" || s.isCorrect)
            if (allCorrect) {
                onFinish()
            }
        }
    }

    const handleRetry = () => {
        updateCurrentState({
            submitted: false,
            isCorrect: false,
            mcqSelection: currentQ?.type === "mcq" ? null : currentState.mcqSelection,
            fibAnswers: currentQ?.type === "fill_in_blanks" ? new Array(currentQ.blanks?.length || 0).fill("") : currentState.fibAnswers,
            orderingState: currentQ?.type === "ordering" ? shuffleArray(currentQ.itemsToOrder || []) : currentState.orderingState
        })
    }

    const handleNextQuestion = () => {
        if (questions && currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        } else {
            // Check if all are correct before proceeding to finish
            const allCorrect = quizStates.every((s, i) => questions[i].type === "replica" || s.isCorrect)
            if (allCorrect) {
                onFinish()
            } else {
                notify("Please complete all challenges correctly first!", "info")
            }
        }
    }

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1)
        }
    }

    const handleFibDrop = (index: number, word: string) => {
        if (currentState.submitted) return
        const newAnswers = [...currentState.fibAnswers]
        const existingIndex = newAnswers.indexOf(word)
        if (existingIndex !== -1) {
            newAnswers[existingIndex] = ""
        }
        newAnswers[index] = word
        updateCurrentState({ fibAnswers: newAnswers })
    }

    const removeFibAnswer = (index: number) => {
        if (currentState.submitted) return
        const newAnswers = [...currentState.fibAnswers]
        newAnswers[index] = ""
        updateCurrentState({ fibAnswers: newAnswers })
    }

    const handleOrderDrop = (toIndex: number, draggedItemIndexStr: string) => {
        if (currentState.submitted) return
        const fromIndex = parseInt(draggedItemIndexStr, 10)
        if (isNaN(fromIndex) || fromIndex === toIndex) return

        const newOrder = [...currentState.orderingState]
        const [movedItem] = newOrder.splice(fromIndex, 1)
        newOrder.splice(toIndex, 0, movedItem)
        updateCurrentState({ orderingState: newOrder })
    }

    const renderFibSentence = () => {
        if (!currentQ || currentQ.type !== "fill_in_blanks") return null
        const parts = currentQ.question.split("{{blank}}")

        return (
            <div style={{ lineHeight: 2.2, fontSize: 17, color: "#fff", fontWeight: 500 }}>
                {parts.map((part, i) => (
                    <React.Fragment key={i}>
                        <span>{part}</span>
                        {i < parts.length - 1 && (
                            <span
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    const word = e.dataTransfer.getData("text/plain")
                                    if (word) handleFibDrop(i, word)
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
                                    background: currentState.fibAnswers[i] ? "linear-gradient(135deg, #a78bfa, #7c3aed)" : "rgba(255,255,255,0.08)",
                                    border: currentState.fibAnswers[i] ? "none" : "1.5px dashed rgba(255,255,255,0.3)",
                                    borderRadius: 6,
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: 15,
                                    verticalAlign: "middle",
                                    cursor: (currentState.fibAnswers[i] && !currentState.submitted) ? "pointer" : "default",
                                    transition: "all 0.2s"
                                }}
                            >
                                {currentState.fibAnswers[i] || ""}
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        )
    }

    return (
        <div style={{ padding: "0 0 36px" }}>
            {showKnowledgeCheckIntro ? (
                <div style={{ padding: "80px 36px", textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ fontSize: 72, marginBottom: 24, filter: "drop-shadow(0 0 20px rgba(16,185,129,0.3))" }}>🎊</div>
                    <h2 style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Challenge Mastered!</h2>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 18, marginBottom: 40, maxWidth: 500 }}>
                        You've successfully completed the practical part of this sprint. Now, let's wrap up with a quick knowledge check.
                    </p>
                    <button
                        onClick={() => setShowKnowledgeCheckIntro(false)}
                        style={{
                            padding: "20px 48px",
                            background: "linear-gradient(135deg, #059669, #10b981)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 20,
                            fontSize: 20,
                            fontWeight: 800,
                            cursor: "pointer",
                            boxShadow: "0 10px 30px rgba(16,185,129,0.4)",
                            transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                        Start Knowledge Check <ChevronRight size={24} className="inline ml-2" />
                    </button>
                </div>
            ) : currentQ ? (
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
                        <div style={{ display: "flex", gap: 6 }}>
                            {questions.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentQuestionIndex(i)}
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                        border: "none",
                                        transition: "all 0.2s",
                                        background: i === currentQuestionIndex
                                            ? "#fb923c"
                                            : (quizStates[i].submitted && quizStates[i].isCorrect) || questions[i].type === "replica"
                                                ? "rgba(52,211,153,0.8)"
                                                : "rgba(255,255,255,0.1)",
                                        transform: i === currentQuestionIndex ? "scale(1.2)" : "scale(1)"
                                    }}
                                />
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
                        {currentQ.type === "mcq" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {currentQ.options?.map((option, idx) => {
                                    const isSelected = currentState.mcqSelection === idx
                                    const isRight = currentState.submitted && idx === currentQ.correctAnswerIndex
                                    const isWrong = currentState.submitted && isSelected && idx !== currentQ.correctAnswerIndex
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => !currentState.submitted && updateCurrentState({ mcqSelection: idx })}
                                            style={{
                                                width: "100%", textAlign: "left", padding: "16px 20px", borderRadius: 12,
                                                border: isRight ? "1.5px solid #34d399" : isWrong ? "1.5px solid #f87171" : isSelected ? "1.5px solid #fb923c" : "1.5px solid rgba(255,255,255,0.1)",
                                                background: isRight ? "rgba(52,211,153,0.12)" : isWrong ? "rgba(248,113,113,0.12)" : isSelected ? "rgba(251,146,60,0.12)" : "rgba(255,255,255,0.03)",
                                                color: isRight ? "#34d399" : isWrong ? "#f87171" : isSelected ? "#fb923c" : "rgba(255,255,255,0.75)",
                                                fontSize: 15, fontWeight: isSelected ? 600 : 400, cursor: currentState.submitted ? "default" : "pointer", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: 12,
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
                        {currentQ.type === "fill_in_blanks" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "24px" }}>
                                    {renderFibSentence()}
                                </div>
                                {!currentState.submitted && (
                                    <div>
                                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 12 }}>Word Pool (Drag & Drop)</p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                            {currentQ.draggables?.map((word, idx) => {
                                                if (currentState.fibAnswers.includes(word)) return null
                                                return (
                                                    <div
                                                        key={idx} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", word)}
                                                        style={{ padding: "8px 16px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, color: "#fff", fontWeight: 600, cursor: "grab", userSelect: "none" }}
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
                        {currentQ.type === "ordering" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Drag and drop to rearrange into the correct order.</p>
                                {currentState.orderingState.map((item, idx) => (
                                    <div
                                        key={item} draggable={!currentState.submitted}
                                        onDragStart={(e) => e.dataTransfer.setData("text/plain", idx.toString())}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => { e.preventDefault(); handleOrderDrop(idx, e.dataTransfer.getData("text/plain")) }}
                                        style={{
                                            padding: "16px", background: "rgba(255,255,255,0.05)",
                                            border: currentState.submitted ? (currentState.isCorrect ? "1px solid rgba(52,211,153,0.5)" : "1px solid rgba(248,113,113,0.5)") : "1px solid rgba(255,255,255,0.15)",
                                            borderRadius: 12, color: "#fff", fontWeight: 600, fontSize: 15, fontFamily: "monospace", display: "flex", alignItems: "center", gap: 12, cursor: currentState.submitted ? "default" : "grab", transition: "transform 0.2s"
                                        }}
                                    >
                                        <div style={{ color: "rgba(255,255,255,0.3)" }}>⠿</div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}
                        {currentQ.type === "replica" && (
                            <div key={currentQuestionIndex} style={{ marginTop: 0 }}>
                                <CodeChallengeEditor
                                    initialHtml={currentQ.initialHtml}
                                    initialCss={currentQ.initialCss}
                                    initialJs={currentQ.initialJs}
                                    solutionHtml={currentQ.solutionHtml}
                                    solutionCss={currentQ.solutionCss}
                                    solutionJs={currentQ.solutionJs}
                                    replicaHtml={currentQ.replicaHtml}
                                    replicaCss={currentQ.replicaCss}
                                    replicaJs={currentQ.replicaJs}
                                    hint={currentQ.hint}
                                    onComplete={() => {
                                        // Update state logic for replica
                                        const newStates = [...quizStates]
                                        newStates[currentQuestionIndex] = {
                                            ...newStates[currentQuestionIndex],
                                            isCorrect: true,
                                            submitted: true
                                        }
                                        setQuizStates(newStates)
                                        handleNextQuestion();
                                    }}
                                    notify={notify}
                                    setShowConfirm={(val: any) => {
                                        // Minimal shim if needed
                                    }}
                                />
                            </div>
                        )}
                        {(currentState.submitted || currentQ.type === "replica") && currentQ.type !== "replica" && (
                            <div style={{ marginTop: 24, padding: "16px 20px", borderRadius: 12, background: currentState.isCorrect ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${currentState.isCorrect ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`, color: currentState.isCorrect ? "#34d399" : "#f87171", fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", gap: 10, animation: "slide-in 0.3s ease" }}>
                                <span style={{ fontSize: 20 }}>{currentState.isCorrect ? "🎉" : "💡"}</span>
                                {currentState.isCorrect ? "Correct answer!" : "Not quite — try again!"}
                            </div>
                        )}
                        <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    onClick={handlePrevQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    style={{
                                        padding: "10px",
                                        background: "rgba(255,255,255,0.05)",
                                        borderRadius: "50%",
                                        color: currentQuestionIndex === 0 ? "rgba(255,255,255,0.2)" : "#fff",
                                        cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
                                        border: "1px solid rgba(255,255,255,0.1)"
                                    }}
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                    disabled={currentQuestionIndex === questions.length - 1}
                                    style={{
                                        padding: "10px",
                                        background: "rgba(255,255,255,0.05)",
                                        borderRadius: "50%",
                                        color: currentQuestionIndex === questions.length - 1 ? "rgba(255,255,255,0.2)" : "#fff",
                                        cursor: currentQuestionIndex === questions.length - 1 ? "not-allowed" : "pointer",
                                        border: "1px solid rgba(255,255,255,0.1)"
                                    }}
                                >
                                    <ArrowRight size={18} />
                                </button>
                            </div>

                            <div style={{ display: "flex", gap: 12 }}>
                                {currentState.submitted && !currentState.isCorrect && (
                                    <button onClick={handleRetry} style={{ padding: "13px 26px", background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1.5px solid rgba(248,113,113,0.35)", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Try Again</button>
                                )}
                                {!currentState.submitted && currentQ.type !== "replica" ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={(currentQ.type === "mcq" && currentState.mcqSelection === null) || (currentQ.type === "fill_in_blanks" && currentState.fibAnswers.some(a => !a))}
                                        style={{
                                            padding: "13px 28px",
                                            background: ((currentQ.type === "mcq" && currentState.mcqSelection !== null) || (currentQ.type === "fill_in_blanks" && !currentState.fibAnswers.some(a => !a)) || currentQ.type === "ordering") ? "linear-gradient(135deg, #f97316, #ef4444)" : "rgba(255,255,255,0.06)",
                                            color: ((currentQ.type === "mcq" && currentState.mcqSelection !== null) || (currentQ.type === "fill_in_blanks" && !currentState.fibAnswers.some(a => !a)) || currentQ.type === "ordering") ? "#fff" : "rgba(255,255,255,0.3)",
                                            borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: ((currentQ.type === "mcq" && currentState.mcqSelection !== null) || (currentQ.type === "fill_in_blanks" && !currentState.fibAnswers.some(a => !a)) || currentQ.type === "ordering") ? "pointer" : "not-allowed", border: "none"
                                        }}
                                    >Submit Answer</button>
                                ) : currentState.isCorrect ? (
                                    <button onClick={handleNextQuestion} style={{ padding: "13px 28px", background: "linear-gradient(135deg, #34d399, #059669)", color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", border: "none" }}>{currentQuestionIndex < questions.length - 1 ? "Next Question →" : "Claim Reward 🏆"}</button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ padding: 40, textAlign: "center" }}>
                    <p style={{ color: "#fff", fontSize: 18 }}>Challenge segment complete!</p>
                    <button onClick={onNextStep} style={{ marginTop: 20, padding: "12px 30px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer" }}>Finish Sprint</button>
                </div>
            )}
        </div>
    )
}

