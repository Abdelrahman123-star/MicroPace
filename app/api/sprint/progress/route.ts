import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { User, IUser } from "@/models/User"

// Define Skill type
interface Skill {
    pathId: string
    level: number
    completedSprints: string[]
    xp: number
}

export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const body = await req.json()
        const { sprintId, pathId, xpEarned } = body as { sprintId: string; pathId: string; xpEarned: number }

        const token = req.cookies.get("token")?.value
        if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

        const payload: any = verifyToken(token)
        const user = await User.findById(payload.id)
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const skills = user.skills as Skill[]

        // Find or create skill entry for this path
        let skill = skills.find((s) => String(s.pathId) === String(pathId))
        if (!skill) {
            user.skills.push({ pathId, level: 1, completedSprints: [], xp: 0 })
            skill = user.skills[user.skills.length - 1] as unknown as Skill
        }

        // Award XP only on first completion
        const alreadyCompleted = skill.completedSprints.map(String).includes(String(sprintId))
        if (!alreadyCompleted) {
            skill.completedSprints.push(sprintId)
            skill.xp += xpEarned
            user.totalXP += xpEarned
            user.markModified("skills")

            // ── Streak logic ──────────────────────────────────────────────
            const todayStart = new Date()
            todayStart.setHours(0, 0, 0, 0)

            const yesterdayStart = new Date(todayStart)
            yesterdayStart.setDate(yesterdayStart.getDate() - 1)

            const last = user.lastSprintDate ? new Date(user.lastSprintDate) : null
            if (last) last.setHours(0, 0, 0, 0)

            if (!last || last.getTime() < yesterdayStart.getTime()) {
                // No previous sprint, or streak broken — reset to 1
                user.currentStreak = 1
            } else if (last.getTime() === yesterdayStart.getTime()) {
                // Completed yesterday → extend streak
                user.currentStreak = (user.currentStreak || 0) + 1
            }
            // If last === today: already done today, don't touch streak

            user.lastSprintDate = new Date()
            // ─────────────────────────────────────────────────────────────
        }

        await user.save()

        return NextResponse.json({
            success: true,
            totalXP: user.totalXP,
            skillXP: skill.xp,
            completedSprints: skill.completedSprints,
            currentStreak: user.currentStreak,
        })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}