import { requireAuth } from "@/middleware/middleware";
import { Path } from "@/models/Path";
import { Sparkles, Flame, Trophy, Star, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
    // 1. Authenticate user
    const user = await requireAuth();

    // 2. We can try to populate skill details if needed
    // But for now we just show totalXP and currentStreak, and the role.

    // Parse the user object cleanly to avoid Mongoose doc issues if needed (though requireAuth uses JSON.parse(JSON.stringify)?)
    // Wait, getAuthUser() returns lean()? Let's make sure. requireAuth calls getAuthUser.

    return (
        <div className="min-h-screen bg-[hsl(210,25%,96%)] overflow-x-hidden pt-32 pb-24">

            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[hsl(217,91%,60%,0.1)] blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[hsl(199,89%,48%,0.1)] blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <p className="text-xs uppercase tracking-[0.3em] text-[hsl(217,91%,60%)] font-bold mb-4">
                        Your Journey
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-[hsl(215,25%,15%)] mb-4">
                        Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(217,91%,60%)] via-[hsl(199,89%,48%)] to-[hsl(217,91%,60%)] font-extrabold">{user.username}</span>
                    </h1>
                    <div className="flex justify-center items-center gap-2 mt-2 text-[hsl(215,15%,45%)] font-medium">
                        {user.role === 'admin' ? (
                            <span className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                <Shield size={14} /> Admin Access
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 bg-[hsl(210,20%,88%)] text-[hsl(215,25%,15%)] px-3 py-1 rounded-full text-xs font-bold">
                                Learner
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white/80 backdrop-blur-2xl border border-[hsl(210,20%,88%,0.6)] shadow-xl rounded-3xl p-8 mb-12 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[hsl(210,20%,88%)]">
                    <div className="flex-1 text-center py-6 md:py-4 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-[hsl(217,91%,60%,0.1)] flex items-center justify-center mb-3">
                            <Sparkles className="text-[hsl(217,91%,60%)]" size={24} />
                        </div>
                        <div className="text-4xl font-black text-[hsl(215,25%,15%)] mb-1">{user.totalXP}</div>
                        <div className="text-sm font-semibold text-[hsl(215,15%,45%)] uppercase tracking-wider">Total XP</div>
                    </div>

                    <div className="flex-1 text-center py-6 md:py-4 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-[hsl(199,89%,48%,0.1)] flex items-center justify-center mb-3">
                            <Flame className="text-[hsl(199,89%,48%)]" size={24} />
                        </div>
                        <div className="text-4xl font-black text-[hsl(215,25%,15%)] mb-1">{user.currentStreak} <span className="text-xl text-[hsl(215,15%,45%)]">days</span></div>
                        <div className="text-sm font-semibold text-[hsl(215,15%,45%)] uppercase tracking-wider">Current Streak</div>
                    </div>

                    <div className="flex-1 text-center py-6 md:py-4 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-3">
                            <Trophy className="text-orange-500" size={24} />
                        </div>
                        <div className="text-4xl font-black text-[hsl(215,25%,15%)] mb-1">
                            {user.skills?.length || 0}
                        </div>
                        <div className="text-sm font-semibold text-[hsl(215,15%,45%)] uppercase tracking-wider">Skills In Progress</div>
                    </div>
                </div>

                {/* Quick Actions / Link to Admin or Paths */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Link href="/paths" className="group bg-white/60 backdrop-blur-xl border border-[hsl(210,20%,88%,0.5)] shadow-lg rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300 block">
                        <div className="flex items-start justify-between mb-5">
                            <div className="w-12 h-12 rounded-xl bg-[hsl(217,91%,60%,0.1)] flex items-center justify-center">
                                <Star className="text-[hsl(217,91%,60%)]" size={22} />
                            </div>
                            <ArrowRight className="text-[hsl(215,15%,45%)] group-hover:text-[hsl(217,91%,60%)] group-hover:translate-x-1 transition-all" />
                        </div>
                        <h3 className="text-xl font-bold text-[hsl(215,25%,15%)] mb-2">Continue Learning</h3>
                        <p className="text-[hsl(215,15%,45%)] leading-relaxed font-medium">Browse active paths and pick up where you left off. Every sprint counts!</p>
                    </Link>

                    {user.role === 'admin' && (
                        <Link href="/admin" className="group bg-gradient-to-br border border-[hsl(210,20%,88%,0.5)] from-[hsl(215,25%,15%)] to-[hsl(215,25%,10%)] shadow-lg rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300 block">
                            <div className="flex items-start justify-between mb-5">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                    <Shield className="text-white" size={22} />
                                </div>
                                <ArrowRight className="text-white group-hover:text-[hsl(217,91%,60%)] group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Admin Dashboard</h3>
                            <p className="text-gray-400 leading-relaxed font-medium">Manage users, adjust paths, and oversee the gamified platform operations.</p>
                        </Link>
                    )}
                </div>

            </div>
        </div>
    );
}
