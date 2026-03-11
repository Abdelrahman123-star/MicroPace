import React from "react"
import CodeChallengeEditor from "@/app/paths/[slug]/[sprintSlug]/components/CodeChallengeEditor"

interface CodeStepProps {
    codeChallenge: any
    onComplete: () => void
    notify: (message: string, type?: "success" | "error" | "info") => void
    setShowConfirm: (val: { message: string, onConfirm: () => void } | null) => void
    instructions?: string
}

export default function CodeStep({ codeChallenge, onComplete, notify, setShowConfirm, instructions }: CodeStepProps) {
    return (
        <div style={{ padding: "0" }}>
            <CodeChallengeEditor
                {...codeChallenge}
                instructions={instructions || codeChallenge?.instructions}
                onComplete={onComplete}
                notify={notify}
                setShowConfirm={setShowConfirm}
            />
        </div>
    )
}
