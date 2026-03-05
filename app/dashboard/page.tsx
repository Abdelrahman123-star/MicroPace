import { requireAuth } from "@/middleware/middleware";
import { connectDB } from "@/lib/mongodb";
import { Path } from "@/models/Path";
import { Sprint } from "@/models/Sprint";
import Link from "next/link";
import {
    Flame, Sparkles, Trophy, Clock, PlayCircle, Star, Target, CheckCircle2
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import StreakWarning from "@/components/StreakWarning";

export default async function DashboardPage() {
    const user = await requireAuth();
    await connectDB();

    // 1. Fetch user active skills
    const skills = user.skills || [];

    // 2. Prepare paths data user is working on
    const activePathsData = await Promise.all(skills.map(async (skill: any) => {
        const path = await Path.findById(skill.pathId).lean();
        if (!path) return null;

        // Find total sprints to calc progress
        const totalSprints = await Sprint.countDocuments({ pathId: path._id });
        const completedSprintsCount = skill.completedSprints?.length || 0;
        const progressPercentage = totalSprints > 0 ? Math.round((completedSprintsCount / totalSprints) * 100) : 0;

        // Find next sprint (first sprint not in completedSprints array)
        // Sanitize completedSprints to avoid CastError with empty strings
        const sanitizedCompleted = (skill.completedSprints || []).filter((id: string) => id && id.length === 24);

        const nextSprint = await Sprint.findOne({
            pathId: path._id,
            _id: { $nin: sanitizedCompleted }
        }).sort({ order: 1 }).lean();

        return {
            path,
            skillLevel: skill.level || 1,
            progressPercentage,
            completedSprintsCount,
            totalSprints,
            nextSprint
        };
    }));

    // Filter valid active paths
    const validPaths = activePathsData.filter(Boolean);

    // 3. Motivational Quotes
    const quotes = [
        "Small sprints. Massive growth.",
        "Consistency beats intensity.",
        "Every sprint brings you closer to mastery.",
        "Learning is a marathon made of little sprints."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return (
        <div className="min-h-screen bg-[hsl(210,25%,96%)] overflow-x-hidden pt-28 pb-24">

            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[hsl(217,91%,60%,0.08)] blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[hsl(199,89%,48%,0.08)] blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[hsl(217,91%,60%,0.03)] blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6">

                {/* Streak Warning */}
                <StreakWarning lastSprintDate={user.lastSprintDate ? new Date(user.lastSprintDate).toISOString() : undefined} currentStreak={user.currentStreak} />

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-[hsl(215,25%,15%)] mb-2">
                            Welcome back, <span className="text-[hsl(217,91%,60%)]">{user.username}</span>!
                        </h1>
                        <p className="text-[hsl(215,15%,45%)] text-lg font-medium italic">
                            "{randomQuote}"
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Column: Stats & Main Action */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white/80 backdrop-blur-xl border border-[hsl(210,20%,88%,0.6)] rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="text-[hsl(217,91%,60%)]" size={18} />
                                    <span className="text-sm font-bold text-[hsl(215,15%,45%)]">Total XP</span>
                                </div>
                                <div className="text-3xl font-black text-[hsl(215,25%,15%)]">{user.totalXP}</div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-xl border border-[hsl(210,20%,88%,0.6)] rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Flame className="text-orange-500" size={18} />
                                    <span className="text-sm font-bold text-[hsl(215,15%,45%)]">Streak</span>
                                </div>
                                <div className="text-3xl font-black text-[hsl(215,25%,15%)]">{user.currentStreak} <span className="text-sm">Days</span></div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-xl border border-[hsl(210,20%,88%,0.6)] rounded-2xl p-5 shadow-sm sm:col-span-2 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(217,91%,60%,0.1)] rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-[hsl(217,91%,60%,0.2)] transition-colors"></div>
                                <div className="relative z-10 flex items-center justify-between h-full">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target className="text-[hsl(199,89%,48%)]" size={18} />
                                            <span className="text-sm font-bold text-[hsl(215,15%,45%)]">Active Paths</span>
                                        </div>
                                        <div className="text-3xl font-black text-[hsl(215,25%,15%)]">{validPaths.length}</div>
                                    </div>
                                    <Link href="/paths" className="bg-[hsl(215,25%,15%)] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-md">
                                        Explore All
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Today's Sprint or Recommended Action */}
                        <div className="bg-white/90 backdrop-blur-2xl border border-[hsl(210,20%,88%,0.8)] shadow-xl rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-x64 bg-gradient-to-br from-[hsl(217,91%,60%,0.1)] to-[hsl(199,89%,48%,0.1)] blur-3xl -mr-20 -mt-20"></div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[hsl(217,91%,60%)] font-bold mb-4 bg-[hsl(217,91%,60%,0.1)] px-3 py-1 rounded-full">
                                    <Star size={14} /> Recommended Next Step
                                </div>

                                {validPaths.length > 0 && validPaths[0]?.nextSprint ? (
                                    <>
                                        <h2 className="text-3xl font-bold text-[hsl(215,25%,15%)] mb-2">
                                            {validPaths[0]?.nextSprint.title}
                                        </h2>
                                        <p className="text-[hsl(215,15%,45%)] font-medium mb-6">
                                            From path: <span className="font-bold">{validPaths[0]?.path.name}</span>
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 mb-8">
                                            <span className="flex items-center gap-1.5 bg-[hsl(210,20%,94%)] text-[hsl(215,25%,15%)] px-4 py-2 rounded-xl text-sm font-bold">
                                                <Trophy size={16} className="text-[hsl(217,91%,60%)]" /> +{validPaths[0]?.nextSprint.xpReward} XP
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-[hsl(210,20%,94%)] text-[hsl(215,25%,15%)] px-4 py-2 rounded-xl text-sm font-bold">
                                                <Clock size={16} className="text-[hsl(215,15%,45%)]" /> ~8 min
                                            </span>
                                        </div>

                                        <Link
                                            href={`/paths/${validPaths[0]?.path.slug}/${validPaths[0]?.nextSprint.slug}`}
                                            className="bg-[hsl(217,91%,60%)] text-white text-base px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-[hsl(217,91%,55%)] transition-colors shadow-[0_0_40px_hsl(217,91%,60%,0.3)] group-hover:shadow-[0_0_60px_hsl(217,91%,60%,0.4)]"
                                        >
                                            <PlayCircle size={20} /> Start Today's Sprint
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-3xl font-bold text-[hsl(215,25%,15%)] mb-2">
                                            Ready to Begin?
                                        </h2>
                                        <p className="text-[hsl(215,15%,45%)] font-medium mb-8">
                                            You haven't started any paths yet. Browse our selection and pick a skill to master.
                                        </p>
                                        <Link
                                            href="/paths"
                                            className="bg-[hsl(217,91%,60%)] text-white text-base px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-[hsl(217,91%,55%)] transition-colors shadow-[0_0_40px_hsl(217,91%,60%,0.3)]"
                                        >
                                            <Target size={20} /> Browse Paths
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Recent Paths Progress */}
                        {validPaths.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-[hsl(215,25%,15%)] mb-4 flex items-center gap-2">
                                    <Target className="text-[hsl(199,89%,48%)]" size={20} /> Your Paths
                                </h3>
                                <div className="space-y-4">
                                    {validPaths.map((p: any, idx: number) => (
                                        <Link
                                            key={idx}
                                            href={`/paths/${p.path.slug}`}
                                            className="block bg-white/60 backdrop-blur-xl border border-[hsl(210,20%,88%,0.5)] rounded-2xl p-5 hover:border-[hsl(217,91%,60%,0.3)] hover:shadow-lg transition-all group"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl">{p.path.icon || "📘"}</div>
                                                    <h4 className="font-bold text-[hsl(215,25%,15%)] group-hover:text-[hsl(217,91%,60%)] transition-colors">{p.path.name}</h4>
                                                </div>
                                                <span className="text-sm font-bold text-[hsl(215,15%,45%)]">
                                                    {p.completedSprintsCount} / {p.totalSprints} Sprints
                                                </span>
                                            </div>
                                            <div className="h-2 bg-[hsl(210,20%,90%)] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(199,89%,48%)] rounded-full"
                                                    style={{ width: `${p.progressPercentage}%` }}
                                                />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Achievements & Extra */}
                    <div className="space-y-6">
                        {/* Gamification Widget */}
                        <div className="bg-white/80 backdrop-blur-xl border border-[hsl(210,20%,88%,0.6)] rounded-3xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-[hsl(215,25%,15%)] mb-4 flex items-center gap-2">
                                <Trophy className="text-yellow-500" size={18} /> Recent Achievements
                            </h3>
                            <div className="space-y-4">
                                {/* Dummy achievements for visual flair per PRD request */}
                                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-[hsl(210,20%,98%)] transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                        <Flame className="text-yellow-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[hsl(215,25%,15%)] text-sm">3-Day Streak!</p>
                                        <p className="text-xs text-[hsl(215,15%,45%)] font-medium">Keep hitting those daily goals.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-[hsl(210,20%,98%)] transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="text-blue-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[hsl(215,25%,15%)] text-sm">First Sprint Completed</p>
                                        <p className="text-xs text-[hsl(215,15%,45%)] font-medium">The journey of a thousand miles begins...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard Teaser */}
                        <div className="bg-gradient-to-br from-[hsl(215,25%,15%)] to-black rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(217,91%,60%,0.2)] rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10">
                                <Sparkles size={18} className="text-[hsl(217,91%,60%)]" /> Global Ranking
                            </h3>
                            <p className="text-gray-400 text-sm mb-4 relative z-10 font-medium">
                                You are currently unranked. Keep earning XP to appear on the leaderboard!
                            </p>
                            <Link href="/#leaderboard" className="text-[hsl(217,91%,60%)] text-sm font-bold hover:text-white transition-colors relative z-10">
                                View Leaderboard &rarr;
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}