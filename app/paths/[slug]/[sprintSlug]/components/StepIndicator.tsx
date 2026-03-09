import React from "react"

interface Step {
    id: string
    label: string
    icon: string
}

interface StepIndicatorProps {
    steps: Step[]
    activeStep: number
    onStepClick: (idx: number) => void
}

export default function StepIndicator({ steps, activeStep, onStepClick }: StepIndicatorProps) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            marginBottom: 48,
            width: "100%"
        }}>
            {steps.map((step, idx) => (
                <React.Fragment key={step.id}>
                    <div
                        onClick={() => {
                            if (step.id !== "reward" || idx <= activeStep) {
                                onStepClick(idx);
                            }
                        }}
                        title={step.label}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 8,
                            cursor: (step.id !== "reward" || idx <= activeStep) ? "pointer" : "default",
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

                    {idx < steps.length - 1 && (
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
    )
}
