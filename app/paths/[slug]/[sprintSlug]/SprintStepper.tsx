
"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"

// Refactored Components
import StepIndicator from "./components/StepIndicator"
import LearnStep from "./components/LearnStep"
import CodeStep from "./components/CodeStep"
import QuizStep from "./components/QuizStep"
import RewardStep from "./components/RewardStep"

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
    sprintTitle?: string
    xpReward: number
    lessonContent: string
    codeSnippet?: string
    codeLanguage?: string
    questions: IQuestion[]
    nextSprintSlug?: string
    nextSprintTitle?: string
    storyContext?: string
    completionStory?: string
    characters?: string[]
    codeChallenge?: any
    showCodePreview?: boolean
}

export default function SprintStepper({
    sprintId,
    pathId,
    pathSlug,
    sprintTitle,
    xpReward,
    lessonContent,
    codeSnippet,
    codeLanguage,
    questions = [],
    nextSprintSlug,
    nextSprintTitle,
    storyContext,
    completionStory,
    characters = [],
    codeChallenge,
    showCodePreview = false,
}: SprintStepperProps) {
    const router = useRouter()

    // STEP IDs: "learn", "code", "quiz", "reward"
    const [currentStepId, setCurrentStepId] = useState<string>("learn")
    const [activeStep, setActiveStep] = useState(0) // Visual index in the stepper

    // Stats & Progress
    const [earnedXP, setEarnedXP] = useState(0)
    const [xpCount, setXpCount] = useState(0)
    const [isStreakNew, setIsStreakNew] = useState(false)
    const [oldStreak, setOldStreak] = useState(0)
    const [currentStreak, setCurrentStreak] = useState<number | null>(null)
    const [elapsedMs, setElapsedMs] = useState(0)
    const [startTime] = useState(Date.now())
    const [showConfetti, setShowConfetti] = useState(false)

    // Quiz Specific State
    const [showKnowledgeCheckIntro, setShowKnowledgeCheckIntro] = useState(false)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

    const [reviewMode, setReviewMode] = useState(false)

    // Notification State
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)
    const [showConfirm, setShowConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null)

    const notify = (message: string, type: "success" | "error" | "info" = "info") => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3000)
    }

    useEffect(() => {
        if (currentStepId === "reward") {
            const end = Date.now()
            setElapsedMs(end - startTime)
        }
    }, [currentStepId, startTime])

    const steps = useMemo(() => {
        const baseSteps = [
            { id: "learn", label: "Learn", icon: "📖" },
        ]
        const cc = codeChallenge || {};
        const isBlank = (val: any) => !val || (typeof val === 'string' && (val.trim() === "" || val.trim() === "<p></p>" || val.trim() === "<p><br></p>"));
        const hasCodeContent = Boolean(
            !isBlank(cc.initialHtml) ||
            !isBlank(cc.initialCss) ||
            !isBlank(cc.initialJs) ||
            !isBlank(cc.instructions)
        );
        if (hasCodeContent) {
            baseSteps.push({ id: "code", label: "Code", icon: "💻" })
        }
        if (questions && questions.length > 0) {
            baseSteps.push({ id: "quiz", label: "Quiz", icon: "🎯" })
        }
        baseSteps.push({ id: "reward", label: "Win", icon: "🏆" })
        return baseSteps
    }, [codeChallenge, questions, showCodePreview])

    // --- Helpers ---
    const shuffleArray = <T,>(array: T[]): T[] => {
        const newArr = [...array]
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
        }
        return newArr
    }

    const formatElapsed = (ms: number) => {
        const totalSec = Math.floor(ms / 1000)
        const min = Math.floor(totalSec / 60)
        const sec = totalSec % 60
        return `${min}:${sec.toString().padStart(2, "0")}`
    }

    const formatContent = (text: string) => {
        if (!text) return ""
        const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g)
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i} style={{ color: "#fff", fontWeight: 800 }}>{part.slice(2, -2)}</strong>
            }
            if (part.startsWith("`") && part.endsWith("`")) {
                return (
                    <code key={i} style={{
                        background: "rgba(255,255,255,0.1)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        color: "#fb923c",
                        fontFamily: "monospace",
                        fontSize: "0.9em",
                    }}>
                        {part.slice(1, -1)}
                    </code>
                )
            }
            return part
        })
    }

    // --- Actions ---
    const handleNextStep = () => {
        const currentIndex = steps.findIndex(s => s.id === currentStepId)
        if (currentIndex < steps.length - 1) {
            const nextStep = steps[currentIndex + 1]

            // If the next step is "reward", we need to finish the sprint first
            if (nextStep.id === "reward") {
                handleFinish()
                return
            }

            setCurrentStepId(nextStep.id)
            setActiveStep(currentIndex + 1)

            if (nextStep.id === "quiz") {
                setShowKnowledgeCheckIntro(true)
            }
        }
    }

    const handleFinish = async () => {
        const rewardIndex = steps.findIndex(s => s.id === "reward");

        if (reviewMode) {
            setCurrentStepId("reward")
            setActiveStep(rewardIndex)
            return
        }

        try {
            const res = await fetch("/api/sprint/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sprintId,
                    pathId,
                    xpEarned: xpReward,
                }),
            })

            const data = await res.json()
            if (data.currentStreak !== undefined) {
                setEarnedXP(xpReward)
                if (currentStreak !== null && data.currentStreak > currentStreak) {
                    setIsStreakNew(true)
                    setOldStreak(currentStreak)
                }
                setCurrentStreak(data.currentStreak)

                // Trigger custom confetti
                setShowConfetti(true)
                setTimeout(() => setShowConfetti(false), 3500)

                let count = 0
                const interval = setInterval(() => {
                    count += 2
                    if (count >= xpReward) {
                        setXpCount(xpReward)
                        clearInterval(interval)
                    } else {
                        setXpCount(count)
                    }
                }, 40)

                setCurrentStepId("reward")
                setActiveStep(rewardIndex)
            }
        } catch (err) {
            console.error("Failed to save progress", err)
            setCurrentStepId("reward")
            setActiveStep(rewardIndex)
        }
    }

    const handleNext2 = () => {
        if (nextSprintSlug) {
            router.push(`/paths/${pathSlug}/${nextSprintSlug}`)
        } else {
            router.push(`/paths/${pathSlug}`)
        }
    }

    return (
        <div style={{ minHeight: "100vh", background: "#0f172a", color: "#fff", fontFamily: "'Inter', system-ui, sans-serif", padding: "40px 20px" }}>

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

            <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
                <StepIndicator
                    steps={steps}
                    activeStep={activeStep}
                    onStepClick={(idx) => {
                        const targetStep = steps[idx]
                        setCurrentStepId(targetStep.id)
                        setActiveStep(idx)
                    }}
                />

                <div style={{
                    background: currentStepId === "code" ? "transparent" : "rgba(30, 41, 59, 0.7)",
                    borderRadius: currentStepId === "code" ? 0 : 32,
                    border: currentStepId === "code" ? "none" : "1px solid rgba(255,255,255,0.08)",
                    overflow: "hidden",
                    backdropFilter: currentStepId === "code" ? "none" : "blur(20px)",
                    boxShadow: currentStepId === "code" ? "none" : "0 25px 50px -12px rgba(0,0,0,0.5)",
                    width: "100%",
                    transition: "all 0.3s ease"
                }}>
                    <div style={{ display: currentStepId === "learn" ? "block" : "none" }}>
                        <LearnStep
                            sprintTitle={sprintTitle}
                            xpReward={xpReward}
                            storyContext={storyContext}
                            characters={characters}
                            lessonContent={lessonContent}
                            codeSnippet={codeSnippet}
                            codeLanguage={codeLanguage}
                            reviewMode={reviewMode}
                            pathSlug={pathSlug}
                            onNextStep={handleNextStep}
                            formatContent={formatContent}
                            notify={notify}
                            showCodePreview={showCodePreview}
                        />
                    </div>

                    <div style={{ display: currentStepId === "code" ? "block" : "none" }}>
                        <CodeStep
                            codeChallenge={codeChallenge}
                            onComplete={handleNextStep}
                            notify={notify}
                            setShowConfirm={setShowConfirm}
                        />
                    </div>

                    <div style={{ display: currentStepId === "quiz" ? "block" : "none" }}>
                        <QuizStep
                            questions={questions}
                            showKnowledgeCheckIntro={showKnowledgeCheckIntro}
                            setShowKnowledgeCheckIntro={setShowKnowledgeCheckIntro}
                            currentQuestionIndex={currentQuestionIndex}
                            setCurrentQuestionIndex={setCurrentQuestionIndex}
                            onFinish={handleFinish}
                            onNextStep={handleNextStep}
                            shuffleArray={shuffleArray}
                            notify={notify}
                        />
                    </div>

                    {currentStepId === "reward" && (
                        <RewardStep
                            completionStory={completionStory}
                            earnedXP={earnedXP}
                            xpCount={xpCount}
                            currentStreak={currentStreak}
                            elapsedMs={elapsedMs}
                            formatElapsed={formatElapsed}
                            isStreakNew={isStreakNew}
                            oldStreak={oldStreak}
                            nextSprintSlug={nextSprintSlug}
                            nextSprintTitle={nextSprintTitle}
                            pathSlug={pathSlug}
                            handleNext2={handleNext2}
                        />
                    )}
                </div>
            </div>

            {/* Custom Notifications */}
            {notification && (
                <div style={{
                    position: "fixed", bottom: 40, left: "50%", transform: "translateX(-50%)",
                    background: notification.type === "error" ? "#ef4444" : "#10b981",
                    color: "#fff", padding: "12px 24px", borderRadius: 12, fontWeight: 700,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.3)", zIndex: 1000,
                    animation: "slide-up 0.3s ease-out"
                }}>
                    {notification.message}
                </div>
            )}

            {showConfirm && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
                    justifyContent: "center", zIndex: 1001
                }}>
                    <div style={{
                        background: "#1e293b", padding: 32, borderRadius: 24,
                        border: "1px solid rgba(255,255,255,0.1)", maxWidth: 400,
                        textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
                    }}>
                        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Are you sure?</h3>
                        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>{showConfirm.message}</p>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                            <button onClick={() => setShowConfirm(null)} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.1)", borderRadius: 12, fontWeight: 600 }}>Cancel</button>
                            <button onClick={() => { showConfirm.onConfirm(); setShowConfirm(null); }} style={{ padding: "10px 20px", background: "#ef4444", borderRadius: 12, fontWeight: 700 }}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
                @keyframes confetti-fall { 0% { transform: translateY(-10px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
                @keyframes trophy-pop { 0% { transform: scale(0.4) rotate(-10deg); opacity: 0; } 70% { transform: scale(1.15) rotate(3deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
                @keyframes xp-pulse { 0% { transform: scale(0.85); opacity: 0; } 60% { transform: scale(1.06); } 100% { transform: scale(1); opacity: 1; } }
                @keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slide-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes streak-exit { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-30px); opacity: 0; } }
                @keyframes streak-enter { 0% { transform: translateY(30px); opacity: 0; scale: 0.8; } 100% { transform: translateY(0); opacity: 1; scale: 1; } }
                @keyframes xp-glow { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.4); } }
                @keyframes slide-up { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
            `}</style>
        </div>
    )
}
