import Link from "next/link"
import { notFound } from "next/navigation"
import { connectDB } from "@/lib/mongodb"
import { Path } from "@/models/Path"
import { Sprint } from "@/models/Sprint"
import { getAuthUser } from "@/middleware/middleware"
import { ArrowLeft, CheckCircle2, Trophy, Clock, PlayCircle } from "lucide-react"
import SprintListItem from "@/components/SprintListItem"

interface Props {
    params: Promise<{ slug: string }>
}

export default async function PathDetailPage({ params }: Props) {
    const { slug } = await params

    await connectDB()

    const path = await Path.findOne({ slug }).lean()
    if (!path) return notFound()

    const sprints: any[] = await Sprint.find({ pathId: path._id })
        .sort({ order: 1 })
        .lean()

    // Determine completion state
    const user = await getAuthUser()
    let completedSprintIds: string[] = []

    if (user) {
        const skill = user.skills?.find((s: any) => s.pathId.toString() === path._id.toString())
        if (skill) {
            completedSprintIds = skill.completedSprints || []
        }
    }

    const totalXP = sprints.reduce((sum, s) => sum + (s.xpReward || 10), 0)

    return (
        <div className="min-h-screen bg-[hsl(210,25%,96%)] overflow-x-hidden pt-32 pb-24">

            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[hsl(217,91%,60%,0.1)] blur-[120px]" />
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-[hsl(199,89%,48%,0.1)] blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6">

                <div className="mb-8">
                    <Link href="/paths" className="inline-flex items-center gap-2 text-[hsl(215,15%,45%)] hover:text-[hsl(217,91%,60%)] font-semibold transition-colors">
                        <ArrowLeft size={18} /> Back to Paths
                    </Link>
                </div>

                {/* Path Header */}
                <div className="bg-white/80 backdrop-blur-2xl border border-[hsl(210,20%,88%,0.6)] shadow-xl rounded-3xl p-8 md:p-10 mb-12 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-2xl bg-[hsl(217,91%,60%,0.1)] flex items-center justify-center text-5xl flex-shrink-0 border border-[hsl(217,91%,60%,0.2)]">
                        {path.icon || "📘"}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-[hsl(210,20%,90%)] text-[hsl(215,15%,45%)] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {path.category || "General"}
                            </span>
                            <span className="flex items-center gap-1 text-[hsl(217,91%,60%)] font-bold text-sm bg-[hsl(217,91%,60%,0.1)] px-3 py-1 rounded-full">
                                <Trophy size={14} /> {totalXP} XP Total
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-[hsl(215,25%,15%)] mb-4">
                            {path.name}
                        </h1>
                        <p className="text-[hsl(215,15%,45%)] text-lg font-medium leading-relaxed max-w-2xl">
                            {path.description}
                        </p>
                    </div>
                </div>

                {/* Sprints List */}
                <h2 className="text-2xl font-bold text-[hsl(215,25%,15%)] mb-6 flex items-center gap-2">
                    <PlayCircle className="text-[hsl(217,91%,60%)]" size={24} />
                    Curriculum Sprints
                </h2>

                <div className="space-y-4">
                    {sprints.map((sprint, index) => (
                        <SprintListItem
                            key={sprint._id.toString()}
                            sprint={JSON.parse(JSON.stringify(sprint))}
                            index={index}
                            isCompleted={completedSprintIds.includes(sprint._id.toString())}
                            slug={slug}
                        />
                    ))}

                    {sprints.length === 0 && (
                        <div className="text-center p-12 bg-white/50 rounded-2xl border border-[hsl(210,20%,88%)]">
                            <p className="text-[hsl(215,15%,45%)] font-medium">No sprints have been added to this path yet.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}